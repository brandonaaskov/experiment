angular.module('experiment').directive('authService', function (auth) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'auth-service.html',
    scope: {
      service: '@'
    },
    link: function (scope) {
      var isConnected = function () {
        return auth.isService(scope.service)
      }

      var init = function () {
        scope.status = {
          isConnected: auth.isService(scope.service),
          profileUrl: getLink()
        }
      }

      var login = function () {
        auth.login(scope.service).then(function (user) {
          scope.user = user
          init()
        })
      }

      var logout = function () {
        auth.logout()
      }

      var getLink = function () {
        if (!isConnected()) return

        var user = auth.getUser()
        var url

        if (user && _(user).has('cachedUserProfile')) {
          if (_(user.cachedUserProfile).has('link')) url = user.cachedUserProfile.link
          if (_(user.cachedUserProfile).has('url')) url = user.cachedUserProfile.url
        }

        return url
      }

      init()

      scope.logout = logout
      scope.login = login
      scope.getLink = getLink
      scope.isConnected = isConnected
    }
  }
})
