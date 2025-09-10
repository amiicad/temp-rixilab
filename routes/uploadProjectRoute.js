const express = require('express');
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const authRole = require('../middleware/authRole');

router.post("/admin/projects", authRole("admin"), async (req, res) => {
  try {
    // console.log("📌 Incoming Project Data:", req.body);

    const adminId = req.session.user;
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).send("Admin not found");

    let { title, description, downloadLink, uploadLink, week, batch_no } = req.body;

    // Convert week to number
    week = Number(week);

    // ✅ Create new project
    const newProject = new Project({
      title,
      description,
      domain: admin.domain,
      downloadLink,
      uploadLink,
      week,
      batch_no,
      createdBy: admin._id
    });
    await newProject.save();
    // console.log("✅ Project Created:", newProject._id);

    // 🔹 Determine eligible intern durations
    const allDurations = [4, 6, 8];
    const eligibleDurations = allDurations.filter(d => d >= week);

    // 🔹 Assign project to eligible interns
    const result = await User.updateMany(
      {
        role: "intern",
        domain: admin.domain,
        batch_no,
        duration: { $in: eligibleDurations }
      },
      {
        $push: {
          projectAssigned: {
            projectId: newProject._id,
            week: newProject.week,
            status: "pending"
          }
        }
      }
    );
    req.flash('success', 'Project Created Successfully!');
    // console.log(`✅ Users updated for batch ${batch_no}:`, result.modifiedCount);
    res.redirect("/admin#uploadProject");
  } catch (err) {
   req.flash('error', 'Project Creation Failed! '+err.message);
    res.redirect('/admin#uploadproject');
  }
});

module.exports = router;
