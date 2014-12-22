angular.module('experiment').factory('InstrumentModel', function (BaseModel, audio) {
  var InstrumentModel = (function () {

    InstrumentModel.prototype = Object.create(BaseModel.prototype)

    InstrumentModel.prototype.loadSound = function (url) {
      var self = this
      var promise = audio.load(url || this.get('soundUrl'))
      promise.then(function (buffer) {
        self.set('audioBuffer', buffer)
      })

      return promise
    }

    InstrumentModel.prototype.playSound = function () {
      var buffer = this.get('audioBuffer')
      if (buffer) {
        console.log('playing buffer', [this.get('name'), this.get('soundUrl')])
        audio.play(buffer)
      }
      else {
        console.log('playing url', [this.get('name'), this.get('soundUrl')])
        var url = this.get('soundUrl')
        var self = this
        this.loadSound(url).then(function () {
          audio.play(self.get('audioBuffer'))
        })
      }
    }

    function InstrumentModel (attrs) {
      var defaults = {
        soundUrl: undefined,
        audioBuffer: undefined
      }

      BaseModel.call(this, _.defaults(attrs || {}, defaults))

      var assetUrl = this.get('soundUrl')
      if (assetUrl) this.loadSound(assetUrl)
    }

    return InstrumentModel
  })(BaseModel)

  return InstrumentModel
})
