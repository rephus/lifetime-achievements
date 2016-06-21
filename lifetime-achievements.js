//dependencies
var express = require("express");
var env = require('node-env-file');
var session = require('cookie-session');

var logFactory = require('./helpers/log.js');
var log = logFactory.create("app");

//Exports app make it testable from supertest
var app = exports.app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //Parse POST json

try {
 env(process.cwd() + '/.env');
} catch(err){}

app.use(session({
  keys: ["coconauts"]
}));

global.env = process.env;

if (process.env.DEBUG) log.debug("Running node.js server in DEBUG mode");

var calendar = require('./services/calendar.js').routes(app);

require('./services/slack.js');

app.listen(process.env.PORT);
log.info("Server started in http://localhost:"+process.env.PORT);
