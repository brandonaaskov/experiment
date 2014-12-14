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
        var max = scope.kickCollection.models.length
        console.log('max', max)
        var count = -1
        loop = $interval(function () {
          /**
           * All of this gorilla math here is just because I really wanted the first button to light up first and not get skipped. And it's late and I'm tired. There's probably a simpler way of doing this but my tired brain can't see that.
           *
           * TODO I just realized what to do: the collection is responsible for handling this information. Go young grasshopper. Seek greener pastures.
           */
          if (count < 0) count = 0 //makes sure we don't try for -1
          scope.kickCollection.models[count].set('active', false)
          if (count + 1 >= max) count = -1 //does the future look dark?
          else count = count + 1
          scope.kickCollection.models[count].set('active', true)
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
    }
  }
})
