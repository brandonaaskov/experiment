angular.module('experiment', [
  'ngRoute',
  'ngCookies',
  'templates',
  'firebase',
  'ui.bootstrap'
]).run(function ($cookies, utils, analytics) {
  if (!$cookies.guid) {
    $cookies.guid = utils.createGuid()
  }

  analytics.identify($cookies.guid)
})

angular.module('experiment').factory('BaseCollection', function (BaseModel) {

  var BaseCollection = (function () {
    BaseCollection.prototype.model = BaseModel

    function BaseCollection(models) {
      if (!models) return

      var isSingular = ! _(models).isArray()
      if (isSingular) this.models = [models]
      else this.models = models

      this.models = (this.models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new BaseModel(model)
      })
    }

    return BaseCollection
  })()

  return BaseCollection
})

angular.module('experiment').factory('InstrumentCollection', function (BaseCollection, BaseModel, InstrumentModel) {

  var InstrumentCollection = (function () {
    InstrumentCollection.prototype = Object.create(BaseCollection.prototype)
    InstrumentCollection.prototype.model = InstrumentModel
    
    InstrumentCollection.prototype.activateNext = function () {
      var activeModel = _(this.models).find(function (model) {
        return model.get('active')
      })

      if (activeModel) {
        var currentIndex = this.models.indexOf(activeModel)
        var nextIndex = (currentIndex + 1 < this.models.length) ? currentIndex + 1 : 0
        this.models[currentIndex].set('active', false)
        this.models[nextIndex].set('active', true)
      }
      else if (!_.isEmpty(this.models)) {
        _.first(this.models).set('active', true)
      }
    }

    function InstrumentCollection(models) {
      if (!models) return

      var isSingular = ! _(models).isArray()
      if (isSingular) this.models = [models]
      else this.models = models

      this.models = (this.models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new InstrumentModel(model)
      })

      BaseCollection.call(this, this.models)
    }

    return InstrumentCollection
  })()

  return InstrumentCollection
})


angular.module('experiment').controller('uploadsController', function($scope, firebase) {
  $scope.userUploads = []
  $scope.gridOptions = {
    data: 'userUploads',
    columnDefs: [
      {
        field: 'displayName',
        displayName: 'Name'
      }, {
        field: 'filename',
        displayName: 'Filename'
      }, {
        field: 'job',
        displayName: 'Zencoder Job'
      }, {
        field: 'size',
        displayName: 'Size'
      }
    ]
  }
  return $scope.userUploads = firebase.userUploads
})

angular.module('experiment').service('config', function ($window) {
  return {
    env: 'development',
    firebase: {
      default: new $window.Firebase('https://gunslngr.firebaseio.com/'),
      users: new $window.Firebase('https://gunslngr.firebaseio.com/users'),
      clock: new $window.Firebase('https://gunslngr.firebaseio.com/.info/serverTimeOffset'),
      auth: {
        facebook: {
          scope: 'user_friends,user_birthday,friends_birthday',
          rememberMe: true
        },
        github: {
          scope: 'user:email',
          rememberMe: true
        },
        twitter: {
          rememberMe: true
        }
      }
    }
  }
})

var routes = {
  '/': {
    templateUrl: 'home.html'
  },
  '/speech': {
    templateUrl: 'speech.html'
  },
  '/splice': {
    templateUrl: 'splice.html'
  }
}

angular.module('experiment').config(function($routeProvider) {
  for (var route in routes) {
    $routeProvider.when(route, routes[route])
  }

  return $routeProvider.otherwise({
    redirectTo: '/404'
  })
})


angular.module('experiment').directive('contenteditable', function() {
  return {
    restrict: 'A',
    require: "ngModel",
    scope: {
      onBlur: '&'
    },
    link: function(scope, element, attrs, ngModel) {
      element.bind('keypress', (function(_this) {
        return function(event) {
          if (event.keyCode !== 13) {
            return
          }
          event.preventDefault()
          return $(element).trigger('blur')
        }
      })(this))
      element.bind("blur", function() {
        return scope.$apply(function() {
          ngModel.$setViewValue(element.html())
          element.addClass('edited')
          return scope.onBlur()
        })
      })
      ngModel.$render = (function(_this) {
        return function() {
          return element.html(ngModel.$viewValue)
        }
      })(this)
      return ngModel.$render()
    }
  }
})

