var logFactory = require('../helpers/log.js');
var log = logFactory.create("models/notes");

var save = function(user, text) {

    var now = new Date().getTime();
    log.info("Saving achievement @"+user+"  "+text);
    db.run("INSERT INTO achievements (user, time, text) VALUES (?, ?, ?)", [user, now, text]);
};
/*
var list = function(user, topic, callback) {
  db.all("select * from notes WHERE user = ? and topic = ?",[user, topic] , callback);
};

var get = function(id, callback) {
  db.get("select * from notes WHERE id = ?",[id] ,callback);
};

var remove = function(id, callback) {
  db.get("DELETE FROM notes WHERE id = ?",[id] ,callback);
};
*/
module.exports = {
    //get: get,
    save: save,
  //  list: list,
  //  remove: remove
};
