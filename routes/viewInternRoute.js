const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');
const Project = require("../models/Project");

router.get("/admin/intern/:internId", authRole(['admin','superAdmin']), async (req, res) => {
  const intern = await User.findById(req.params.internId);
  if (!intern || intern.role !== "intern"){
    req.flash("error", "Intern not found");
    return res.redirect("/admin")
  } ;
  const acceptedCount = intern.projectAssigned.filter(p => p.status === "accepted").length;
  const total = intern.duration || intern.projectAssigned.length || 1;
  const progress = Math.min(100, Math.round((acceptedCount / total) * 100));

  const projects = await Project.find({ domain: intern.domain });
  res.render("intern", { intern, projects,progress });
});
module.exports = router;