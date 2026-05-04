const express = require("express");
const router = express.Router();

const { getMyStall, updateMyStall } = require('../controllers/stallManagementController');
const stallController = require('../controllers/stallController');
const { verifyToken, isStallManager, optionalVerifyToken } = require('../middlewares/auth');

// Public Discovery
router.get('/search', stallController.searchStalls);

// Stall Manager Specific Routes
router.get('/my-stall', verifyToken, isStallManager, getMyStall);
router.put('/my-stall', verifyToken, isStallManager, updateMyStall);

// Public Detail (Must be last to avoid collision)
router.get('/:id', optionalVerifyToken, stallController.getStallById);

module.exports = router;
