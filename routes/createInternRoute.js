const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Project = require("../models/Project");
const authRole = require('../middleware/authRole');

router.post("/create-user", authRole("admin"), async (req, res) => {
  try {
    const { 
      name, email, password, role, domain, college, university, 
      phone, course, year_sem, branch, duration, intern_id, batch_no 
    } = req.body;
    if (!name || !email || !password || !domain || !college || !university ||
      !phone || !course || !year_sem || !duration || !intern_id || !batch_no) {
      console.log("❌ Validation failed: Missing required fields");
      req.flash("error", "All required fields must be filled!");
      return res.redirect("/admin"); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      domain,
      college,
      university,
      phone,
      course,
      year_sem,
      branch,
      duration : Number(duration),
      intern_id,
      batch_no
    });

    await user.save();

    // 🔹 Fetch all projects for the same domain + batch
    const projects = await Project.find({ domain, batch_no });

    // 🔹 Apply duration rules
    const eligibleProjects = projects.filter(p => {
      if (p.week <= 4 && [4, 6, 8].includes(Number(duration))) return true;
      if (p.week === 6 && [6, 8].includes(Number(duration))) return true;
      if (p.week === 8 && [8].includes(Number(duration))) return true;
      return false;
    });

    if (eligibleProjects.length > 0) {
      user.projectAssigned = eligibleProjects.map(p => ({
        projectId: p._id,
        week: p.week,
        status: "pending"
      }));
      await user.save();
    }
     req.flash("success", `Intern ${name} created successfully!`);
    // console.log(`✅ Intern ${user.name} created & synced with ${eligibleProjects.length} projects`,user);
    res.redirect("/admin");

  } catch (err) {  
    // console.error("🔥 Error creating user:", err);
    req.flash("error", "Error creating Intern.");
    res.redirect("/admin");
  }
});

module.exports = router;
