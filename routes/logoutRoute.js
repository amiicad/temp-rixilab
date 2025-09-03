const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie('connect.sid'); // clears session cookie
    res.redirect('/'); // back to index.ejs
  });
});

module.exports = router;

