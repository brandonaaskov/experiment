angular.module('experiment', [
  'ngCookies',
  'templates',
  'firebase',
  'ui.bootstrap'
]).run(function ($cookies, utils, analytics, auth) {
  if (!$cookies.guid) {
    $cookies.guid = utils.createGuid()
  }

  console.log('app', [utils, auth])

  analytics.identify($cookies.guid)
})
