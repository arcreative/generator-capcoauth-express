# generator-capcoauth-express

Yeoman generator for generating a CapcOAuth-authenticated Node.js/Express application.

## Installation

```sh
npm install -g yo
npm install -g generator-capcoauth-express
mkdir my-new-app && cd my-new-app
yo capcoauth-express
```

Answer all the prompts, and Yeoman will create your project for you.  If you made a mistake, you can update your answers
in `.env` in the project root.

## Running the server

```sh
node index
```

## Pretty output / logging

This project uses Bunyan for logging, so stdout format is in JSON.  If you wish to have pretty logs, simply install
Bunyan with `npm install -g bunyan`, and start the application with `node index | bunyan`.  Logs are also saved to 
`log/app.log` and can be analyzed later using `bunyan log/app.log`

## Adding static content

By default, the server will serve anything in the `public` directory without requiring authentication, and everything in
the `private` directory after authentication is verified.  Simply drop your static files in each respective directory,
and express will serve them without any additional work.  If you wish to change this behavior, comment out the
`express.static('public')` or `express.static('private')` middleware in `index.js`.  

## Adding routes/middleware

At its core, this is just an Express project.  If you need more routes/dynamic content, simply add them where annotated
in `index.js`.  Please note that any route matched before `app.use(require('./lib/verify-login'));` middleware is called
will be served without authentication.  Please make sure to test your routes before moving to production.

## Questions/bugs/contribution

Use issue tracker, or feel free to submit a PR for review/discussion.