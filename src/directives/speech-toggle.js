angular.module('experiment').directive('speechToggle', function($rootScope) {
  return {
    restrict: 'EA',
    templateUrl: 'speech-toggle.html',
    link: function(scope, element) {
      scope.speaking = false
      scope.speechEnabled = true

      scope.disableSpeech = function() {
        $rootScope.$broadcast('ba-speech-disable')
      }

      scope.enableSpeech = function() {
        $rootScope.$broadcast('ba-speech-enable')
      }

      $rootScope.$on('ba-speech-disable', function() {
        scope.$apply(function () {
          scope.speechEnabled = false
        })
      })

      $rootScope.$on('ba-speech-enable', function() {
        scope.$apply(function () {
          scope.speechEnabled = true
        })
      })

      var toggle = function() {
        if (scope.speechEnabled) {
          $rootScope.$broadcast('ba-speech-disable')
        } else {
          $rootScope.$broadcast('ba-speech-enable')
        }
      }

      element.bind('click', function () {
        toggle()
      })
    }
  }
})
