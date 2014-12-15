angular.module('experiment').directive('drumMachine', function ($interval, InstrumentCollection, InstrumentModel, audio) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'drum-machine.html',

    link: function (scope) {
      var bpmToMs = function (bpm) {
        return Math.round(60/bpm * 1000)
      }

      var play = function () {
        scope.isPlaying = true
        loop = $interval(function () {
          scope.kickCollection.activateNext()
          scope.snareCollection.activateNext()
          scope.hihatCollection.activateNext()
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
      scope.audio = audio

      var kickModels = []
      var snareModels = []
      var hihatModels = []

      for (var i = 0; i < getTotalBeats(); i++) {
        kickModels.push(new InstrumentModel({soundUrl: 'assets/sample-kick.mp3'}))
        snareModels.push(new InstrumentModel({soundUrl: 'assets/sample-snare.mp3'}))
        hihatModels.push(new InstrumentModel({soundUrl: 'assets/sample-hihat.mp3'}))
      }

      scope.kickCollection = new InstrumentCollection(kickModels)
      scope.snareCollection = new InstrumentCollection(snareModels)
      scope.hihatCollection = new InstrumentCollection(hihatModels)
    }
  }
})
