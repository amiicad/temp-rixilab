const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update project status via POST body
router.post('/projects/update-status', async (req, res) => {
  try {
    const { userId, projectId, status } = req.body;

    // Check for missing fields
    if (!userId || !projectId || !status) {
      console.error('Missing required fields:', req.body);
      return res.status(400).send('Missing required fields');
    }

    // Update the specific project status
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'projectAssigned.projectId': projectId },
      { $set: { 'projectAssigned.$.status': status } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User or project not found');
    }

    console.log('Updated user:', updatedUser);
    res.redirect('/admin'); // back to admin dashboard
  } catch (err) {
    console.error('🔥 Error updating project status:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
  