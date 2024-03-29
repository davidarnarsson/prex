

var angular = require('angular');

require('angular-route');
require('prex-templates');
require('./player');
require('./settings');

var module = angular.module('prex', ['ngRoute', 'prex.templates','prex.player', 'prex.settings']);

module.directive('fileList', require('./directives/fileList'));
module.directive('slideWrapper', require('./directives/slideWrapper'));
module.directive('opener', require('./directives/opener'));

module.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index.html',
    controller: 'VideoCtrl',
    controllerAs: 'ctrl',
    resolve: {
      FilesCtrlResolve: function ($http) {
        return $http.get('/api/folders');
      }
    }
  });

});