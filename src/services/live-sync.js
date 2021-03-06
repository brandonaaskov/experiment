
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
