angular.module('experiment').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html'
    })
    .when('/speech', {
      templateUrl: 'speech.html'
    })
    .when('/drum', {
      templateUrl: 'drum-machine.html'
    })
    .when('/404', {
      templateUrl: '404.html'
    })
    .otherwise({
      redirectTo: '/404'
    })

  $locationProvider.html5Mode(false)
})
