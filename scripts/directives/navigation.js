angular.module('experiment').directive('navigation', function (auth) {
  return  {
    restrict: 'E',
    replace: true,
    templateUrl: 'navigation.html',
    link: function (scope) {
      scope.auth = auth
    }
  }
})
