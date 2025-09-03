const express = require('express');
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  // const adminExists = await User.findOne({ role: "admin" });
  const superAdminExists = await User.findOne({ role: "superAdmin" });
  if (!superAdminExists) return res.redirect("/register-superAdmin");
  // if (!adminExists) return res.redirect("/register-admin");
  res.render("index");
});

module.exports = router;