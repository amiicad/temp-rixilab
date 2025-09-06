const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      req.flash("error", `Failed to log out`);
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie('connect.sid'); // clears session cookie
    req.flash("success", "Logged out successfully");
    res.redirect('/'); // back to index.ejs
  });
});

module.exports = router;

