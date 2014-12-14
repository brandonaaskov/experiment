angular.module('experiment').service('audio', function($window, $http, $q) {
  var audioContext = $window.AudioContext || $window.webkitAudioContext
  var context = new audioContext()
  var source = undefined
  var deferred = $q.defer()

  var onSoundLoadSuccess = function (res) {
    context.decodeAudioData(res.data, function (buffer) {
      source = context.createBufferSource()
      source.buffer = buffer
      deferred.resolve(buffer)
    })
  }

  var play = function (url) {
    load(url).then(function (buffer) {
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0)
    })
  }

  var load = function (url) {
    $http.get(url, {responseType: 'arraybuffer'}).then(onSoundLoadSuccess)
    deferred = $q.defer()
    return deferred.promise
  }

  return publicAPI = {
    load: load,
    play: play
  }
})
