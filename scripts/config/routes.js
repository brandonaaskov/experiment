var routes = {
  '/': {
    templateUrl: 'home.html'
  },
  '/speech': {
    templateUrl: 'speech.html'
  },
  '/splice': {
    templateUrl: 'splice.html'
  }
}

angular.module('experiment').config(function($routeProvider) {
  for (var route in routes) {
    $routeProvider.when(route, routes[route])
  }

  return $routeProvider.otherwise({
    redirectTo: '/404'
  })
})
