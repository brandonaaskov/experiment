angular.module('experiment').factory('InstrumentModel', function (BaseModel, audio) {
  var InstrumentModel = (function () {

    InstrumentModel.prototype = Object.create(BaseModel.prototype)

    InstrumentModel.prototype.toggleActive = function () {
      this.attributes.active = !this.attributes.active
    }

    InstrumentModel.prototype.loadSound = function (url) {
      var self = this
      audio.load(url || this.get('soundUrl')).then(function (source) {
        self.set('sound', source)
      })
    }

    InstrumentModel.prototype.playSound = function () {
      audio.play(this.get('soundUrl'))
    }

    function InstrumentModel (attrs) {
      var defaults = {
        enabled: false,
        active: false
      }

      BaseModel.call(this, _.defaults(attrs, defaults))
    }

    return InstrumentModel
  })(BaseModel)

  return InstrumentModel
})
