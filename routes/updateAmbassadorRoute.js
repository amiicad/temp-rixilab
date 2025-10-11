const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Ambassador = require("../models/Ambassador");
const authRole = require("../middleware/authRole");

// Update Ambassador route
router.post(
  "/update-ambassador/:id",
  authRole("superAdmin"),
  async (req, res) => {
    try {
      const ambassador = await Ambassador.findById(req.params.id);
      if (!ambassador) {
        req.flash("error", "Ambassador not found");
        return res.redirect("/superAdmin");
      }

      const {
        ambassador_id,
        name,
        email,
        phone,
        college,
        university,
        designation,
        offer_letter_link,
        certificate_link,
        password,
        mail_sent,
      } = req.body;

      const existingAmbassador = await Ambassador.findById(req.params.id);

      let updateData = {
        ambassador_id,
        name,
        email,
        phone,
        college,
        university,
        designation,
        offer_letter_link,
        certificate_link,
      };

      // Only hash if a new password is provided
      if (password && password.trim() !== "") {
        const isSamePassword = await bcrypt.compare(
          password,
          existingAmbassador.password
        );
        if (!isSamePassword) {
          updateData.password = await bcrypt.hash(password, 10);
          updateData.isFirstLogin = true;
        }
      }
      // Update mail sent status based on input
      if (mail_sent === "reset") {
        updateData.bronze_mail_sent = false;
        updateData.silver_mail_sent = false;
        updateData.gold_mail_sent = false;
      } else if (mail_sent) {
        if (mail_sent === "bronze") updateData.bronze_mail_sent = true;
        if (mail_sent === "silver") updateData.silver_mail_sent = true;
        if (mail_sent === "gold") updateData.gold_mail_sent = true;
      }

      await Ambassador.findByIdAndUpdate(req.params.id, updateData);

      req.flash("success", "Ambassador Updated Successfully!");
      return res.redirect("/superAdmin#viewAmbassadors");
    } catch (err) {
      // console.error("Update Ambassador Error:", err);
      req.flash("error", "Failed to update ambassador: " + err.message);
      return res.redirect("/superAdmin");
    }
  }
);

module.exports = router;
