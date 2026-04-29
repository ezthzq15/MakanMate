const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/authFeatureController');
const { getProfile, updateProfile } = require('../controllers/profileFeatureController');
const { verifyToken } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', verifyToken, changePassword);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;