const express = require('express');
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  
  const superAdminExists = await User.findOne({ role: "superAdmin" });
  if (!superAdminExists) return res.redirect("/register-superAdmin");
  res.render("index");
});

module.exports = router;