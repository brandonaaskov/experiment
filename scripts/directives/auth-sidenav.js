angular.module('experiment').directive('authSidenav', function (auth) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'auth-sidenav.html',
    link: function (scope) {
      scope.user = auth.getUser()

      auth.login().then(function (user) {
        scope.user = user
      })
    }
  }
})
