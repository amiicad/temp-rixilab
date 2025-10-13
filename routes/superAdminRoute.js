const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authRole = require("../middleware/authRole");
const Ambassador = require("../models/Ambassador");

// router.get("/superAdmin", authRole("superAdmin"), async (req, res) => {
//   try {
//     const interns = await User.find({ role: "intern" });
//     const batches = [...new Set(interns.map(i => i.batch_no))];
//     const admins = await User.find({ role: "admin" });
//     const ambassadors = await Ambassador.find({});
//     const superAdmin = await User.findOne({ role: "superAdmin" });
//     const certifiedInternsCount = interns.filter(
//       i => i.certificate_link && i.certificate_link.trim() !== ""
//     ).length;
//       const adminNotices = admins.flatMap(a =>
//       a.notice.map(n => ({
//         title: n.title,
//         description: n.description,
//         adminName: a.name
//       }))
//     );

//     res.render("superAdmin", {
//       interns,
//       admins,
//       superAdmin,
//       ambassadors,
//       batches,
//       certifiedInternsCount,
//       adminNotices
//     });
//   } catch (err) {
//     // console.error(err);
//     req.flash("error", "Failed to load Super Admin Dashboard");
//     res.redirect("/login");
//   }
// });

// module.exports = router;

router.get("/superAdmin", authRole("superAdmin"), async (req, res) => {
  try {
    const interns = await User.find({ role: "intern" });
    const batches = [...new Set(interns.map(i => i.batch_no))];
    const admins = await User.find({ role: "admin" });
    const ambassadors = await Ambassador.find({});
    const superAdmin = await User.findOne({ role: "superAdmin" });

    // Count certified interns
    const certifiedInternsCount = interns.filter(
      i => i.certificate_link && i.certificate_link.trim() !== ""
    ).length;

    // Aggregate unique meetings
  // Aggregate unique meetings for display
let meetingsMap = new Map();
interns.forEach(intern => {
  intern.meetings.forEach(meeting => {
    const key = `${intern.domain}-${intern.batch_no}-${meeting.week}-${meeting.title}`;
    if (!meetingsMap.has(key)) {
      meetingsMap.set(key, {
        ...meeting.toObject(),
        domain: intern.domain,
        batch_no: intern.batch_no
      });
    }
  });
});

const getObjectIdTime = id => new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);

const meetings = Array.from(meetingsMap.values()).sort(
  (a, b) => getObjectIdTime(b._id) - getObjectIdTime(a._id)
);


    // Admin notices
    const adminNotices = admins.flatMap(a =>
      a.notice.map(n => ({
        title: n.title,
        description: n.description,
        adminName: a.name
      }))
    );

   const arr = [0, 1, 2, 3, 4, 6, 8];
interns.forEach(intern => {
  const assignedProjects = intern.projectAssigned || [];
  const acceptedCount = assignedProjects.filter(p => p.status === 'accepted').length;
  const duration = intern.duration || 1;
  intern.intern_progress = Math.round((arr[acceptedCount] / duration) * 100);
});

    res.render("superAdmin", {
      interns,
      admins,
      superAdmin,
      ambassadors,
      batches,
      certifiedInternsCount,
      adminNotices,
      meetings,
      showPasswordPopup: superAdmin.isFirstLogin,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load Super Admin Dashboard");
    res.redirect("/login");
  }
});
module.exports = router