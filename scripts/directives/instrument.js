angular.module('experiment').directive('instrument', function ($window, $http, audio) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '='
    },
    templateUrl: 'instrument.html',

    link: function (scope, element) {
      scope.enabled = false

      element.bind('click', function () {
        scope.$apply(function () {
          scope.model.set('enabled', !scope.model.get('enabled'))
          scope.model.loadSound()
        })
      })
    }
  }
})