angular.module('experiment').directive('drumMachine', function ($interval, InstrumentCollection, InstrumentModel) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'drum-machine.html',

    link: function (scope, element) {
      var bpmToMs = function (bpm) {
        return Math.round(60/bpm * 1000)
      }

      var play = function () {
        scope.isPlaying = true
        loop = $interval(function () {
          scope.kickCollection.activateNext()
        }, bpmToMs(scope.song.bpm))
      }

      var stop = function () {
        scope.isPlaying = false
        $interval.cancel(loop)
      }

      var getTotalBeats = function () {
        return scope.song.beats * scope.song.measures
      }

      var loop = undefined
      scope.isPlaying = false
      scope.song = {
        beats: 4,
        measures: 2,
        bpm: 120
      }

      scope.play = play
      scope.stop = stop

      var models = []
      for (var i = 0; i < getTotalBeats(); i++) {
        var model = new InstrumentModel({sound: 'kick.mp3'})
        models.push(model)
      }

      scope.kickCollection = new InstrumentCollection(models)
    }
  }
})


angular.module('experiment').directive('filepicker', function($window, firebase, analytics, zencoder) {
  return {
    restrict: 'A',
    link: function(scope) {
      scope.filepicker = $window.filepicker
      return scope.filepicker.setKey('AiCDu1zCuQQysPoX9Mb9bz')
    },
    controller: function($scope) {
      var error, options, saveUploads, startJobs, success
      options = {
        picker: {
          services: ['COMPUTER', 'DROPBOX', 'BOX', 'GOOGLE_DRIVE'],
          container: 'window',
          multiple: true,
          mimetype: 'video/*'
        },
        store: {
          path: "uploads/" + firebase.guid + "/"
        }
      }
      success = function(inkBlob) {
        saveUploads(inkBlob)
        startJobs(inkBlob)
        return analytics.track('Upload: Success', inkBlob)
      }
      error = function(FPError) {
        return analytics.track('Upload: Error', FPError.toString())
      }
      saveUploads = function(inkBlob) {
        return _(inkBlob).each(function(file) {
          var filename
          filename = _.getFilename(file.key)
          file.displayName = filename
          firebase.userUploads[filename] = file
          return firebase.userUploads.$save(filename)
        })
      }
      startJobs = function(inkBlob) {
        var keys
        keys = _(inkBlob).pluck('key')
        return _(keys).each(function(filepath) {
          var filename
          filename = _.getFilename(filepath)
          console.log('filename', filename)
          return zencoder.createJob(filepath).then(function(response) {
            firebase.userUploads.$child(filename).$update({
              job: response.data.id
            })
            return firebase.userEncodes.$child(filename).$update({
              jobId: response.data.id,
              files: response.data.outputs
            })
          })
        })
      }
      return $scope.pick = function() {
        return $scope.filepicker.pickAndStore(options.picker, options.store, success, error)
      }
    }
  }
})

angular.module('experiment').directive('icon', function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'icon.html',
    scope: {
      glyph: '@'
    }
  }
})

angular.module('experiment').directive('instrument', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '='
    },
    templateUrl: 'instrument.html',

    link: function (scope, element) {
      scope.enabled = false

      element.bind('click', function () {
        scope.$apply(function () {
          scope.model.set('enabled', !scope.model.get('enabled'))
        })
      })
    }
  }
})

angular.module('experiment').directive('navigation', function (auth) {
  return  {
    restrict: 'E',
    replace: true,
    templateUrl: 'navigation.html',
    link: function (scope) {
      scope.auth = auth
    }
  }
})


angular.module('experiment').directive('player', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'player.html',
    scope: {
      video: '=',
      playlist: '='
    },
    link: function(scope) {
      return videojs('player').ready(function() {
        if (!!scope.player) {
          return
        }
        scope.player = this
        return this.on('ended', function() {
          var nextVideo
          nextVideo = _.at(scope.playlist, scope.video.id)
          return console.log('nextvideo', nextVideo)
        })
      })
    },
    controller: function($scope) {
      $scope.$watch('playlist', function(playlist) {
        var _ref
        console.log('playlist', playlist)
        return $scope.video = getPlaybackVideo(playlist[(_ref = $scope.video) != null ? _ref.id : void 0])
      })
      return $scope.$watch('video', function(video) {
        if (!video) {
          return $scope.video = getPlaybackVideo($scope != null ? $scope.playlist[video != null ? video.id : void 0] : void 0)
        }
      })
    }
  }
})

