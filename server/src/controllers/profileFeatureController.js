const profileFeatureService = require('../services/profileFeatureService');
const { storage } = require('../config/firebase');
const path = require('path');
const getProfile = async (req, res) => {
  try {
    const userID = req.params.userID || req.user.userID;

    if (!userID) {
      return res.status(400).json({ error: 'userID missing' });
    }

    const profile = await profileFeatureService.getUserProfile(userID);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { userPassword, ...safeProfile } = profile;
    return res.status(200).json(safeProfile);
  } catch (error) {
    console.error('getProfile Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { userName, userPassword, currentPassword, userPhone, profilePic, address, gender, birthday } = req.body;

    if (!userName || userName.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    await profileFeatureService.updateUserProfile(userID, { userName, userPassword, currentPassword, userPhone, profilePic, address, gender, birthday });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile Error:', error);
    
    if (error.message === 'User not found' || error.message.includes('Password must')) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const userID = req.user.userID;
    const profile = await profileFeatureService.getUserProfile(userID);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!storage) {
      return res.status(500).json({ error: 'Firebase Storage is not configured' });
    }

    const ext = path.extname(req.file.originalname) || '.' + req.file.mimetype.split('/')[1];
    const sanitizedUserName = profile.userName ? profile.userName.replace(/[^a-zA-Z0-9 ]/g, '').trim() : 'UnknownUser';
    const filename = `Users/${sanitizedUserName}/profilePic_${Date.now()}${ext}`;
    const file = storage.file(filename);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true
    });

    const profilePic = `https://storage.googleapis.com/${storage.name}/${filename}`;

    await profileFeatureService.updateUserProfile(userID, {
      profilePic
    });

    return res.status(200).json({ message: 'Profile picture uploaded successfully', profilePic });
  } catch (error) {
    console.error('uploadProfilePicture Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture
};
