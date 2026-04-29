const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileFeatureController');
const preferenceController = require('../controllers/preferenceFeatureController');
const { verifyToken } = require('../middlewares/auth');

/**
 * User Profile Endpoints
 */
router.get('/profile/:userID', verifyToken, profileController.getProfile);
router.put('/profile/update', verifyToken, profileController.updateProfile);

module.exports = router;

