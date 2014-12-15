angular.module('experiment').service('audio', function($window, $http, $q) {
  var audioContext = $window.AudioContext || $window.webkitAudioContext
  var context = new audioContext()
  var deferred = $q.defer()

  var onSoundLoadSuccess = function (res) {
    context.decodeAudioData(res.data, function (buffer) {
      var source = context.createBufferSource()
      source.buffer = buffer
      deferred.resolve(source)
    })
  }

  var play = function (url) {
    load(url).then(function (source) {
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
