const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { verifyToken } = require('../middlewares/auth');

// Protected User Routes
router.get('/points', verifyToken, loyaltyController.getPointsData);
router.post('/challenge/complete', verifyToken, loyaltyController.claimChallenge);

module.exports = router;
