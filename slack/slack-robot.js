//https://www.npmjs.com/package/slack-robot
var SlackRobot = require('slack-robot');
var robot = new SlackRobot(env.SLACK_TOKEN);

var logFactory = require('../helpers/log.js');
var log = logFactory.create("slack/slack-robot");

var achievement = require('../models/achievement.js');

// will post 'world' text as bot when receiving 'hello' message
// in channel, group, or direct message
robot.listen(">:message(.+)", function (req, res) {

    var user = req.from.name;
    var message = req.params.message;
    log.info("Got message from slack: "+ message);

    achievement.save(user,message);
    res.text("Achievement recorded").send();
});

// start listening
robot.start();
