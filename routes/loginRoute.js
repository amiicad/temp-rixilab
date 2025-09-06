const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email address or password');
      return res.redirect("/login");
    }

    // ✅ Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid email address or password');
      return res.redirect("/login");
    }

    // ✅ Save session
    req.session.user = user._id;
    req.session.role = user.role;

    req.flash("success", `Welcome back, ${user.name}!`);

    // ✅ Role-based redirect
    if (user.role === "admin") {
      return res.redirect("/admin");
    } else if (user.role === "superAdmin") {
      return res.redirect("/superAdmin");
    } else {
      return res.redirect("/intern");
    }
  } catch (err) {
    console.error("🔥 Login Error:", err);
    req.flash("error", "Something went wrong, please try again.");
    res.redirect("/login");
  }
});

module.exports = router;
