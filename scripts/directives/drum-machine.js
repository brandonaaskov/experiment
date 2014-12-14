angular.module('experiment').directive('drumMachine', function ($interval, BaseCollection, InstrumentModel) {
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
      scope.getTotalBeats = getTotalBeats

      var models = []
      for (var i = 0; i < getTotalBeats(); i++) {
        var model = new InstrumentModel({sound: 'kick.mp3'})
        models.push(model)
      }

      scope.kickCollection = new BaseCollection(models)
      console.log('collection.models', scope.kickCollection.models)
    }
  }
})
