

module.exports = function () {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'slide-wrapper.html',
   
    controller: function ($scope) {
      this.toggle = function (o) {
        $scope.isOpen = o;
      };
    }
  };
}