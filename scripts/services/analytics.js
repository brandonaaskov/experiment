angular.module('experiment').factory('analytics', function() {
  var methods = {}
  _(['page', 'pageview', 'track', 'identify']).each(function(method) {
    return methods[method] = function() {
      var args = [].slice.call(arguments, 0)
      return window.analytics[method].apply(window.analytics, args)
    }
  })

  return methods
}).run(function(analytics, $rootScope) {
  $rootScope.$on("$routeChangeSuccess", function() {
    analytics.page()
  })
})
