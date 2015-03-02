angular.module('experiment').service('auth', function($firebase, $firebaseAuth, $cookies, config, $rootScope) {
  var auth = $firebaseAuth(config.firebase.default)
  var users = $firebase(config.firebase.users)
  var user = undefined
  var unbindUser = undefined

  var bindUser = function () {
    var authData = auth.$getAuth()
    user = (authData) ? $firebase(config.firebase.users.child(authData.uid)).$asObject() : null

    $rootScope.user = user
    if (user) user.$bindTo($rootScope, "user").then(function (unbind) {
      unbindUser = unbind
    })
  }

  var updateUser = function(authData) {
    if (auth.$getAuth()) users.$update(authData.uid, authData[authData.provider])
    else users.$set(authData.uid, authData[authData.provider])

    bindUser()
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
      case 'google':
        return auth.$authWithOAuthPopup('google')
            .then(updateUser)
            .catch(authError)
    }
  }

  var logout = function () {
    unbindUser()
    auth.$unauth()
    $rootScope.user = null
  }
  
  var getUserService = function (service) {
    if (!_(user).has('$id')) return;

    return !!user.$id.match(service)
  }

  // init
  bindUser()

  return {
    login: login,
    logout: logout,
    user: user,
    getUserService: getUserService
  }
})
