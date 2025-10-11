const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Ambassador = require("../models/Ambassador");

// 🔑 Login Route (for all roles)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ First, check in User collection (Admin, SuperAdmin, Intern)
    let user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash("error", "Invalid email address or password");
        return res.redirect("/login");
      }

      // ✅ Save session
      req.session.user = user._id;
      req.session.role = user.role;

      req.flash("success", `Welcome, ${user.name.trim()}!`);

      // ✅ Role-based redirect
      if (user.role === "admin") {
        return res.redirect("/admin");
      } else if (user.role === "superAdmin") {
        return res.redirect("/superAdmin");
      } else {
        return res.redirect("/intern");
      }
    }

    // ✅ If not found in User, check in Ambassador collection
    const ambassador = await Ambassador.findOne({ email });
    if (ambassador) {
      const match = await bcrypt.compare(password, ambassador.password);
      if (!match) {
        req.flash("error", "Invalid email address or password");
        return res.redirect("/login");
      }

      // ✅ Save ambassador session
      req.session.user = ambassador._id;
      req.session.role = "ambassador";
      req.session.isFirstLogin = ambassador.isFirstLogin; 

      req.flash("success", `Welcome, Ambassador ${ambassador.name.trim()}!`);
      return res.redirect("/ambassador");
    }

    // ❌ If neither found
    req.flash("error", "Invalid email address or password");
    return res.redirect("/login");

  } catch (err) {
    console.error("🔥 Login Error:", err);
    req.flash("error", "Something went wrong, please try again.");
    res.redirect("/login");
  }
});

module.exports = router;
