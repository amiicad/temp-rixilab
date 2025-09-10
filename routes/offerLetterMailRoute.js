const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ==============================
// CONFIGURATION: Nodemailer
// ==============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ==============================
// HELPER: Send Bulk Offer Letter Emails
// ==============================
async function sendBulkOfferLetterMails(interns) {
  const sendPromises = interns.map(async (intern) => {
    try {
      const { name, email, intern_id } = intern;

      const subject = `Internship Offer Letter Available – Login to Rixi Lab Portal`;
      const body = `
        <html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f3f1; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
      
      <h2 style="color: #2c3e50;">Dear ${name},</h2>
      <p style="font-size: 15px; color: #333;">
        We are pleased to inform you that your <b>Internship Offer Letter</b> is now available 
        on our official website.
      </p>
      
      <div style="background: #f7f3f1; border-left: 4px solid #ff6600; padding: 12px; margin: 20px 0;">
        <p><b>Intern ID:</b> <span style="color:black;"><b>${intern_id}</b></span></p>
        <p><b>Email ID:</b> ${email}</p>
      </div>
      
      <p style="font-size: 15px; color: #333;">To access your offer letter, please follow these steps:</p>
      <ol style="color: #555; font-size: 14px;">
        <li>Visit our website</li>
        <li>Navigate to the Login page</li>
        <li>Login using your credentials</li>
      </ol>

      <!-- ✅ Button -->
      <p style="text-align: center; margin: 25px 0;">
        <a href="https://rixilab.tech" 
           style="background: #ff6600; color: white; text-decoration: none; 
                  padding: 12px 20px; border-radius: 6px; font-weight: bold; 
                  display: inline-block;">
          Login & Download Offer Letter
        </a>
      </p>

      <p style="font-size: 14px; color: #333;">
        Once logged in, you will be able to:<br>
        • Download your Internship Offer Letter<br>
        • View your Project Timeline<br>
        • Download your assigned project(s)<br>
        • Upload your completed work
      </p>

      <p style="font-size: 14px; color: #666;">
        If you face any difficulties logging in, feel free to reach out to our support team on WhatsApp.
      </p>

      <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">

      <!-- ✅ Signature -->
      <p style="font-size: 14px; color: #333; margin-bottom: 5px;">
  Thanks & Regards,<br>
  <b style="font-size:16px; font-weight:700; color:#2c3e50;">Rixi Lab</b><br>
  <i>"Rethink Innovate eXecute Inspire"</i>
</p>

      <!-- ✅ Social Media -->
      <p style="text-align: center; margin-top: 15px;">
        <a href="https://www.instagram.com/rixilab.in" target="_blank" style="margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
               alt="Instagram" width="26" style="vertical-align: middle;">
        </a>
        <a href="https://www.linkedin.com/company/rixilab" target="_blank" style="margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
               alt="LinkedIn" width="26" style="vertical-align: middle;">
        </a>
        <a href="https://www.facebook.com/rixilab" target="_blank" style="margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
               alt="Facebook" width="26" style="vertical-align: middle;">
        </a>
      </p>

      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
        © 2025 Rixi Lab | <a href="https://rixilab.tech" style="color:#3498db; text-decoration:none;">www.rixilab.tech</a>
      </p>
    </div>
  </body>
</html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        html: body,
      });

      // console.log(`✅ Offer Letter sent to ${email}`);
      return { status: "fulfilled", email, intern_id };
    } catch (err) {
      // console.error(`❌ Offer Letter failed for ${email}:`, err.message);
      return { status: "rejected", email, intern_id, reason: err.message };
    }
  });

  return Promise.all(sendPromises);
}

// ==============================
// ROUTE: Send Offer Letter Mail
// ==============================
router.post("/send-offerletter-mail", async (req, res) => {
  try {
    const { interns } = req.body;

    // Normalize interns to array
    const internIds = interns
      ? Array.isArray(interns)
        ? interns
        : [interns]
      : [];

    // Validation: interns must be selected
    if (!internIds.length) {
      req.flash("error", "No interns selected for offer letter mail.");
      return res.redirect("/superAdmin");
    }

    // Fetch selected interns from DB
    const matchedInterns = await User.find({ intern_id: { $in: internIds } });

    if (!matchedInterns.length) {
      req.flash("error", "No matching interns found in the database.");
      return res.redirect("/superAdmin");
    }

    // Send emails
    const results = await sendBulkOfferLetterMails(matchedInterns);

    // Update DB for all successful sends
    const successfulInternIds = results
      .filter(r => r.status === "fulfilled")
      .map(r => r.intern_id);

    if (successfulInternIds.length > 0) {
      const updateResult = await User.updateMany(
        { intern_id: { $in: successfulInternIds } },
        { $set: { offer_letter_sent: true } }
      );
      // console.log("DB update result:", updateResult);
    }

    // Flash messages
    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failedCount = results.filter(r => r.status === "rejected").length;

    if (failedCount === 0) {
      req.flash("success", `✅ ${successCount} offer letters sent successfully.`);
    } else {
      req.flash(
        "error",
        `⚠️ ${successCount} sent, ${failedCount} failed. Check logs.`
      );
    }

    res.redirect("/superAdmin");
  } catch (err) {
    // console.error("Error in offer letter route:", err);
    req.flash("error", "Server error while sending offer letters.");
    res.redirect("/superAdmin");
  }
});

module.exports = router;
