const express = require('express');
const router = express.Router();

const User = require("../models/User");
const authRole = require('../middleware/authRole');
// Update user route
router.post("/update-user/:id", authRole(['admin','superAdmin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    // SuperAdmin updating an admin
    if (user.role === "admin" && req.session.role === "superAdmin") {
      const { name, email, domain, emp_id, phone,designation } = req.body;

      await User.findByIdAndUpdate(req.params.id, {
        name,
        email,
        domain,
        emp_id,
        phone,
        designation
      });

      return res.redirect('/superAdmin');
    }

    // Admin updating an intern
    if (user.role === "intern" && req.session.role === "admin") {
      const { name, email, domain, college, university, year_sem, phone, branch,batch_no, certificate_id,offer_letter,certificate_link,duration} = req.body;

      await User.findByIdAndUpdate(req.params.id, {
        name,
        email,
        domain,
        college,
        university,
        year_sem,
        phone,
        branch,
        batch_no,
        certificate_id,
        offer_letter,
        certificate_link,
        duration
      });
      req.flash('success', 'Intern Updated Successfully!');
      return res.redirect('/admin#viewInterns');
    }

    // If role mismatch
    req.flash('error', err.message);
    console.log(err);
    return res.redirect('/login');

  } catch (err) {
    console.error("Update Error:", err);
    req.flash("error",err.message);
  }
});
module.exports = router;