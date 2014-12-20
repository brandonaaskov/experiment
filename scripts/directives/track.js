angular.module('experiment').directive('track', function (InstrumentCollection) {
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
    }
  }
})
