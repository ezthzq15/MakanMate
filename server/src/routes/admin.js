const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userManagementController');
const { getAllStalls, createStall, updateStall, deleteStall } = require('../controllers/stallManagementController');
const adminController = require('../controllers/adminController');
const voucherController = require('../controllers/voucherController');
const challengeController = require('../controllers/challengeController');

// Admin dashboard — real aggregated stats
router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboard);

// UC010: Manage User Routes — all protected by JWT + Admin role
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.post('/users', verifyToken, isAdmin, createUser);
router.put('/users/update', verifyToken, isAdmin, updateUser);
router.delete('/users/:userID', verifyToken, isAdmin, deleteUser);

// Admin Voucher Management
router.get('/vouchers', verifyToken, isAdmin, voucherController.adminGetAllVouchers);
router.post('/vouchers', verifyToken, isAdmin, voucherController.adminCreateVoucher);
router.put('/vouchers/:id', verifyToken, isAdmin, voucherController.adminUpdateVoucher);
router.delete('/vouchers/:id', verifyToken, isAdmin, voucherController.adminDeleteVoucher);
router.post('/vouchers/generate-random', verifyToken, isAdmin, voucherController.adminGenerateRandomVoucher);

// Admin Challenge Management
router.get('/challenges', verifyToken, isAdmin, challengeController.adminGetAllChallenges);
router.post('/challenges', verifyToken, isAdmin, challengeController.adminCreateChallenge);
router.put('/challenges/:id', verifyToken, isAdmin, challengeController.adminUpdateChallenge);
router.delete('/challenges/:id', verifyToken, isAdmin, challengeController.adminDeleteChallenge);
router.post('/challenges/generate-random', verifyToken, isAdmin, challengeController.adminGenerateRandomChallenge);

// UC009: Manage Food Stalls
router.get('/stalls', verifyToken, isAdmin, getAllStalls);
router.post('/stalls', verifyToken, isAdmin, createStall);
router.put('/stalls/update', verifyToken, isAdmin, updateStall);
router.delete('/stalls/:stallID', verifyToken, isAdmin, deleteStall);

module.exports = router;
