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
      console.log('track: scope.totalBeats', scope.totalBeats)
      var models = []
      for (var i = 0, length = scope.totalBeats; i < length; i++) {
        models.push(new BeatModel())
      }
      scope.collection = new BeatCollection(models)
    }
  }
})
