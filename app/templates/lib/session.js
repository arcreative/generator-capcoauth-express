var session = require('express-session');

module.exports = function(app) {

  var options = {
    cookie: {
      secure: ['development', 'test'].indexOf(app.get('env')) === -1
    },
    maxAge: process.env.SESSION_MAX_AGE || 1200000, // 20 minutes
    name: '_' + process.env.APP_NAME + '_session',
    resave: true,
    saveUninitialized: true,
    secret: [
      process.env.SESSION_SECRET
    ]
  };

  app.use(session(options));
};
