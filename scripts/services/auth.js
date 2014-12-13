angular.module('experiment').service('auth', function($firebase, $firebaseAuth, $cookies, config) {
  var auth = $firebaseAuth(new Firebase(config.firebase.default))
  var users = $firebase(new Firebase(config.firebase.users))
  var user = undefined

  var updateUser = function(authData) {
    if (auth.$getAuth()) users.$set(authData.uid, authData[authData.provider])
    else users.$update(authData.uid, authData[authData.provider])

    user = $firebase(new Firebase(config.firebase.users + '/' + authData.uid))
    console.log('auth.$getAuth()', auth.$getAuth())
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
