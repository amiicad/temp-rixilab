const User = require("../models/User");
const Ambassador = require("../models/Ambassador");

function authRole(roles) {
  return async (req, res, next) => {
    try {
      if (!req.session.user || !req.session.role) {
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login");
      }

      // ✅ Check from both models based on session role
      let user;
      if (req.session.role === "ambassador") {
        user = await Ambassador.findById(req.session.user);
      } else {
        user = await User.findById(req.session.user);
      }

      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/login");
      }

      // ✅ Handle roles as array or single string
      const allowedRoles = Array.isArray(roles)
        ? roles.map((r) => r.toLowerCase())
        : [roles.toLowerCase()];

      const sessionRole = req.session.role.toLowerCase();

      if (!allowedRoles.includes(sessionRole)) {
        req.flash("error", "Access denied.");
        return res.redirect("/");
      }

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      req.flash("error", "Something went wrong. Please log in again.");
      res.redirect("/login");
    }
  };
}

module.exports = authRole;
