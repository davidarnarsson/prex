var fs = require('fs')
, cwd = __dirname
, path = require('path');

module.exports = function (app) {

  fs.readdir(cwd, function (err, files) {

    files.forEach(function (f) {
      var fullPath = path.join(cwd, f);

      var stats = fs.statSync(fullPath);

      if (stats.isFile() && !/index\.js/.test(f)) {
        require('./' + f)(app);
      }
    });
  });
}