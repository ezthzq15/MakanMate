const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');

const getDashboard = (req, res) => {
    // Controller logic to return admin dashboard data
    return res.status(200).json({ 
        message: 'Welcome to the admin dashboard!',
        data: {
            activeUsers: 104,
            sales: 50000
        }
    });
};

// Admin route protected by BOTH basic JWT auth AND RBAC
router.get('/dashboard', verifyToken, isAdmin, getDashboard);

module.exports = router;
