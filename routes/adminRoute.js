const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const Quiz = require("../models/Quiz");
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

        // ✅ Fetch only upcoming meetings for admin
    let upcomingMeetings = (admin.meetings || []).filter(
      m => m.status === "upcoming"
    );

    // ✅ Sort by creation time (newest first)
    const getObjectIdTime = id =>
      new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    upcomingMeetings = upcomingMeetings.sort(
      (a, b) => getObjectIdTime(b._id) - getObjectIdTime(a._id)
    );
   const quizzes = await Quiz.find({ domain: admin.domain }).sort({ createdAt: -1 });
    req.flash("info", `Welcome ${admin.name}`); 
    res.render("admin", { admin, interns, projects, batches, certifiedInternsCount, notices, meetings: upcomingMeetings,  showPasswordPopup: admin.isFirstLogin, quizzes,  });
  } catch (err) {
    // console.error(err);
    req.flash("error", "Server Error");
    res.redirect("/login");
  }
});

module.exports = router;
