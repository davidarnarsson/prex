
var folders = require('../db/folders').folders;
var media = require('../db/media').media;

module.exports = function (app) {

  function respond(p, req, res) {
    p.then(function(r) {
      
      if (!r) {
        return res.status(404).end();
      } 

      res.send(r);
    }, function(err) {
      res.status(500).send(err).end();
    });
  }


  app.get('/api/folders', function (req, res) {
    respond(folders.getRootFolders(), req, res);
  });

  app.get('/api/folders/:id', function (req, res) {
    console.log(req.params.id);
    respond(folders.getById(req.params.id).then(function(r) {
      console.log(r);
      return media.getByFolderId(r.id).then(function (m) {
        return {
          folder: r,
          media: m
        };
      });
    }), req, res);
  });
};