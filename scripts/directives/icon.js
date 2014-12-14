angular.module('experiment').directive('icon', function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'icon.html',
    scope: {
      glyph: '@'
    }
  }
})
