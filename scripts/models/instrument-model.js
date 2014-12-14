angular.module('experiment').factory('InstrumentModel', function (BaseModel) {
  var InstrumentModel = (function () {

    InstrumentModel.prototype = Object.create(BaseModel.prototype)

    InstrumentModel.prototype.toggleActive = function () {
      this.attributes.active = !this.attributes.active
    }

    function InstrumentModel (attrs) {
      var defaults = {
        type: 'drum',
        name: 'kick',
        active: false
      }

      BaseModel.call(this, _.defaults(attrs, defaults))
    }

    return InstrumentModel
  })(BaseModel)

  return InstrumentModel
})
