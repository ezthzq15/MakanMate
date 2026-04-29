const express = require("express");
const router = express.Router();

const { getMyStall } = require('../controllers/stallManagementController');
const { verifyToken, isStallManager } = require('../middlewares/auth');

// Stall Manager Specific Route
router.get('/my-stall', verifyToken, isStallManager, getMyStall);

module.exports = router;
