const express = require('express');
const router = express.Router();

router.get("/logout", (req, res) => {
  if (!req.session) {
    return res.redirect("/login"); // or handle gracefully
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});


module.exports = router;

