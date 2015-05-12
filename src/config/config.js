angular.module('experiment').service('config', function ($window) {
  return {
    env: 'development',
    filepicker: 'AQPk06MnRzuRnlvIDdgw4z',
    firebase: {
      default: new $window.Firebase('https://gunslngr.firebaseio.com/'),
      users: new $window.Firebase('https://gunslngr.firebaseio.com/users'),
      clock: new $window.Firebase('https://gunslngr.firebaseio.com/.info/serverTimeOffset'),
      auth: {
        facebook: {
          scope: 'user_friends,user_birthday,friends_birthday',
          rememberMe: true
        },
        github: {
          scope: 'user:email',
          rememberMe: true
        },
        twitter: {
          rememberMe: true
        }
      }
    }
  }
})
