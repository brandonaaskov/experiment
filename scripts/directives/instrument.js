angular.module('experiment').directive('instrument', function () {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    templateUrl: 'instrument.html',

    link: function (scope, element) {
      scope.enabled = false

      element.bind('click', function () {
        scope.$apply(function () {
          scope.enabled = !scope.enabled
        })
      })
    }
  }
})