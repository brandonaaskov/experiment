angular.module('experiment').directive('drumMachine', function ($interval, InstrumentModel, audio) {
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
          console.log('play the drum machine')
          //scope.kickCollection.activateNext()
          //scope.snareCollection.activateNext()
          //scope.hihatCollection.activateNext()
        }, bpmToMs(scope.song.bpm))
      }

      var stop = function () {
        scope.isPlaying = false
        $interval.cancel(loop)
      }

      var loop = undefined
      scope.isPlaying = false
      scope.song = {
        beats: 4,
        measures: 2,
        bpm: 120
      }
      scope.song.totalBeats = scope.song.beats * scope.song.measures

      scope.play = play
      scope.stop = stop
      scope.audio = audio


      var instruments = [{
        soundUrl: 'assets/sample-kick.mp3',
        name: 'kick'
      },{
        soundUrl: 'assets/sample-snare.mp3',
        name: 'snare'
      },{
        soundUrl: 'assets/sample-hihat.mp3',
        name: 'hihat'
      }]

      scope.instruments = _(instruments).map(function (instrument) {
        return new InstrumentModel(instrument)
      })

      console.log('scope.instruments', scope.instruments)
    }
  }
})