angular.module('experiment').directive('speechToggle', function($rootScope) {
  return {
    restrict: 'EA',
    templateUrl: 'speech-toggle.html',
    link: function(scope, element) {
      scope.speaking = false
      scope.speechEnabled = true

      scope.disableSpeech = function() {
        $rootScope.$broadcast('ba-speech-disable')
      }

      scope.enableSpeech = function() {
        $rootScope.$broadcast('ba-speech-enable')
      }

      $rootScope.$on('ba-speech-disable', function() {
        scope.$apply(function () {
          scope.speechEnabled = false
        })
      })

      $rootScope.$on('ba-speech-enable', function() {
        scope.$apply(function () {
          scope.speechEnabled = true
        })
      })

      var toggle = function() {
        if (scope.speechEnabled) {
          $rootScope.$broadcast('ba-speech-disable')
        } else {
          $rootScope.$broadcast('ba-speech-enable')
        }
      }

      element.bind('click', function () {
        toggle()
      })
    }
  }
})

angular.module('experiment').directive('speech', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (!$window.speechSynthesis) return

      scope.enabled = true
      element.addClass('ba-speech')
      var utterance = new $window.SpeechSynthesisUtterance()
      var toggleSpeaking = function(flag) {
        if (flag) {
          element.addClass('speaking')
        } else {
          element.removeClass('speaking')
        }

        scope.speaking = flag
      }

      utterance.onstart = function() {
        toggleSpeaking(true)
      }

      utterance.onend = function() {
        toggleSpeaking(false)
      }

      utterance.onpause = function() {
        toggleSpeaking(false)
      }

      utterance.onresume = function() {
        toggleSpeaking(true)
      }

      $window.speechSynthesis.onvoiceschanged = function () {
        utterance.voice = getVoice(attrs.language)

        if (attrs.debug) {
          console.log(utterance.voice)
        }

        utterance.voiceURI = utterance.voice.voiceURI
        utterance.lang = utterance.voice.lang
        utterance.volume = 1.0
        utterance.rate = 1.2
        utterance.pitch = 1
      }

      var getVoice = function(language) {
        var voices = $window.speechSynthesis.getVoices()

        var systemDefault = _(voices).findWhere({
          "default": true
        })

        var override = _(voices).findWhere({
          lang: language
        })

        if (override) {
          return override
        } else {
          return systemDefault
        }
      }

      var speak = function(words) {
        if (!(words && scope.enabled)) return

        utterance.text = words
        $window.speechSynthesis.speak(utterance)
      }

      angular.element(element).bind('click', function() {
        $window.speechSynthesis.cancel()
        speak(attrs.speech)
      })

      scope.$on('ba-speech-disable', function() {
        $window.speechSynthesis.cancel()
        scope.enabled = false
      })

      scope.$on('ba-speech-enable', function() {
        scope.enabled = true
      })
    }
  }
})

angular.module('experiment').filter('range', function () {
  return function (input, total) {
    total = parseInt(total)
    for (var i = 0; i < total; i++) input.push(i)
    return input
  }
})

angular.module('experiment').factory('BaseModel', function (utils) {
  var BaseModel = (function () {

    function BaseModel (attrs) {
      this.attributes = attrs || {}
    }

    BaseModel.prototype.get = function (key) {
      return utils.findValue(this.attributes, key)
    }

    BaseModel.prototype.set = function (key, val) {
      var attrs = undefined

      if (typeof key == 'object') attrs = key
      else {
        attrs = {}
        attrs[key] = val

        for (var aKey in attrs) {
          var aVal = attrs[aKey];
          this.attributes[aKey] = aVal;
        }

      }
    }

    return BaseModel
  })()

  return BaseModel
})

angular.module('experiment').factory('InstrumentModel', function (BaseModel) {
  var InstrumentModel = (function () {

    InstrumentModel.prototype = Object.create(BaseModel.prototype)

    InstrumentModel.prototype.toggleActive = function () {
      this.attributes.active = !this.attributes.active
    }

    function InstrumentModel (attrs) {
      var defaults = {
        type: 'drum',
        name: 'kick',
        active: false
      }

      BaseModel.call(this, _.defaults(attrs, defaults))
    }

    return InstrumentModel
  })(BaseModel)

  return InstrumentModel
})

angular.module('experiment').factory('analytics', function() {
  var methods = {}
  _(['page', 'pageview', 'track', 'identify']).each(function(method) {
    return methods[method] = function() {
      var args = [].slice.call(arguments, 0)
      return window.analytics[method].apply(window.analytics, args)
    }
  })

  return methods
}).run(function(analytics, $rootScope) {
  $rootScope.$on("$routeChangeSuccess", function() {
    analytics.page()
  })
})

