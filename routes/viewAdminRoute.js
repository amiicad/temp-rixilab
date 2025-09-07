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
  const projects = await Project.find({})
  
  req.flash('info', `Viewing Admin: ${admin.name}`);
  res.render("admin", { admin, interns,projects });
  } catch (err) {
    console.error(err);
    res.redirect("/superAdmin");
  }
});

module.exports = router;

module.exports = router;