var fs = require('fs')
, mime = require('mime')
, watchr = require('watchr')
, path = require('path')
, util = require('util')
, EventEmitter = require('events').EventEmitter;

var root = '/Users/davida/Documents/Movies/';
var id = 0;

function getId() {
  return id++;
}

function Crawler () { }

util.inherits(Crawler, EventEmitter);
var regex = new RegExp("mp4");
function initialPopulate (directory) {
  if (directory === '.' || directory === '..') return;

  var files = [];

  var paths = fs.readdirSync(directory);
  
  for (var i = 0; i < paths.length; ++i) {
    var fullPath = path.join(directory, paths[i]);
    var stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      initialPopulate(fullPath).map(function (i) { files.push(i); });
    }

    if (/mp4/gi.test(fullPath) && stats.isFile()) {   
      files.push({
        mime: mime.lookup(fullPath),
        name: fullPath,
        simpleName: paths[i],
        size: stats.size,
        id: getId()
      });
    }
  }

  return files;
}

Crawler.prototype.crawl = function(directory) {
  var me = this;

  watchr.watch({
    paths: [directory],
    listeners: {
      change: function (change, filename) {
        var stats = fs.statSync(filename);

        this.emit('file', change, {
          name: filename,
          size: stats.size
        });
      }
    }
  });
  
  return initialPopulate(directory);
}

module.exports = Crawler;

