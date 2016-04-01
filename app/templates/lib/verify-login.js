module.exports = function(req, res, next) {

  // Check for token and user
  if (!req.session.token || !req.session.user) {
    req.session.returnTo = req.url;
    return res.redirect('/login');
  }

  // User is logged in
  next();
};
