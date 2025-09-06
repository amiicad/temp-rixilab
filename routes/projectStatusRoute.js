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
      req.flash('error', 'Missing required fields');
      res.redirect('/admin#submittedProjects')
    }

    // Update the specific project status
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'projectAssigned.projectId': projectId },
      { $set: { 'projectAssigned.$.status': status } },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User or project not found:', req.body);
      req.flash('error', 'User or Project not found');
      return res.redirect('/admin#submittedProjects');
    }

    console.log('Updated user:', updatedUser);
    res.redirect('/admin#submittedProjects'); // back to admin dashboard
  } catch (err) {
    console.error('🔥 Error updating project status:', err);
    req.flash('error', 'Error Updating Project Status');
    res.redirect('/admin#submittedProjects')
  }
});

module.exports = router;
  