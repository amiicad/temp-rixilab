const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authRole = require('../middleware/authRole');

router.post("/create-user", authRole("admin"), async (req, res) => {
try{
  const { name, email, password, role, domain,college,university,phone,course,year_sem,branch,duration,intern_id,batch_no} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role, domain,college,university,phone,course,year_sem,branch,duration,intern_id,batch_no });
  await user.save();
  res.redirect("/admin");
}catch(err){  
  console.error(err);
  // req.flash('error_msg', 'Error creating user');
  res.redirect("/admin");
}
});
module.exports = router;