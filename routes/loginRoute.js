const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user){
    req.flash('error_msg', 'Invalid email');
     return res.redirect("/login");
  } 
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
     req.flash('error_msg', 'Invalid password');
    return res.redirect("/login");
  };

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
