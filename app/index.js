var generators = require('yeoman-generator'),
    crypto = require('crypto');

var promptHandler = function(done, prop, answers) {
  this.appEnv[prop] = answers[prop];
  done();
};

module.exports = generators.Base.extend({
  initializing: function() {
    this.appEnv = {};
  },
  prompting: {
    appName: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'APP_NAME',
        message: 'Your app name (no spaces, just dashes/underscores)',
        'default': 'my-app'
      }, promptHandler.bind(this, done, 'APP_NAME'));
    },
    appUrl: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'APP_URL',
        message: 'Your app\'s URL',
        'default': 'http://localhost:3000'
      }, promptHandler.bind(this, done, 'APP_URL'));
    },
    port: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'PORT',
        message: 'Port to use for HTTP (non-SSL) traffic',
        'default': '3000'
      }, promptHandler.bind(this, done, 'PORT'));
    },
    clientId: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'CAPCOAUTH_CLIENT_ID',
        message: 'OAuth client ID (obtained from CapcOAuth)',
        'default': 'YOUR CLIENT ID'
      }, promptHandler.bind(this, done, 'CAPCOAUTH_CLIENT_ID'));
    },
    clientSecret: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'CAPCOAUTH_CLIENT_SECRET',
        message: 'OAuth client secret (obtained from CapcOAuth)',
        'default': 'YOUR CLIENT ID'
      }, promptHandler.bind(this, done, 'CAPCOAUTH_CLIENT_SECRET'));
    }
  },
  'default': function() {
    var done = this.async();

    require('crypto').randomBytes(48, function(ex, buf) {
      this.appEnv.SESSION_SECRET = buf.toString('hex');
      done();
    }.bind(this));
  },
  writing: function() {
    // Copy .env and add all variables
    this.fs.copyTpl(
      this.templatePath('_env'),
      this.destinationPath('.env'),
      { appEnv: this.appEnv }
    );

    // Copy package.json and add app name
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { appName: this.appEnv.APP_NAME }
    );

    // Copy remaining template files
    this.copy('index.js', 'index.js');
    this.copy('_gitignore', '.gitignore');
    this.directory('lib', 'lib');
    this.directory('log', 'log');
    this.directory('private', 'private');
    this.directory('public', 'public');
  },
  install: function() {
    this.log('Running `npm install`');
    this.npmInstall();
  },
  end: function() {
    this.log('Done! Simply type `node index.js`');
  }
});
