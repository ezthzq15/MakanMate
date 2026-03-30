const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const stallRoutes = require('./stalls');
const userRoutes = require('./users');
const preferenceRoutes = require('./preferences');
const recommendationRoutes = require('./recommendation');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/stalls', stallRoutes);
router.use('/users', userRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;