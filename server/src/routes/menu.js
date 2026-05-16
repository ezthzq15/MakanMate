const express = require('express');
const router = express.Router();
const { getStallMenu, createMenuItem, updateMenuItem, deleteMenuItem, getGlobalCategories } = require('../controllers/menuManagementController');
const { verifyToken, isAdminOrManager } = require('../middlewares/auth');

// All menu operations require Admin or StallManager role
router.get('/categories/global', verifyToken, isAdminOrManager, getGlobalCategories);
router.get('/:stallID', verifyToken, isAdminOrManager, getStallMenu);
router.post('/', verifyToken, isAdminOrManager, createMenuItem);
router.put('/', verifyToken, isAdminOrManager, updateMenuItem);
router.delete('/:menuID', verifyToken, isAdminOrManager, deleteMenuItem);

module.exports = router;
