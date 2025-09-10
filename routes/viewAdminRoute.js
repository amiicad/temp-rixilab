const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');
const Project = require("../models/Project");


router.get("/superAdmin/admin/:adminId", authRole("superAdmin"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.adminId);
  if (!admin || admin.role !== "admin") return res.redirect("/superAdmin");

  // Get all interns (or only interns under this admin if needed)
  const interns = await User.find({ role: "intern" });
  const projects = await Project.find({});
  const batches = [...new Set(interns.map(i => i.batch_no).filter(Boolean))];
  const certifiedInternsCount = interns.filter(i => i.certificate_link && i.certificate_link.trim() !== "").length;
  const superAdmin = await User.findOne({ role: "superAdmin" });
  const notices = superAdmin ? superAdmin.notice : [];
  
  req.flash('info', `Viewing Admin: ${admin.name}`);
  res.render("admin", { admin, interns,projects,batches, certifiedInternsCount,notices });
  } catch (err) {
    // console.error(err);
    res.redirect("/superAdmin");
  }
});

module.exports = router;

module.exports = router;