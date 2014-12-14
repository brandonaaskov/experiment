angular.module('experiment').factory('BaseModel', function (utils) {
  var BaseModel = (function () {

    function BaseModel (attrs) {
      this.attributes = attrs || {}
    }

    BaseModel.prototype.get = function (key) {
      return utils.findValue(this.attributes, key)
    }

    return BaseModel
  })()

  return BaseModel
})
