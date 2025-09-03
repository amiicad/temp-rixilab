const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const authRole = require('../middleware/authRole');

// Admin Dashboard
router.get("/admin", authRole("admin"), async (req, res) => {
  try {
    // Get logged-in admin ID from session
    const adminId = req.session.user;

    // Fetch admin details
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).send("Admin not found");

    // Fetch interns only in the admin's domain
    const interns = await User.find({ role: "intern", domain: admin.domain });
    
    const batches = [...new Set(interns.map(i => i.batch_no))];

    // Fetch projects assigned for this domain
    const projects = await Project.find({ domain: admin.domain }).populate("submissions.internId");

    // Render admin page
    res.render("admin", { admin, interns, projects,batches });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
