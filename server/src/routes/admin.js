const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/adminUserController');
const { getAllStalls, createStall, updateStall, deleteStall } = require('../controllers/stallController');

// Admin dashboard (existing)
const getDashboard = (req, res) => {
  return res.status(200).json({ message: 'Welcome to the admin dashboard!', data: { activeUsers: 104 } });
};
router.get('/dashboard', verifyToken, isAdmin, getDashboard);

// UC010: Manage User Routes — all protected by JWT + Admin role
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.post('/users', verifyToken, isAdmin, createUser);
router.put('/users/update', verifyToken, isAdmin, updateUser);
router.delete('/users/:userID', verifyToken, isAdmin, deleteUser);

// UC009: Manage Food Stalls
router.get('/stalls', verifyToken, isAdmin, getAllStalls);
router.post('/stalls', verifyToken, isAdmin, createStall);
router.put('/stalls/update', verifyToken, isAdmin, updateStall);
router.delete('/stalls/:stallID', verifyToken, isAdmin, deleteStall);

module.exports = router;
