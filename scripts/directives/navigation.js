angular.module('experiment').directive('navigation', function ($location, $mdSidenav) {
  return  {
    restrict: 'E',
    replace: true,
    templateUrl: 'navigation.html',
    link: function (scope) {
      scope.openAuth = function () {
        $mdSidenav('auth').toggle()
      }

      scope.goTo = function (url) {
        $location.url(url);
      }
    }
  }
})
