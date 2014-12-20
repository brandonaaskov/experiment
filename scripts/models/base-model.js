angular.module('experiment').factory('BaseModel', function (utils) {
  var BaseModel = (function () {

    function BaseModel (attrs) {
      this.attributes = attrs || {}
    }

    BaseModel.prototype.get = function (key) {
      return this.attributes[key]
    }

    BaseModel.prototype.set = function (key, val) {
      var attrs = undefined

      if (utils.isTrueObject(key)) attrs = key
      else {
        attrs = {}
        attrs[key] = val

        for (var aKey in attrs) {
          var aVal = attrs[aKey];
          this.attributes[aKey] = aVal;
        }

      }
    }

    return BaseModel
  })()

  return BaseModel
})
