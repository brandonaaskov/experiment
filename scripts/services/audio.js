angular.module('experiment').service('audio', function($window, $http, $q) {
  var audioContext = $window.AudioContext || $window.webkitAudioContext
  var deferred = $q.defer()
  var context = new audioContext()

  var onSoundLoadSuccess = function (res) {
    context.decodeAudioData(res.data, function (buffer) {
      var source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      deferred.resolve(source)
    })
  }

  //TODO: this is the issue: the source objects need to connect in a chain first and then connect to the destination
  //TODO: an instrument shouldn't be a button on the screen. an instrument is == a row/loop/pattern

  var play = function (sound) {
    if (_.isArray(sound)) {
      _.each(sound, function (source) {

      })
    }
    if (sound instanceof AudioBufferSourceNode) sound.start(0)
    else {
      load(sound).then(play)
    }
  }

  var load = function (url) {
    if (!url) {
      throw new Error("Couldn't load sound because the URL was null/empty")
    }

    $http.get(url, {responseType: 'arraybuffer'}).then(onSoundLoadSuccess)
    deferred = $q.defer()
    return deferred.promise
  }

  return publicAPI = {
    load: load,
    play: play
  }
})
