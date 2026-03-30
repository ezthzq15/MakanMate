const adminUserService = require('../services/adminUserService');

/**
 * UC010: Manage User — Admin Controller
 * All variable names strictly from class diagram.
 */

/**
 * GET /admin/users
 * Retrieve all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await adminUserService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error('getAllUsers Error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * POST /admin/users
 * Create a new user (admin-initiated)
 * Body: { userName, userEmail, userPassword, userRole }
 */
const createUser = async (req, res) => {
  try {
    const { userName, userEmail, userPassword, userRole } = req.body;
    const newUser = await adminUserService.createUser({ userName, userEmail, userPassword, userRole });
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('createUser Error:', error.message);
    const knownErrors = [
      'userName, userEmail, userPassword, and userRole are required',
      'Invalid email format',
      'Password must be at least 8 characters',
      'userRole must be "admin" or "user"',
      'A user with this email already exists',
    ];
    const status = knownErrors.includes(error.message) ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

/**
 * PUT /admin/users/update
 * Update user: userName, userRole, isActive only
 * Body: { userID, userName, userRole, isActive }
 */
const updateUser = async (req, res) => {
  try {
    const { userID, userName, userRole, isActive } = req.body;
    if (!userID) return res.status(400).json({ error: 'userID is required' });

    await adminUserService.updateUser(userID, { userName, userRole, isActive });
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('updateUser Error:', error.message);
    const knownErrors = ['User not found', 'userName cannot be empty', 'userRole must be "admin" or "user"'];
    const status = knownErrors.includes(error.message) ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

/**
 * DELETE /admin/users/:userID
 * Delete a user by userID
 */
const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;
    if (!userID) return res.status(400).json({ error: 'userID is required' });

    await adminUserService.deleteUser(userID);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser Error:', error.message);
    const status = error.message === 'User not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
