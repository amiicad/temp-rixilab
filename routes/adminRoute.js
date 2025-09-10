const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const authRole = require('../middleware/authRole');

// Admin Dashboard
router.get("/admin", authRole("admin"), async (req, res) => {
  try {
    const adminId = req.session.user;

    const admin = await User.findById(adminId);
    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/login");
    };

    // Interns in this admin’s domain with projects populated
    const interns = await User.find({ role: "intern", domain: admin.domain })
      .populate("projectAssigned.projectId");

    // Unique batch numbers (skip empty ones)
    const batches = [...new Set(interns.map(i => i.batch_no).filter(Boolean))];

    // Projects created in this domain
    const projects = await Project.find({ domain: admin.domain }); 
    const certifiedInternsCount = interns.filter(i => i.certificate_link && i.certificate_link.trim() !== "").length;

    // ✅ Fetch notices from superAdmin
    const superAdmin = await User.findOne({ role: "superAdmin" });
    const notices = superAdmin ? superAdmin.notice : [];

    req.flash("info", `Welcome ${admin.name}`); 
    res.render("admin", { admin, interns, projects, batches, certifiedInternsCount, notices });
  } catch (err) {
    console.error(err);
    req.flash("error", "Server Error");
    res.redirect("/login");
  }
});

module.exports = router;
