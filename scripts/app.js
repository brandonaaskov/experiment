angular.module('experiment', [
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'ngMaterial',
  'ngAria',
  'templates',
  'firebase'
]).run(function ($cookies, utils, analytics) {
  if (!$cookies.guid) {
    $cookies.guid = utils.createGuid()
  }

  analytics.identify($cookies.guid)
})
