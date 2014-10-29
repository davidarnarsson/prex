var fs = require('fs')
, path = require('path')
, MediaTable = require('../db/media');

var media = new MediaTable();

module.exports = function (app) {

  app.get('/api/play/:id', function(req, res) {  
    media.getById(req.params.id).then(function (file) {
      var to = req.toRange ? req.toRange : file.size - 1;
      var length = to - req.fromRange + 1;
      
      var headers = {
          'Content-Range': 'bytes ' + req.fromRange + '-' + to + '/' + (file.size),
          'Content-Type': file.mime,
          'Accept-Ranges': "bytes",
          'Content-Length': length
      };

      res.writeHead(206, headers);
      var stream = fs.createReadStream(file.name, { start: req.fromRange, end: to })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
  });
};