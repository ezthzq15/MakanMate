const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/userEngagementController');
const { verifyToken, optionalVerifyToken } = require('../middlewares/auth');

// Use memory storage so the buffer can be passed directly to Firebase Storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Bookmarks
router.get('/check/:stallId', optionalVerifyToken, controller.checkBookmark);
router.post('/toggle', verifyToken, controller.toggleBookmark);

// Reviews (Comment Section — UC008)
router.get('/stall/:stallId', controller.getStallReviews);
router.get('/user/:stallId', verifyToken, controller.getUserReview);
router.post('/', verifyToken, upload.single('image'), controller.submitReview);

module.exports = router;
