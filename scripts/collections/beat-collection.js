angular.module('experiment').factory('BeatCollection', function (BaseCollection, BaseModel, BeatModel) {

  var BeatCollection = (function () {
    BeatCollection.prototype = Object.create(BaseCollection.prototype)
    BeatCollection.prototype.model = BeatModel
    
    BeatCollection.prototype.activateNext = function () {
      var activeModel = _(this.models).find(function (model) {
        return model.get('active')
      })

      if (activeModel) {
        var currentIndex = this.models.indexOf(activeModel)
        var nextIndex = (currentIndex + 1 < this.models.length) ? currentIndex + 1 : 0
        this.models[currentIndex].set('active', false)
        this.models[nextIndex].set('active', true)
        if (this.models[nextIndex].get('enabled')) this.models[nextIndex].playSound()
      }
      else if (!_.isEmpty(this.models)) {
        _.first(this.models).set('active', true)
      }
    }

    function BeatCollection(models) {
      if (!models) return

      var isSingular = ! _(models).isArray()
      if (isSingular) this.models = [models]
      else this.models = models

      this.models = (this.models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new BeatModel(model)
      })

      BaseCollection.call(this, this.models)
    }

    return BeatCollection
  })()

  return BeatCollection
})
