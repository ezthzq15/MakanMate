const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const { verifyToken } = require('../middlewares/auth');

/**
 * UC004: User Preference Endpoints
 */

// GET /api/preferences/:userID
router.get('/:userID', verifyToken, preferenceController.getPreferences);

// PUT /api/preferences/update
router.put('/update', verifyToken, preferenceController.savePreferences);

module.exports = router;
