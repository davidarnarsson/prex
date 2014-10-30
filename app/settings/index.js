var angular = require('angular');

require('angular-bootstrap');

var settings = angular.module('prex.settings', ['ui.bootstrap']);


var RootFolderModalCtrl = function ($scope, $modalInstance) {
  $scope.paths = [{}];
  $scope.ok = function () {
    $modalInstance.close($scope.paths);
  };

  $scope.remove = function (path) {
    var idx = $scope.paths.indexOf(path);
    $scope.paths.splice(idx, 1);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};

settings.directive('menu', function () {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'settings/menu.html',
    controller: function ($scope, $element, $attrs) {
      $scope.isVisible = false;
      function onMouseMove(evt) {
        if (evt.y < 100 && !$scope.isVisible) {
          $scope.isVisible = true;
          $scope.$apply();
        } else if (evt.y >= 100 && $scope.isVisible) {
          $scope.isVisible = false;
          $scope.$apply();
        }
      }

      window.addEventListener('mousemove', onMouseMove, false);

      $scope.$on('$destroy', function (){
        document.removeEventListener('mousemove', onMouseMove);
      });
    }
  };
})
.directive('addRootFolderButton', function ($modal) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<li ng-click="open()"> <a href="">Add root folder</a></li>',
    require: '^menu',
    link: function (scope, element, attrs) {  
      scope.open = function () {
        var instance = $modal.open({
          templateUrl: 'settings/root-folder-modal.html',
          controller: RootFolderModalCtrl
        });

        instance.result.then(function (paths) {

        });
      };
    }
  }
});