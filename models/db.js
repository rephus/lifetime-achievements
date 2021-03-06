var logFactory = require('../helpers/log.js');
var log = logFactory.create("models/db");

//Creates directly the database using the latest version, there's no need to apply evolutions
var create = function(callback){
  log.info("Initializing DB schema");
  db.serialize(function() { //serialize will run execute a query at a time
    db.run("CREATE TABLE IF NOT EXISTS achievements ( id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, time Number, text TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, user NUMERIC, key TEXT, value TEXT);");

    db.run("INSERT INTO settings (key,value) VALUES (?,?)", ["version","0"], function(){ applyEvolutions(callback); });
  });
};

//Apply changes to database if it gets out of date
var applyEvolutions = function(callback){
  db.get("SELECT * FROM settings WHERE key = 'version'",[] , function (err, setting){
    if (err) log.error("applyEvolutions",err);
    switch(setting.value) {
    /*  case "0": evolution1(function(){applyEvolutions(callback);}); break;*/
      case "0": log.info("Database is up to date"); callback(); break;

      default: log.warn("Unexpected database version", setting.value);
    }
  });
};
/*
var evolution1 = function(callback){
  log.info("Database is out of date, applying evolution 1 ");
  db.serialize(function() {
    db.run("ALTER TABLE collection ADD COLUMN created NUMBER;");
    db.run("UPDATE settings SET value='1' WHERE key='version'", function(){ callback() });
  });
}*/
var db_init = function(callback){
  //Check if exists
  db.get("SELECT * FROM sqlite_master WHERE name ='settings' and type='table';",function(err, table){
    if (err) log.error("db_init",err);
    if(table === undefined) create(callback);
    else applyEvolutions(callback);
  });
};

module.exports = {
  init: db_init
};
