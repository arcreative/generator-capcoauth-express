require('dotenv').config();

var express = require('express');

var app = express();
require('./lib/logger')(app);
require('./lib/session')(app);
require('./lib/oauth-client')(app);

// Bundled static assets
app.use(express.static('public'));

//////////////////////////////////////////////
//
// Add your custom, UNAUTHORIZED routes here
//
//////////////////////////////////////////////

// Verify token and user objects
app.use(require('./lib/verify-login'));

//////////////////////////////////////////////
//
// Add your custom, AUTHORIZED routes here
//
//////////////////////////////////////////////

// Serve private files after verifying authentication
app.use(express.static('private'));

// Start the server on PORT [and SECURE_PORT in production]
require('./lib/start-servers')(app);
