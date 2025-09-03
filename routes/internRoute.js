const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');
const Project = require("../models/Project");

router.get("/intern", authRole("intern"), async (req, res) => {
  const intern = await User.findById(req.session.user);
  const projects = await Project.find({ domain: intern.domain }).populate("submissions.internId");
  res.render("intern", { intern, projects });
});
module.exports = router;