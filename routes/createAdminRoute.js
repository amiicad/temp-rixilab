const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authRole = require('../middleware/authRole');


router.post("/create-admin", authRole("superAdmin"), async (req, res) => {
  try{const { name, email, password,domain,phone,emp_id} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword,domain,phone,emp_id, role:"admin" });
  await user.save();
  res.redirect("/superAdmin");
}catch(err){
  console.error(err);
  // req.flash('error_msg', 'Error creating admin');
  res.redirect("/superAdmin");
}
});

module.exports = router;