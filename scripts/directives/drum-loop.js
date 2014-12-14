angular.module('experiment').directive('drumLoop', function ($interval, utils) {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: 'drum-loop.html',

    link: function (scope) {
      var loop = undefined
      scope.isPlaying = false
      scope.timeSignature = {
        beats: 4,
        note: 4
      }

      var setTimeSignature = function (beats, note) {
        var beats = beats || 4
        var note = note || 4

        var timeSignature = {
          beats: beats,
          note: note
        }

        utils.override(scope.timeSignature, timeSignature)
      }

      var beatsPerMillisecond = function (bpm) {
        var bpm = bpm || 120
        return Math.round(60/bpm * 1000)
      }

      var play = function () {
        scope.isPlaying = true
        loop = $interval(function () {
        }, beatsPerMillisecond())
      }

      var stop = function () {
        scope.isPlaying = false
        $interval.cancel(loop)
      }

      //init
      setTimeSignature()

      scope.play = play
      scope.stop = stop
    }
  }
})
