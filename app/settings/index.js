var angular = require('angular');

require('angular-bootstrap');

var settings = angular.module('prex.settings', ['ui.bootstrap']);

settings.directive('menu', function () {
  return {
    restrict: 'EA',
    templateUrl: 'settings/menu.html',
    link: function (scope, element, attrs) {
      scope.isVisible = false;
      function onMouseMove(evt) {
        if (evt.y < 100 && !scope.isVisible) {
          scope.isVisible = true;
          scope.$apply();
        } else if (evt.y >= 100 && scope.isVisible) {
          scope.isVisible = false;
          scope.$apply();
        }
      }

      window.addEventListener('mousemove', onMouseMove, false);

      scope.$on('$destroy', function (){
        document.removeEventListener('mousemove', onMouseMove);
      });
    }
  };
})
.directive('addRootFolderButton', function ($modal) {
  return {
    restrict: 'EA',
    template: '<button class="btn btn-default" ng-click="open()">Add root folder</button>',
    require: '^menu',
    link: function (scope, element, attrs) {  
      var instance = $modal.open({
        templateUrl: 'settings/root-folder-modal.html',
        controller: function 
      })
    }
  }
})
.factory('Fo');