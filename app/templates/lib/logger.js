var bunyan = require('bunyan');
var logger = bunyan.createLogger({
  name: process.env.APP_NAME,
  streams: [
    {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      stream: process.stdout
    },
    {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      path: './log/app.log'
    }
  ]
});

module.exports = function(app) {
  app.log = logger;

  // Add request logger
  app.use(function(req, res, next) {
    app.log.info(req.method, res.statusCode, req.url);
    next();
  });
};
