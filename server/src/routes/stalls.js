const express = require("express");
const router = express.Router();

const { getMyStall, updateMyStall } = require('../controllers/stallManagementController');
const stallController = require('../controllers/stallController');
const { verifyToken, isStallManager } = require('../middlewares/auth');

// Public Discovery
router.get('/search', stallController.searchStalls);

// Stall Manager Specific Routes
router.get('/my-stall', verifyToken, isStallManager, getMyStall);
router.put('/my-stall', verifyToken, isStallManager, updateMyStall);

module.exports = router;
