const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');
const Project = require("../models/Project");

router.get("/intern", authRole("intern"), async (req, res) => {
  try {
    const intern = await User.findById(req.session.user);
    if (!intern) {
      req.flash("error", "Intern not found");
      return res.redirect("/login");
    }

    // fetch projects for intern’s domain + batch
    let projects = await Project.find({ 
      domain: intern.domain, 
      batch_no: intern.batch_no 
    });
    
      // fetch intern's project progress
      const assignedProjects = intern.projectAssigned || [];
      const acceptedCount = assignedProjects.filter(p => p.status === 'accepted').length;
      let duration = intern.duration;
      let arr = [0,1,2,3,4,6,8];
      const progress = Math.round((arr[acceptedCount] / duration)*100);
      console.log("Progress:", progress);


      // filter based on intern duration rules
      projects = projects.filter(p => {
        if (intern.duration == 6 && p.isCombined && p.combinedWeeks.includes(5)) {
          return true; // show combined 5-6 only
        }
        if (intern.duration == 8 && p.isCombined && p.combinedWeeks.includes(7)) {
          return true; // show combined 7-8 only
        }
        if (!p.isCombined && p.week <= intern.duration) {
          return true; // normal projects up to intern’s duration
        }
        return false;
      });
      req.flash('success_msg', 'Welcome to Intern Dashboard');
      res.render("intern", { intern, projects, progress });
    } catch (err) {
      console.error("Error in /intern:", err);
      res.status(500).send("Server Error");
    }
  });

  module.exports = router;
