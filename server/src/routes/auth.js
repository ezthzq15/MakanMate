const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authFeatureController');
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/profileFeatureController');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
const { verifyToken } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/profile-picture', verifyToken, upload.single('image'), uploadProfilePicture);

module.exports = router;