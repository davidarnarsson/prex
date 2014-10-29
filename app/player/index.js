var angular = require('angular');

var player = angular.module('prex.player', []);

player
.factory('VideoPlayerService', function () {
  var service = {}, player;
  service.set = function (p) {
    player = p;
  };
  service.get = function () {
    return player;
  };

  return service;
})
.controller('VideoCtrl',function (FilesCtrlResolve, $scope) {
  this.files = FilesCtrlResolve.data;

  this.onChoose = function (f) {
    console.log("FILE!" ,f);  
    $scope.file = f;
  }
})
.directive('videoPlayer', function ($sce, VideoPlayerService) {
  return {
    restrict: 'EA',
    templateUrl: 'player/video-player.html',
    scope: {
      file: '='
    },
    link: function (scope, element, attrs) {
      var api = element.find('video')[0];
      VideoPlayerService.set(api);
      scope.$watch('file', function (f) {
        if (!f) return;
        debugger;
        api.src = '/api/play/' + f.id;
      });
    }
  };
})
.directive('videoControls', function(VideoPlayerService) {
  return {
    restrict: 'EA',
    templateUrl: 'player/video-controls.html',
    controller: function ($scope) {

      this.getPlayer = function () {
        return VideoPlayerService.get();
      };
    }
  };
})
.directive('playButton', function () {
  return {
    restrict: 'EA',
    templateUrl: 'player/play-button.html',
    require: '^videoControls',
    link: function (scope, element, attrs, videoCtrl) {
      scope.paused = videoCtrl.getPlayer().paused;

      scope.play = function () {
        videoCtrl.getPlayer().play();
        scope.paused = false;
      };
      scope.pause = function () {
        videoCtrl.getPlayer().pause();
        scope.paused = true;
      };
    }
  };
});