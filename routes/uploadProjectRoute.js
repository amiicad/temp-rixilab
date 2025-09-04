const express = require('express');
const router = express.Router();
const Project = require("../models/Project");
const authRole = require('../middleware/authRole');
const User = require("../models/User");

router.post("/admin/projects", authRole("admin"), async (req, res) => {
  try {
    console.log("📌 Incoming Project Data:", req.body);

    const adminId = req.session.user;
    const admin = await User.findById(adminId);

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).send("Admin not found");
    }

    const { title, description, downloadLink, uploadLink, week, batch_no } = req.body;

    // ✅ Build new project according to schema
    const newProject = new Project({
      title,
      description,
      domain: admin.domain, // lock to admin's domain
      downloadLink,
      uploadLink,
      week,
      batch_no,
      createdBy: admin._id
    });

    console.log("📌 New Project Before Save:", newProject);

    await newProject.save();

    console.log("✅ Project Created Successfully!");
    res.redirect("/admin");
  } catch (err) {
    console.error("🔥 Error in /admin/projects:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
