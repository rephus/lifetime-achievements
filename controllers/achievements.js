var utils = require('../helpers/utils.js');

var achivement = require('../models/achievement.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("controllers/achievements");

module.exports = {

  routes: function(app){

      app.get('/achievements/save',function(req, res){
          var user = req.query.u;
          var text = req.query.t;

          achivement.save(user, text);
          res.json({});
      });
/*
      app.get('/achievements/list',function(req, res){
          var user = req.query.u;
          var topic = req.query.t;

          achivement.list(user, topic, function(err, listNotes){
            res.json({error: err, response: listNotes});
          });
      });

      app.get('/achievements/remove',function(req, res){
          var id = req.query.i;

          achivement.remove(id, function(err, r){
            res.json({error: err});
          });
      });*/

  }
};
