const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const { verifyToken } = require('../middlewares/auth');

// UC004: Set/Update User Preference
router.get('/:userId', verifyToken, preferenceController.getPreferences);
router.post('/', verifyToken, preferenceController.savePreferences);

module.exports = router;
