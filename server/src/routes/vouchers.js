const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// User / Public routes
router.get('/stall/:stallId', voucherController.getStallVouchers);

// Protected User Routes
router.post('/checkin', verifyToken, requireRole('user'), voucherController.requestCheckIn);
router.get('/my-checkins', verifyToken, requireRole('user'), voucherController.getMyCheckIns);
router.get('/checkin/:checkInId/status', verifyToken, requireRole('user'), voucherController.checkInStatus);

// Protected Manager Routes
router.get('/manager', verifyToken, requireRole('StallManager'), voucherController.getManagerVouchers);
router.post('/', verifyToken, requireRole('StallManager'), voucherController.createVoucher);
router.put('/:id', verifyToken, requireRole('StallManager'), voucherController.updateVoucher);
router.delete('/:id', verifyToken, requireRole('StallManager'), voucherController.deleteVoucher);
router.get('/checkins/pending', verifyToken, requireRole('StallManager'), voucherController.getPendingCheckIns);
router.post('/checkins/:checkInId/approve', verifyToken, requireRole('StallManager'), voucherController.approveCheckIn);
router.post('/redeem', verifyToken, requireRole('StallManager'), voucherController.redeemVoucher);

module.exports = router;
