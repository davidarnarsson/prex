

var resolve = require('./resolve');
var q = require('q');



function FoldersTable() {
  this.db = require('./connection').db;
}

FoldersTable.prototype.getRootFolders = function () {
  var deferred = q.defer();
  
  this.db.all("SELECT * FROM folder WHERE parent_id IS NULL", resolve(deferred));

  return deferred.promise;
};

FoldersTable.prototype.create = function(folder) {
  var deferred = q.defer();
  var stmt = this.db.run("INSERT INTO folder (path, folder_name, parent_id) values (:path,folder_name,:parent_id)", folder, resolve(deferred, function() { return this.lastID; }));
  return deferred.promise;
};

FoldersTable.prototype.update = function(folder) {
  var deferred = q.defer();
  var stmt = this.db.run("UPDATE folder set path = :path, folder_name = :folder_name, parent_id = :parent_id, last_crawl = :last_crawl) WHERE id = :id", folder, resolve(deferred, function() { return this.changes; }));
  return deferred.promise;
};

FoldersTable.prototype.getById = function(id) {
  var deferred = q.defer();
  this.db.run(["SELECT * FROM folder",
               "WHERE id = ?"].join(' '), id, resolve(deferred));
  return deferred.promise;
};

FoldersTable.prototype.delete = function(id) {
  var deferred = q.defer();
  this.db.run("DELETE FROM folder WHERE id = ?", id, resolve(deferred, function () { return this.changes; }));
  return deferred;
};

FoldersTable.prototype.getFolderByParentId = function(parent_id) {
  var deferred = q.defer();
  this.db.run("SELECT * FROM folder WHERE parent_id = ?", parent_id, resolve(deferred));
  return deferred;
};


module.exports = FoldersTable;
module.exports.folders = new FoldersTable();