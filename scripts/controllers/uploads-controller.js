
angular.module('experiment').controller('uploadsController', function($scope, firebase) {
  $scope.userUploads = []
  $scope.gridOptions = {
    data: 'userUploads',
    columnDefs: [
      {
        field: 'displayName',
        displayName: 'Name'
      }, {
        field: 'filename',
        displayName: 'Filename'
      }, {
        field: 'job',
        displayName: 'Zencoder Job'
      }, {
        field: 'size',
        displayName: 'Size'
      }
    ]
  }
  return $scope.userUploads = firebase.userUploads
})
