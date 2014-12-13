angular.module('experiment').directive('navbar', function (auth) {
  return  {
    restrict: 'E',
    replace: false,
    templateUrl: 'navbar.html',
    link: function (scope) {
      scope.auth = auth
      scope.user = auth.user

      console.log('user', scope.user)
    }
  }
})
