
angular.module('experiment').directive('contenteditable', function() {
  return {
    restrict: 'A',
    require: "ngModel",
    scope: {
      onBlur: '&'
    },
    link: function(scope, element, attrs, ngModel) {
      element.bind('keypress', (function(_this) {
        return function(event) {
          if (event.keyCode !== 13) {
            return
          }
          event.preventDefault()
          return $(element).trigger('blur')
        }
      })(this))
      element.bind("blur", function() {
        return scope.$apply(function() {
          ngModel.$setViewValue(element.html())
          element.addClass('edited')
          return scope.onBlur()
        })
      })
      ngModel.$render = (function(_this) {
        return function() {
          return element.html(ngModel.$viewValue)
        }
      })(this)
      return ngModel.$render()
    }
  }
})
