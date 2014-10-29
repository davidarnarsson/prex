
var resolve = require('./resolve')
, Q = require('q');

function MediaTable() {
  this.db = require('./connection').db;
}


MediaTable.prototype.getMediaInFolder = function(folderId) {
  var deferred = Q.defer();
  this.db.run("SELECT * FROM media WHERE folder_id = ?", folderId, resolve(deferred));
  return deferred.promise;
};

MediaTable.prototype.getById = function(id) {
  var deferred = Q.defer(); 
  this.db.run("SELECT * FROM media WHERE id = ?", id, resolve(deferred));
  return deferred.promise;
};

MediaTable.prototype.getByFolderId = function(id) {
  var deferred = Q.defer(); 
  this.db.run("SELECT * FROM media WHERE folder_id = ?", id, resolve(deferred));
  return deferred.promise;
};

MediaTable.prototype.delete = function (id) {
  var deferred = Q.defer();
  this.db.run("DELETE FROM media WHERE id = ?", id, resolve(deferred, function () { return this.changes; }));
  return deferred.promise;
}

MediaTable.prototype.create = function(media) {
  var deferred = Q.defer();
  this.db.run("INSERT INTO media (path, simple_name, size, mimeType, folder_id) values (:name, :simple_name, :size, :mime_type, :folder_id)", media, resolve(deferred, function() { return this.lastID; }));
  return deferred.promise;
};

MediaTable.prototype.update = function(media) {
  var deferred = Q.defer();
  this.db.run("UPDATE media SET path = :path, simple_name = :simple_name, size = :size, mime_type = :mime_type, folder_id = :folder_id) WHERE id = :id", media, resolve(deferred, function() { return this.changes; }));
  return deferred.promise;
};

MediaTable.prototype.sync = function (media) {
  var deferred = Q.defer();

  this.db.run("SELECT id FROM media WHERE path = ?", media.path, function (err, rows) {
    if (!rows.length) {
      Q.when(this.create(media)).then(function (id) {
        deferred.resolve({status: "created", id: id});
      });
    } else {
      Q.when(this.update(media)).then(function (changes) {
        deferred.resolve({status: "updated", id: media.id, changes: changes});
      });
    }
  });

  return deferred.promise;
}

module.exports = MediaTable;
module.exports.media = new MediaTable();