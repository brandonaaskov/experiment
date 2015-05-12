angular.module('experiment').factory('BeatModel', function (BaseModel) {
  var BeatModel = (function () {

    BeatModel.prototype = Object.create(BaseModel.prototype)

    function BeatModel (attrs) {
      var defaults = {
        enabled: false,
        active: false
      }

      BaseModel.call(this, _.defaults(attrs || {}, defaults))
    }

    return BeatModel
  })(BaseModel)

  return BeatModel
})
