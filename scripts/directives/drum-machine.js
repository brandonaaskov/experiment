angular.module('experiment').directive('drumMachine', function ($interval) {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: 'drum-machine.html',

    link: function (scope, element) {

      element.find('instrument')

      var loop = undefined
      scope.isPlaying = false
      scope.song = {
        beats: 4,
        measures: 2,
        bpm: 120
      }

      var bpmToMs = function (bpm) {
        return Math.round(60/bpm * 1000)
      }

      var play = function () {
        scope.isPlaying = true
        loop = $interval(function () {
        }, bpmToMs(scope.song.bpm))
      }

      var stop = function () {
        scope.isPlaying = false
        $interval.cancel(loop)
      }

      scope.play = play
      scope.stop = stop    
    }
  }
})
