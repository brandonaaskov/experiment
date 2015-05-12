angular.module('experiment').factory('BaseCollection', function (BaseModel) {

  var BaseCollection = (function () {
    BaseCollection.prototype.model = BaseModel

    function BaseCollection(models) {
      if (!models) return

      var isSingular = ! _(models).isArray()
      if (isSingular) this.models = [models]
      else this.models = models

      this.models = (this.models).map(function (model) {
        if (model instanceof BaseModel) return model
        else return new BaseModel(model)
      })
    }

    return BaseCollection
  })()

  return BaseCollection
})
