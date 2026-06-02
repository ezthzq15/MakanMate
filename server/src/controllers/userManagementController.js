const userManagementService = require('../services/userManagementService');

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await userManagementService.getAllUsers(role);
    return res.status(200).json({ users });
  } catch (error) {
    console.error('getAllUsers Error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { userName, userEmail, userPassword, userRole } = req.body;
    const newUser = await userManagementService.createUser({ userName, userEmail, userPassword, userRole });
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('createUser Error:', error.message);
    const knownErrors = [
      'userName, userEmail, userPassword, and userRole are required',
      'Invalid email format',
      'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
      'userRole must be "admin" or "user"',
      'A user with this email already exists',
    ];
    const status = knownErrors.includes(error.message) ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userID, userName, userRole, accountStatus, newPassword } = req.body;
    if (!userID) return res.status(400).json({ error: 'userID is required' });

    await userManagementService.updateUser(userID, {
      userName,
      userRole,
      accountStatus,
      newPassword,
    });
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('updateUser Error:', error.message);
    const knownErrors = [
      'User not found',
      'userName cannot be empty',
      'userRole must be "admin" or "user"',
      'accountStatus must be 0 (Active), 1 (Not Active), or 2 (Suspended)',
      'New password must be at least 8 characters with uppercase, lowercase, number and special character.',
    ];
    const status = knownErrors.includes(error.message) ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;
    if (!userID) return res.status(400).json({ error: 'userID is required' });

    await userManagementService.deleteUser(userID);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser Error:', error.message);
    const status = error.message === 'User not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
