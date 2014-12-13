angular.module('experiment').constant('config', {
  env: 'development',
  firebase: {
    default: new Firebase('https://drum-machine.firebaseio.com/'),
    users: new Firebase('https://drum-machine.firebaseio.com/users'),
    clock: new Firebase('https://drum-machine.firebaseio.com/.info/serverTimeOffset'),
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
})
