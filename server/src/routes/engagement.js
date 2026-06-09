const express = require('express');
const router = express.Router();
const controller = require('../controllers/userEngagementController');
const { verifyToken, optionalVerifyToken } = require('../middlewares/auth');

// Bookmarks
router.get('/my', verifyToken, controller.getMyBookmarks);
router.get('/check/:stallId', optionalVerifyToken, controller.checkBookmark);
router.post('/toggle', verifyToken, controller.toggleBookmark);

// Reviews (Comment Section — UC008)
router.get('/stall/:stallId', controller.getStallReviews);
router.get('/user/:stallId', verifyToken, controller.getUserReview);
router.post('/', verifyToken, controller.submitReview);
router.post('/menu/like', verifyToken, controller.toggleMenuLike);

module.exports = router;
