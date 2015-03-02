angular.module('experiment').config(function($routeProvider, $locationProvider) {
  var routes = {
    '/': {
      templateUrl: 'home.html'
    },
    '/speech': {
      templateUrl: 'speech.html'
    },
    '/splice': {
      templateUrl: 'splice.html'
    },
    '/404': {
      templateUrl: '404.html'
    }
  }

  $locationProvider.html5Mode(true)

  for (var route in routes) {
    $routeProvider.when(route, routes[route])
  }

  $routeProvider.otherwise({
    redirectTo: '/404'
  })
})
