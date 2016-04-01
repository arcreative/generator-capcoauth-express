var request = require('request');

var oauth2 = require('simple-oauth2')({
  clientID: process.env.CAPCOAUTH_CLIENT_ID,
  clientSecret: process.env.CAPCOAUTH_CLIENT_SECRET,
  site: process.env.CAPCOAUTH_URL,
  tokenPath: '/oauth/token',
  authorizationPath: '/oauth/authorize'
});

// Initial authorization redirect page
var authorizationUri = oauth2.authCode.authorizeURL({
  redirect_uri: process.env.APP_URL + '/callback'
});

module.exports = function(app) {

  // Handle authorization redirect
  app.get('/login', function(req, res) {

    // If user already logged in, abort to index
    if (req.session.token && req.session.user) {
      app.log.error("TODO: Need to implement flash errors"); // TODO: need to implement flash errors
      // TODO: Add flash alert for already logged in
      return res.redirect('/');
    }

    // Redirect to authorization
    res.redirect(authorizationUri);
  });

  app.get('/logout', function(req, res) {

    // Kill the session
    req.session.destroy(function(error) {
      if (error) {
        app.log.error('Error destroying user session');
      }

      // Redirect to authorization
      res.redirect('/');
    });
  });

  // Handle code/token callbacks
  app.get('/callback', function(req, res) {
      var code = req.query.code;

      // Call token endpoint
      oauth2.authCode.getToken({
        code: code,
        redirect_uri: process.env.APP_URL + '/callback'
      }, function (error, result) {

        // Process the error
        if (error) {
          app.log.info('Access Token Error:', error.message, '---', error.context.error, '---', error.context.error_description); // TODO: Need to implement flash errors
          return res.redirect('/');
        }

        // Parse the access token from the result
        var token = oauth2.accessToken.create(result);

        // Call the CapcOAuth /me endpoint to get user object and verify token
        request({
          url: process.env.CAPCOAUTH_URL + '/oauth/me',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.token.access_token
          }
        }, function(error, response, body) {
          try {
            body = JSON.parse(body);
          } catch(e) {}

          // Check error and parse
          if (error || typeof body !== 'object') {
            app.log.error("TODO: Need to implement flash errors"); // TODO: need to implement flash errors
            app.log.error("Error getting CapcOAuth /me endpoint after successful token response"); // TODO: need to implement flash errors
            return res.redirect('/');
          }

          // Set session vars
          req.session.token = token;
          req.session.user = body.user;

          // Go back to URL, else, home
          var returnTo;
          if (returnTo = req.session.returnTo) {
            delete req.session.returnTo;
          }
          res.redirect(returnTo || '/');
        });
      });
    }
  );
};
