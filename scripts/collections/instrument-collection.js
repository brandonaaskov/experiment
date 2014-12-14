angular.module('experiment').factory('InstrumentCollection', function (BaseCollection, BaseModel, InstrumentModel) {

  var InstrumentCollection = (function () {
    InstrumentCollection.prototype = Object.create(BaseCollection.prototype)
    InstrumentCollection.prototype.model = InstrumentModel
    
    InstrumentCollection.prototype.activateNext = function () {
      var activeModel = _(this.models).find(function (model) {
        return model.get('active')
      })

      if (activeModel) {
        var currentIndex = this.models.indexOf(activeModel)
        var nextIndex = (currentIndex + 1 < this.models.length) ? currentIndex + 1 : 0
        this.models[currentIndex].set('active', false)
        this.models[nextIndex].set('active', true)
      }
      else if (!_.isEmpty(this.models)) {
        _.first(this.models).set('active', true)
      }
    }

    function InstrumentCollection(models) {
      if (!models) return

      var isSingular = ! _(models).isArray()
      if (isSingular) this.models = [models]
      else this.models = models

      this.models = (this.models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new InstrumentModel(model)
      })

      BaseCollection.call(this, this.models)
    }

    return InstrumentCollection
  })()

  return InstrumentCollection
})
