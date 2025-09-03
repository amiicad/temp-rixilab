
function authRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(403).send("Access Denied");
      
    }

    const sessionRole = req.session.role ? req.session.role.toLowerCase() : null;

    // normalize roles to lowercase
    const allowedRoles = Array.isArray(roles) ? roles.map(r => r.toLowerCase()) : [roles.toLowerCase()];

    if (!sessionRole || !allowedRoles.includes(sessionRole)) {
      return res.status(403).send("Access Denied");
    }

    next();
  };
}

module.exports = authRole;

