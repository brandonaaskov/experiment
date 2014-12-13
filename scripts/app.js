angular.module('experiment', [
  'ngRoute',
  'ngCookies',
  'templates',
  'firebase',
  'ui.bootstrap'
]).config(function () {
  console.log('config block')
}).run(function ($cookies, utils, analytics) {
  console.log('app run block', utils)

  if (!$cookies.guid) {
    $cookies.guid = utils.createGuid()
  }

  analytics.identify($cookies.guid)
})
