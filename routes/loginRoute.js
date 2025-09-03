const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Invalid email or password");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Invalid email or password");

  req.session.user = user._id;
  req.session.role = user.role;
  if(user.role === "admin"){
     return res.redirect("/admin")
  } else if(user.role === "superAdmin"){
      return res.redirect("/superAdmin")
  }else{
      return res.redirect("/intern")
  }
});

module.exports = router;
