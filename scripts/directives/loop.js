angular.module('experiment').directive('loop', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'loop.html',
    scope: {
      collection: '='
    }
  }
})
