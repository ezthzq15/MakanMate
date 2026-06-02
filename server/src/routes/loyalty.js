const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const challengeController = require('../controllers/challengeController');
const { verifyToken } = require('../middlewares/auth');

// Protected User Routes
router.get('/points', verifyToken, loyaltyController.getPointsData);
router.post('/challenge/complete', verifyToken, loyaltyController.claimChallenge);
router.get('/challenges', verifyToken, challengeController.getActiveChallenges);

module.exports = router;
