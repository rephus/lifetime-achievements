//dependencies
var express = require("express");
var session = require('cookie-session');
var env = require('node-env-file');
var fs = require('fs');

var logFactory = require('./helpers/log.js');
var log = logFactory.create("app");

//Exports app make it testable from supertest
var app = exports.app = express();

try {
 env(process.cwd() + '/.env');
} catch(err){}

global.env = process.env;
//log.info("ENV settings ",global.env);

var sqlite3 = require("sqlite3").verbose();
global.db = new sqlite3.Database(process.env.DB);
var dbUtils = require('./models/db.js');

dbUtils.init(function(){});

if (process.env.DEBUG) log.debug("Running node.js server in DEBUG mode");

/**
 *  == Load models ==
 */

/**
 *  == Load utils ==
 */
var utils = require('./helpers/utils.js');

//var minify = require('./helpers/minify.js');
//minify.public();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/public'));

//app.use(bodyParser());
app.use(session({
  keys: ["coconauts"]
}));

/**
 *  == Load controllers ==
 */
require('./controllers/achievements.js').routes(app);

require('./slack/slack-robot.js');

app.listen(process.env.PORT);
log.info("Server started in http://localhost:"+process.env.PORT);
