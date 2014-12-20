angular.module('experiment').directive('track', function (BeatCollection, BeatModel) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'track.html',
    scope: {
      instrument: '=',
      totalBeats: '='
    },

    link: function (scope) {
      var models = []
      for (var i = 0, length = scope.totalBeats; i < length; i++) {
        models.push(new BeatModel())
      }
      scope.beatCollection = new BeatCollection(models)

      scope.$on('playInstrument', function () {
        console.log('playInstrument fired')
        scope.instrument.playSound()
      })
    }
  }
})
