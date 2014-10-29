var express = require('express');
var app = express(); 


app.use(express.static(__dirname + '/dist'));

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

require('./lib/routes')(app);

app.listen(3333);