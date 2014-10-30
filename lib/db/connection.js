'use strict';

var sqlite3 = require('sqlite3').verbose();
var q = require('q');

var db; 
function Connection () {
  var db = this.db = new sqlite3.Database('data/prex.sqlite3', createTables);  
  
  function createTables(err) {
    db.run("CREATE TABLE IF NOT EXISTS folder (id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, path TEXT, folder_name TEXT, last_crawl TEXT, parent_id INTEGER REFERENCES folder(id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS media (id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, path TEXT, simple_name TEXT, size INTEGER, mime_type TEXT, folder_id INTEGER REFERENCES folder(id) ON DELETE CASCADE)");
  }
}
 
module.exports = new Connection();