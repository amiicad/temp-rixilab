function authRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      // Not logged in
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login"); // or any login route
    }

    const sessionRole = req.session.role ? req.session.role.toLowerCase() : null;

    // normalize roles to lowercase
    const allowedRoles = Array.isArray(roles)
      ? roles.map(r => r.toLowerCase())
      : [roles.toLowerCase()];

    if (!sessionRole || !allowedRoles.includes(sessionRole)) {
      // Wrong role
      req.flash("error", "Access denied. You do not have permission to view this page.");
      return res.redirect("/"); // send them back safely
    }

    next();
  };
}

module.exports = authRole;