angular.module('experiment').service('auth', function($firebase, $firebaseAuth, $cookies, config, $rootScope) {
  var auth = $firebaseAuth(config.firebase.default)
  var users = $firebase(config.firebase.users)
  var user = undefined
  var unbindUser = undefined

  var bindUser = function () {
    var authData = auth.$getAuth()
    user = (authData) ? $firebase(config.firebase.users.child(authData.uid)).$asObject() : null

    $rootScope.user = user
    if (user) user.$bindTo($rootScope, "user").then(function (unbind) {
      unbindUser = unbind
    })
  }

  var updateUser = function(authData) {
    if (auth.$getAuth()) users.$update(authData.uid, authData[authData.provider])
    else users.$set(authData.uid, authData[authData.provider])

    bindUser()
  }

  var authError = function (error) {
    console.error('login error', error)
  }

  var login = function(service) {
    switch (service) {
      case 'facebook':
        return auth.$authWithOAuthPopup('facebook')
            .then(updateUser)
            .catch(authError)
      case 'github':
        return auth.$authWithOAuthPopup('github')
            .then(updateUser)
            .catch(authError)
      case 'twitter':
        return auth.$authWithOAuthPopup('twitter')
            .then(updateUser)
            .catch(authError)
    }
  }

  var logout = function () {
    unbindUser()
    auth.$unauth()
    $rootScope.user = null
  }

  // init
  bindUser()

  return {
    login: login,
    logout: logout
  }
})

angular.module('experiment').service('firebase', function($firebase, $cookies, config, $rootScope, $q) {
  var clock = new Firebase(config.firebase.clock)
  guid = $cookies.guid

  getServerTime = function() {
    var deferred = $q.defer()
    clock.on('value', function(snap) {
      var offset = Date.now() + snap.val()
      return deferred.resolve(offset)
    })
    return deferred.promise
  }

  return publicAPI = {
    getServerTime: getServerTime,
    guid: guid
  }
})


angular.module('experiment').service('liveSync', function(firebase, $window) {
  var AudioContext, publicApi, sync
  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  AudioContext = $window.AudioContext || $window.webkitAudioContext
  sync = function(startTime, now, videoLength) {
    var constraints, jumpTo, success
    jumpTo = (now - startTime) % videoLength
    console.log('jumpTo (in seconds)', jumpTo / 1000)
    console.log('jumpTo (in minutes)', jumpTo / 1000 / 60)
    constraints = {
      video: false,
      audio: true
    }
    success = function(stream) {
      var context, filter, microphone
      context = new AudioContext()
      microphone = context.createMediaStreamSource(stream)
      filter = context.createBiquadFilter()
      microphone.connect(filter)
      return filter.connect(context.destination)
    }
    return navigator.getMedia(constraints, success)
  }
  firebase.getServerTime().then(function(offset) {
    var fakeVideoLength, noonToday
    noonToday = 1395687600000
    fakeVideoLength = 22 * 60 * 1000
    return sync(noonToday, offset, fakeVideoLength)
  })
  return publicApi = {
    sync: sync
  }
})

angular.module('experiment').service('utils', function() {
  var isTrueObject = function(obj) {
    if (_.isUndefined(obj)) {
      return false
    }

    if (_.isObject(obj) && !_.isFunction(obj) && !_.isArray(obj) && !_.isElement(obj)) {
      return true
    }

    return false
  }

  var isValidNumber = function(number) {
    if (_(number).isNumber() && !_(number).isNaN()) {
      return true
    }

    return false
  }

  var makeNumber = function(text) {
    var possibleNumber = parseInt(text, 10)

    if (isValidNumber(possibleNumber)) {
      return possibleNumber
    }
    else {
      return text
    }
  }

  var findValue = function(obj, propToFind) {
    if (!_.isString(propToFind) || _.isEmpty(propToFind) || !obj) {
      throw new Error("The second argument supplied to findValue() should be a string of the property name that you're looking for.")
    }

    var foundValue = null

    _.find(obj, function(value, key) {
      if (String(key).toLowerCase() === String(propToFind).toLowerCase()) {
        foundValue = value
      }
      else if (_.isObject(value) && !_.isElement(value)) {
        foundValue = findValue(value, propToFind)
      }
      if (foundValue != null) {
        return foundValue
      }
    })

    return foundValue
  }

  var findValues = function(obj, arrOfValues) {
    if (!_.isArray(arrOfValues)) {
      throw new Error("findValues() expects an array of strings for property names to find")
    }

    var foundValues = {}

    _.each(arrOfValues, function(propToFind) {
      return foundValues[propToFind] = findValue(this, propToFind)
    }, obj)

    return foundValues
  }

  var override = function(startWith, overrideWith) {
    var cleaned = {}

    if (!_.isObject(startWith || !_.isObject(overrideWith))) {
      throw new Error("Both arguments supplied to override() should be shallow objects.")
    }

    cleaned = _.defaults(startWith, overrideWith)

    angular.forEach(startWith, function(value, key) {
      return angular.forEach(overrideWith, function(overrideItemValue, overrideItemKey) {
        if (key === overrideItemKey) {
          return cleaned[key] = overrideItemValue
        }
      })
    })

    return cleaned
  }

  var getFilename = function (key, dropExtension) {
    var filename = _.last(key.split('/'))
    if (!dropExtension) dropExtension = true

    if (!dropExtension) {
      return filename
    }

    return _.first(filename.split('.'))
  }

  var createGuid = function () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }

    return (s4()) + (s4()) + "-" + (s4()) + "-" + (s4()) + "-" + (s4()) + "-" + (s4()) + (s4()) + (s4())
  }

  return publicAPI = {
    isTrueObject: isTrueObject,
    isValidNumber: isValidNumber,
    makeNumber: makeNumber,
    findValue: findValue,
    findValues: findValues,
    override: override,
    getFilename: getFilename,
    createGuid: createGuid
  }
})


