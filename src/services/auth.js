angular.module('experiment').service('auth', function($firebase, $firebaseAuth, $cookies, config, $q) {
  var auth = $firebaseAuth(config.firebase.default)
  var users = $firebase(config.firebase.users)
  var deferred = $q.defer()

  var init = function () {
    var user = getUser()
    if (user) {
      deferred.resolve(user)
    }
  }

  var getUser = function () {
    var authData = auth.$getAuth()

    return (authData) ? authData[authData.provider] : null
  }

  var updateUser = function(authData) {
    if (auth.$getAuth()) {
      users.$update(authData.uid, authData[authData.provider])
    }
    else {
      users.$set(authData.uid, authData[authData.provider])
    }

    deferred.resolve(getUser())
  }

  var authError = function (error) {
    console.error('login error', error)
  }

  var login = function(service) {
    switch (service) {
      case 'facebook':
        auth.$authWithOAuthPopup('facebook').then(updateUser).catch(authError)
        break
      case 'github':
        auth.$authWithOAuthPopup('github').then(updateUser).catch(authError)
        break
      case 'twitter':
        auth.$authWithOAuthPopup('twitter').then(updateUser).catch(authError)
        break
      case 'google':
        auth.$authWithOAuthPopup('google').then(updateUser).catch(authError)
        break
    }

    return deferred.promise
  }

  var logout = function () {
    auth.$unauth()
    deferred = $q.defer()
  }
  
  var isService = function (provider) {
    if (!_(auth.$getAuth()).has('provider')) {
      return
    }

    return auth.$getAuth().provider === provider
  }

  init()

  return {
    login: login,
    logout: logout,
    isService: isService,
    getUser: getUser
  }
})
