const userService = require('../services/userService');

/**
 * Handle GET /profile/:userID
 */
const getProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ error: 'userID missing' });
    }

    const profile = await userService.getUserProfile(userID);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('getProfile Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * Handle PUT /profile/update
 * Body: { userID, userName, userPassword, userPhone }
 */
const updateProfile = async (req, res) => {
  try {
    const { userID, userName, userPassword, userPhone } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID missing' });
    }

    if (!userName || userName.trim() === '') {
      return res.status(400).json({ error: 'userName empty' });
    }

    await userService.updateUserProfile(userID, { userName, userPassword, userPhone });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile Error:', error);
    
    // Handled explicit errors from Service
    if (error.message === 'User not found' || error.message === 'Password must be at least 8 characters long') {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};