angular.module('experiment').service('zencoder', function($http, firebase) {
  var baseUrl, createJob, getJobProgress, getOutputs, guid, keys, publicApi
  guid = firebase.guid
  baseUrl = 'https://app.zencoder.com/api/v2'
  keys = {
    read: '92cdc58ec35e590acb0980f75ddfa32c',
    full: '380e390b6b8fd2d600c9035db7d13c29'
  }
  createJob = function(filepath) {
    return $http.post("" + baseUrl + "/jobs", getOutputs(filepath))
  }
  getJobProgress = function(jobId) {
    return $http.get("" + baseUrl + "/jobs/" + jobId + "/progress.json?api_key=" + keys.full)
  }
  getOutputs = function(filepath) {
    var filename
    filename = _.getFilename(filepath)
    baseUrl = "s3://fullscreen-tv"
    return {
      input: "" + baseUrl + "/" + filepath,
      outputs: [
        {
          label: "low",
          format: "mp4",
          video_bitrate: 200,
          decoder_bitrate_cap: 300,
          decoder_buffer_size: 1200,
          audio_sample_rate: 44100,
          height: "288",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-low.mp4",
          h264_reference_frames: 1,
          forced_keyframe_rate: "0.1",
          audio_bitrate: 56,
          decimate: 2,
          rrs: true
        }, {
          label: "high",
          format: "mp4",
          video_bitrate: 1000,
          decoder_bitrate_cap: 1500,
          decoder_buffer_size: 6000,
          audio_sample_rate: 44100,
          height: "432",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-high.mp4",
          h264_reference_frames: "auto",
          h264_profile: "main",
          forced_keyframe_rate: "0.1",
          audio_bitrate: 56,
          rrs: true
        }, {
          source: "low",
          segment_video_snapshots: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-audio-only.m4a",
          copy_audio: "true",
          skip_video: "true",
          label: "hls-audio-only",
          type: "segmented",
          format: "aac",
          rrs: true
        }, {
          source: "low",
          format: "ts",
          copy_audio: "true",
          copy_video: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-hls-low.mp4",
          label: "hls-low",
          type: "segmented",
          rrs: true
        }, {
          source: "high",
          format: "ts",
          copy_audio: "true",
          copy_video: "true",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + "-hls-high.mp4",
          label: "hls-high",
          type: "segmented",
          rrs: true
        }, {
          streams: [
            {
              path: "hls-low/" + filename + "-hls-low.m3u8",
              bandwidth: 256
            }, {
              path: "hls-audio-only/" + filename + "-hls-audio-only.m3u8",
              bandwidth: 56
            }, {
              path: "hls-high/" + filename + "-hls-high.m3u8",
              bandwidth: 1056
            }
          ],
          type: "playlist",
          url: "" + baseUrl + "/encodes/" + guid + "/" + filename + ".m3u8"
        }
      ]
    }
  }
  return publicApi = {
    createJob: createJob,
    getJobProgress: getJobProgress
  }
}).config(function($httpProvider) {
  $httpProvider.defaults.headers.common = {}
  $httpProvider.defaults.headers.post = {}
  return $httpProvider.defaults.headers.post['Zencoder-Api-Key'] = '380e390b6b8fd2d600c9035db7d13c29'
})
