angular.module('experiment').service('audio', function($window, $http, $q) {
  var audioContext = $window.AudioContext || $window.webkitAudioContext
  var deferred = $q.defer()
  var context = new audioContext()

  var onSoundLoadSuccess = function (res) {
    context.decodeAudioData(res.data, function (buffer) {
      deferred.resolve(buffer)
    })
  }

  var play = function (buffer) {
    if (_.isArray(buffer)) {
      _.reduce(buffer, function (audioPipe, source) {
        console.log('source', source) //TODO finish this reduce method
        return audioPipe.connect(source)
      })
    }
    else if (buffer instanceof AudioBuffer) {
      var source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0)
    }
    else {
      throw new Error("audio.play requires an AudioBuffer or an array of AudioBuffers")
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
