angular.module('experiment', [
  'ngRoute',
  'ngCookies',
  'templates',
  'firebase',
  'ui.bootstrap'
]).run(function ($cookies, utils, analytics) {
  if (!$cookies.guid) {
    $cookies.guid = utils.createGuid()
  }

  analytics.identify($cookies.guid)
})
