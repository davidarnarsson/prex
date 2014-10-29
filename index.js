var express = require('express');
var fs = require('fs');
var _ = require('underscore');
var Crawler = require('./lib/crawler');
var path = require('path');
var app = express(); 

var crawler = new Crawler();

app.use(express.static(__dirname + '/dist'));

var files = crawler.crawl('/Users/davida/Documents/Movies/');

crawler.on('file', function(e, f) {
  files.push(f);
});

app.use(function (req, res, next) {
  if (req.headers.range) {
    req.headers.range.replace(/^bytes=(\d+)-(\d+)?/, function (s1, s2, s3) {
      req.fromRange = s2 ? parseInt(s2, 10) : 0;
      req.toRange = s3 ? parseInt(s3, 10) : undefined;
    });
  } else {
    req.fromRange = 0;
  }
  next();
});

app.get('/api/play/:id', function(req, res) {
  var file = _.findWhere(files, {id : parseInt(req.params.id,10)});

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
      console.log("opened!")
      stream.pipe(res);
    }).on("error", function(err) {
      console.log("Error!" ,err);
      res.end(err);
    }).on('end', function() {
      console.log("Closed!");
    });
});

app.get('/api/files', function (req,res) {
  res.send(files);
});


app.listen(3333);