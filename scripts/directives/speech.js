angular.module('experiment').directive('speech', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (!$window.speechSynthesis) return

      scope.enabled = true
      element.addClass('ba-speech')
      var utterance = new $window.SpeechSynthesisUtterance()
      var toggleSpeaking = function(flag) {
        if (flag) {
          element.addClass('speaking')
        } else {
          element.removeClass('speaking')
        }

        scope.speaking = flag
      }

      utterance.onstart = function() {
        toggleSpeaking(true)
      }

      utterance.onend = function() {
        toggleSpeaking(false)
      }

      utterance.onpause = function() {
        toggleSpeaking(false)
      }

      utterance.onresume = function() {
        toggleSpeaking(true)
      }

      $window.speechSynthesis.onvoiceschanged = function () {
        utterance.voice = getVoice(attrs.language)

        if (attrs.debug) {
          console.log(utterance.voice)
        }

        utterance.voiceURI = utterance.voice.voiceURI
        utterance.lang = utterance.voice.lang
        utterance.volume = 1.0
        utterance.rate = 1.2
        utterance.pitch = 1
      }

      var getVoice = function(language) {
        var voices = $window.speechSynthesis.getVoices()

        var systemDefault = _(voices).findWhere({
          "default": true
        })

        var override = _(voices).findWhere({
          lang: language
        })

        if (override) {
          return override
        } else {
          return systemDefault
        }
      }

      var speak = function(words) {
        if (!(words && scope.enabled)) return

        utterance.text = words
        $window.speechSynthesis.speak(utterance)
      }

      angular.element(element).bind('click', function() {
        $window.speechSynthesis.cancel()
        speak(attrs.speech)
      })

      scope.$on('ba-speech-disable', function() {
        $window.speechSynthesis.cancel()
        scope.enabled = false
      })

      scope.$on('ba-speech-enable', function() {
        scope.enabled = true
      })
    }
  }
})
