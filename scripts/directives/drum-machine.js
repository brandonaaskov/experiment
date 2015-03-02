angular.module('experiment').directive('drumMachine', function ($interval, $rootScope, InstrumentModel, audio) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'drum-machine.html',

    link: function (scope, element, attrs) {
      var bpmToMs = function (bpm) {
        return Math.round(60/bpm * 1000)
      }

      var play = function () {
        scope.isPlaying = true
        loop = $interval(function () {
          $rootScope.$broadcast('activateNextBeat')
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

      scope.$watch('song.bpm', function () {
        if (scope.isPlaying) {
          scope.stop()
          scope.play()
        }
      })

      scope.play = play
      scope.stop = stop
      scope.audio = audio

      var instruments = [{
        soundUrl: 'assets/sounds/sample-kick.mp3',
        name: 'kick'
      },{
        soundUrl: 'assets/sounds/sample-snare.mp3',
        name: 'snare'
      },{
        soundUrl: 'assets/sounds/sample-hihat.mp3',
        name: 'hihat'
      },{
        soundUrl: 'assets/sounds/sample-clap.mp3',
        name: 'clap'
      },{
        soundUrl: 'assets/sounds/sample-clap.mp3',
        name: 'ALWAYS KICK. BUG!'
      }]

      scope.instruments = _(instruments).map(function (instrument) {
        return new InstrumentModel(instrument)
      })
    }
  }
})
