angular.module('experiment').factory('BeatCollection', function (BaseCollection, BaseModel, BeatModel, $rootScope) {

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
      }
      else if (!_.isEmpty(this.models)) {
        _.first(this.models).set('active', true)
      }
    }

    function BeatCollection(models) {
      this.models = []

      this.models = (models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new BeatModel(model)
      })

      BaseCollection.call(this, this.models)

      var self = this
      $rootScope.$on('activateNextBeat', function () {
        self.activateNext()
      })
    }

    return BeatCollection
  })()

  return BeatCollection
})
