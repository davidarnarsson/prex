
module.exports = function () {
  return {
    restrict: 'EA',
    templateUrl: 'file-list.html',
    scope: {
      files: '=',
      onChoose: '='
    }
  }
};