const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/register-superAdmin", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const superadmin = new User({ name, email, password: hashedPassword, role: "superAdmin" });
  await superadmin.save();
  console.log(superadmin);
  req.session.user = superadmin._id;
  req.session.role = "superAdmin";
  res.redirect("/superAdmin");
});
module.exports = router;