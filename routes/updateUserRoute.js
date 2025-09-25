const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authRole = require("../middleware/authRole");
// Update user route
router.post(
  "/update-user/:id",
  authRole(["admin", "superAdmin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");

      // SuperAdmin updating an admin
      if (user.role === "admin" && req.session.role === "superAdmin") {
        const {
          name,
          email,
          domain,
          emp_id,
          phone,
          designation,
          img_url,
          password,
        } = req.body;

        const existingUser = await User.findById(req.params.id);

        let updateData = {
          name,
          email,
          domain,
          emp_id,
          phone,
          designation,
          img_url,
        };

        // Only hash if superAdmin entered a password that is different
        if (password && password.trim() !== "") {
          const isSamePassword = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (!isSamePassword) {
            updateData.password = await bcrypt.hash(password, 10);
          }
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        req.flash("success", "Admin Updated Successfully!");
        return res.redirect("/superAdmin");
      }

      // Admin updating an intern
      if (user.role === "intern" && req.session.role === "admin") {
        const {
          name,
          email,
          domain,
          college,
          university,
          year_sem,
          phone,
          branch,
          batch_no,
          certificate_id,
          offer_letter,
          certificate_link,
          duration,
          password,
        } = req.body;

        const existingUser = await User.findById(req.params.id);

        let updateData = {
          name,
          email,
          domain,
          college,
          university,
          year_sem,
          phone,
          branch,
          batch_no,
          certificate_id,
          offer_letter,
          certificate_link,
          duration,
        };

        // only handle password if a new one is typed
        if (password && password.trim() !== "") {
          const isSamePassword = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (!isSamePassword) {
            updateData.password = await bcrypt.hash(password, 10);
          }
          // else do nothing → keep old password as it is
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        req.flash("success", "Intern Updated Successfully!");
        return res.redirect("/admin#viewInterns");
      }

      // If role mismatch
      req.flash("error", "No Authority to make this change");
      return res.redirect("/login");
    } catch (err) {
      // console.error("Update Error:", err);
      req.flash("error", err.message);
    }
  }
);
module.exports = router;
