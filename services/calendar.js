var gcal = require('google-calendar');
//https://www.npmjs.com/package/google-calendar

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var refresh = require('passport-oauth2-refresh');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("services/calendar");

var refreshToken = global.env.GOOGLE_REFRESH_TOKEN;

var scope =['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid', 'email', 'https://www.googleapis.com/auth/calendar'
         //'https://www.googleapis.com/auth/plus.login'
       ];

var strategy = new GoogleStrategy({
    clientID: global.env.GOOGLE_CLIENT,
    clientSecret: global.env.GOOGLE_SECRET,
    callbackURL:  global.env.GOOGLE_CALLBACK,
    scope: scope,
  },
  function(accessToken, refreshToken, profile, done) {

    log.info("Access token ", accessToken);
    log.info("Refresh token ", refreshToken);
    refreshToken =refreshToken;

    return done(null, profile);
  }
);

passport.use(strategy);
refresh.use(strategy);

var authenticationProperties = { scope: scope,
                                 accessType: 'offline', approvalPrompt: 'force',
                                 session: false, failureRedirect: '/' };

var getCalendar = function(callback) {
   if (refreshToken) {

     refresh.requestNewAccessToken('google', refreshToken, function(err, accessToken, refreshToken) {
       log.info("Initializing calendar with token " + accessToken);
       var calendar = new gcal.GoogleCalendar(accessToken);

       callback(err, calendar);
     });
   } else {
     callback("Refresh token is not present, need to auth first at /auth");
   }
};

//Initialize calendar
//getCalendar(function(){});

module.exports = {

  getCalendar: getCalendar,
  recordEvent: function(message, callback){
    getCalendar(function(err, cal){
       if (err) {
         var msg = "Unable to get calendar: "+ err;
         log.error(msg);
         callback(msg);
       } else {
         cal.events.quickAdd(global.env.CALENDAR_ID, message, function(err, data) {
            callback(err, data);
         });
       }
    });
  },
  routes: function(app){
    app.get('/auth',
      passport.authenticate('google', authenticationProperties));

    app.get('/auth/callback',
      passport.authenticate('google', authenticationProperties),
      function(req, res) {
        req.session.access_token = req.user.accessToken;
        res.redirect('/calendar');
      });

      //For testing purposes
      app.get('/refresh', function(req, res){
        refresh.requestNewAccessToken('google', refreshToken, authenticationProperties, function(err, accessToken, refreshToken) {
          accessToken = accessToken;
          refreshToken= refreshToken;
          log.info("Access token ", accessToken);
          log.info("Refresh token ", refreshToken);

          res.json({error: err, accessToken: accessToken, refreshToken: refreshToken});
        });
      });

    app.get('/calendar', function(req, res){

        getCalendar(function(err, calendar){
          if (err) {
            log.error("Unable to get calendar: " + err);
            res.json({error:err});
          } else {

            calendar.calendarList.list(function(err, calendarList) {
              res.json({ error: err, calendars:calendarList});
            });
          }
        });
    });

    app.post('/calendar', function(req, res){
      log.info('Creating calendar event from /calendar POST endpoint', req.body);
      var title = req.body.title;
      getCalendar(function(err, calendar){

        if (err) {
          log.error("Unable to post to events: "+err);
          res.json({error:err});
        }else {
          googleCalendar.events.quickAdd(global.env.CALENDAR_ID, title, function(err, data) {
            res.json({err: err, data: data});
          });
        }
      });
    });

  }
};
