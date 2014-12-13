
angular.module('experiment').directive('filepicker', function($window, firebase, analytics, zencoder) {
  return {
    restrict: 'A',
    link: function(scope) {
      scope.filepicker = $window.filepicker
      return scope.filepicker.setKey('AiCDu1zCuQQysPoX9Mb9bz')
    },
    controller: function($scope) {
      var error, options, saveUploads, startJobs, success
      options = {
        picker: {
          services: ['COMPUTER', 'DROPBOX', 'BOX', 'GOOGLE_DRIVE'],
          container: 'window',
          multiple: true,
          mimetype: 'video/*'
        },
        store: {
          path: "uploads/" + firebase.guid + "/"
        }
      }
      success = function(inkBlob) {
        saveUploads(inkBlob)
        startJobs(inkBlob)
        return analytics.track('Upload: Success', inkBlob)
      }
      error = function(FPError) {
        return analytics.track('Upload: Error', FPError.toString())
      }
      saveUploads = function(inkBlob) {
        return _(inkBlob).each(function(file) {
          var filename
          filename = _.getFilename(file.key)
          file.displayName = filename
          firebase.userUploads[filename] = file
          return firebase.userUploads.$save(filename)
        })
      }
      startJobs = function(inkBlob) {
        var keys
        keys = _(inkBlob).pluck('key')
        return _(keys).each(function(filepath) {
          var filename
          filename = _.getFilename(filepath)
          console.log('filename', filename)
          return zencoder.createJob(filepath).then(function(response) {
            firebase.userUploads.$child(filename).$update({
              job: response.data.id
            })
            return firebase.userEncodes.$child(filename).$update({
              jobId: response.data.id,
              files: response.data.outputs
            })
          })
        })
      }
      return $scope.pick = function() {
        return $scope.filepicker.pickAndStore(options.picker, options.store, success, error)
      }
    }
  }
})
