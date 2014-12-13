angular.module('experiment').service('firebase', function($firebase, $cookies, config, $rootScope, $q) {
  var clock = new Firebase(config.firebase.clock)
  guid = $cookies.guid

  getServerTime = function() {
    var deferred = $q.defer()
    clock.on('value', function(snap) {
      var offset = Date.now() + snap.val()
      return deferred.resolve(offset)
    })
    return deferred.promise
  }

  return publicAPI = {
    getServerTime: getServerTime,
    guid: guid
  }
})
