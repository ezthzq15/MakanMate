const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { optionalVerifyToken } = require('../middlewares/auth');

router.get('/', optionalVerifyToken, recommendationController.getRecommendations);

module.exports = router;
