
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        if (req.path !== '/auth/login') {
            req.session.originalUrl = req.originalUrl;
        }
        return res.redirect("/auth/login");
    }
    next();
}

  
  function isAdmin(req, res, next) {
    if (req.session.isAuthenticated && req.session.user.role === "admin") {
      return next();
    }
    return res.status(403).send('Access has been denied');
  }
  
function addAuthVariablesToEJS(req, res, next) {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAdmin = req.session.isAuthenticated && req.session.user.role === 'admin';
    next();
}


  module.exports = { isAuthenticated, isAdmin, addAuthVariablesToEJS };
  