var routes = {
  '/': {
    templateUrl: 'speech.html'
  },
  '/drum-machine': {
    templateUrl: 'drum-machine.html'
  }
}

angular.module('experiment').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true)

  for (var route in routes) {
    $routeProvider.when(route, routes[route])
  }

  return $routeProvider.otherwise({
    redirectTo: '/404'
  })
})
