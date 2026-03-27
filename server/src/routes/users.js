const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const preferenceController = require('../controllers/preferenceController');
const { verifyToken } = require('../middlewares/auth');

/**
 * User Profile Endpoints
 */
router.get('/profile/:userID', verifyToken, userController.getProfile);
router.put('/profile/update', verifyToken, userController.updateProfile);

/**
 * User Preference Endpoints
 */
router.get('/profile/preference/:userID', verifyToken, preferenceController.getPreferences);
router.put('/profile/preference/update', verifyToken, preferenceController.savePreferences);

module.exports = router;

