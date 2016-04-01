var fs = require('fs'),
    https = require('https');

var port = process.env.PORT || 80;

module.exports = function(app) {

  // If production, use SECURE_PORT to serve application, else, serve on PORT
  if (app.get('env') === 'production') {
    var securePort = process.env.SECURE_PORT || 443;

    // Set up the HTTP server to redirect to HTTPS
    var http = express();
    http.get('*', function(req, res) {
      res.redirect(process.env.APP_URL + req.url);
    });
    http.listen(port, function(error) {
      if (error) {
        app.log.fatal('Error starting HTTP redirect server: ' + error.message);
      } else {
        app.log.info('Started HTTP redirect server on port ' + port);
      }
    });

    // Set up the HTTPS server to serve application
    https
      .createServer({
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH)
      }, app)
      .listen(securePort, function(error) {
        if (error) {
          app.log.fatal('Error starting HTTPS server: ' + error.message);
        } else {
          app.log.info('Started HTTPS server on port ' + port);
        }
      })
  } else {
    app.log.info('Started HTTP server on port ' + port);
    app.listen(port);
  }
};
