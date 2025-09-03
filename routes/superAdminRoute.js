const express = require('express');
const router = express.Router();
const User = require("../models/User");
const authRole = require('../middleware/authRole');

router.get("/superAdmin", authRole("superAdmin"), async (req, res) => {
   const interns = await User.find({ role: "intern" });
   const batches = [...new Set(interns.map(i => i.batch_no))];
   const admins = await User.find({ role: "admin" });
   const superAdmin = await User.findOne({ role: "superAdmin" });
   res.render("superAdmin", { interns, admins, superAdmin, batches });
});
module.exports = router;