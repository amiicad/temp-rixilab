const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');

router.get("/superAdmin", authRole("superAdmin"), async (req, res) => {
try{
   const interns = await User.find({ role: "intern" });
   const batches = [...new Set(interns.map(i => i.batch_no))];
   const admins = await User.find({ role: "admin" });
   const superAdmin = await User.findOne({ role: "superAdmin" });
   const certifiedInternsCount = interns.filter(i => i.certificate_link && i.certificate_link.trim() !== "").length;
   req.flash('info', `Welcome  ${superAdmin.name}`);
   res.render("superAdmin", { interns, admins, superAdmin, batches,certifiedInternsCount });
}
catch(err){
    console.error(err);
    req.flash("error", "Failed to load Super Admin Dashboard");
    res.redirect("/login");
  }
});
module.exports = router;