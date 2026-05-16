const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const stallRoutes = require('./stalls');
const userRoutes = require('./users');
const preferenceRoutes = require('./preferences');
const recommendationRoutes = require('./recommendation');
const adminRoutes = require('./admin');
const menuRoutes = require('./menu');
const engagementRoutes = require('./engagement');
const voucherRoutes = require('./vouchers');

router.use('/auth', authRoutes);
router.use('/stalls', stallRoutes);
router.use('/users', userRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/recommendation', recommendationRoutes);
router.use('/admin', adminRoutes);
router.use('/menu', menuRoutes);
router.use('/engagement', engagementRoutes);
router.use('/vouchers', voucherRoutes);

module.exports = router;