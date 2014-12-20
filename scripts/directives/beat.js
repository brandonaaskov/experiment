angular.module('experiment').directive('beat', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'beat.html',
    scope: {
      model: '='
    },

    link: function (scope, element) {
      element.bind('click', function () {
        scope.$apply(function () {
          scope.model.set('enabled', !scope.model.get('enabled'))
        })
      })
    }
  }
})
