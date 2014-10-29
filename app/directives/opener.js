
module.exports = function () {
  return {
    templateUrl: 'opener.html',
    restrict: 'EA',
    require: '^slideWrapper',
    link: function (scope, element, attrs, slideWrapperCtrl) {
      
      scope.$watch('open', slideWrapperCtrl.toggle.bind(slideWrapperCtrl));
    }
  };
};