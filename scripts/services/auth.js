angular.module('experiment').service('auth', function($firebase, $firebaseAuth, $cookies, config, $rootScope) {
  var auth = $firebaseAuth(config.firebase.default)
  var users = $firebase(config.firebase.users)
  var user = undefined

  var updateUser = function(authData) {
    if (auth.$getAuth()) users.$set(authData.uid, authData[authData.provider])
    else users.$update(authData.uid, authData[authData.provider])

    user = $firebase(config.firebase.users.child(authData.uid)).$asObject()
    $rootScope.user = user
    user.$bindTo($rootScope, "user")
    console.log('firebase user', $rootScope.user)
  }

  var authError = function (error) {
    console.error('login error', error)
  }

  var login = function(service) {
    switch (service) {
      case 'facebook':
        return auth.$authWithOAuthPopup('facebook')
            .then(updateUser)
            .catch(authError)
      case 'github':
        return auth.$authWithOAuthPopup('github')
            .then(updateUser)
            .catch(authError)
      case 'twitter':
        return auth.$authWithOAuthPopup('twitter')
            .then(updateUser)
            .catch(authError)
    }
  }

  return {
    login: login,
    user: user
  }
})
