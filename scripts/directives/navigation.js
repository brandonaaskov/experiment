angular.module('experiment').directive('navigation', function () {
  return  {
    restrict: 'E',
    replace: true,
    templateUrl: 'navigation.html',
    link: function (scope) {
      console.log('navbar', scope)
      //scope.auth = auth
      //scope.user = auth.user
      //
      //console.log('user', scope.user)
    }
  }
})
