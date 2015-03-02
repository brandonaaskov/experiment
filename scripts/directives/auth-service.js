angular.module('experiment').directive('authService', function (auth) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'auth-service.html',
    scope: {
      service: '@'
    },
    link: function (scope) {
      scope.user = auth.user
      scope.logout = auth.logout

      scope.isConnected = function () {
        return auth.getUserService(scope.service)
      }

      scope.login = function () {
        auth.login(scope.service)
      }
    }
  }
})
