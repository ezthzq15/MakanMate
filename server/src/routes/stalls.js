const express = require("express");
const router = express.Router();

const { getMyStall, updateMyStall } = require('../controllers/stallManagementController');
const { verifyToken, isStallManager } = require('../middlewares/auth');

// Stall Manager Specific Routes
router.get('/my-stall', verifyToken, isStallManager, getMyStall);
router.put('/my-stall', verifyToken, isStallManager, updateMyStall);

module.exports = router;
