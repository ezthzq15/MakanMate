const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');

/**
 * Admin Service: Full CRUD for Users collection (UC010)
 * Variables strictly from class diagram: userID, userName, userEmail,
 * userPassword, userPhone, userRole, isActive, preferenceID
 */
class AdminUserService {
  /**
   * Fetch all users from Firestore
   * @returns {Array} list of user objects
   */
  async getAllUsers() {
    const snapshot = await db.collection('users').orderBy('userName').get();
    return snapshot.docs.map((doc) => ({
      userID: doc.id,
      userName: doc.data().userName,
      userEmail: doc.data().userEmail,
      userPhone: doc.data().userPhone || '',
      userRole: doc.data().userRole || 'user',
      accountStatus: doc.data().accountStatus !== undefined ? doc.data().accountStatus : 0,
      lastLoginAt: doc.data().lastLoginAt || null,
      preferenceID: doc.data().preferenceID || '',
      createdAt: doc.data().createdAt || '',
    }));
  }

  /**
   * Create a new user (Admin-initiated)
   * @param {Object} userData { userName, userEmail, userPassword, userRole }
   */
  async createUser({ userName, userEmail, userPassword, userRole }) {
    if (!userName || !userEmail || !userPassword || !userRole) {
      throw new Error('userName, userEmail, userPassword, and userRole are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw new Error('Invalid email format');
    }

    if (userPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(userRole)) {
      throw new Error('userRole must be "admin" or "user"');
    }

    // Check uniqueness
    const existing = await db.collection('users').where('userEmail', '==', userEmail).get();
    if (!existing.empty) {
      throw new Error('A user with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

    const newUser = {
      userName,
      userEmail,
      userPassword: hashedPassword,
      userPhone: '',
      userRole,
      accountStatus: 0,
      lastLoginAt: null,
      preferenceID: '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('users').add(newUser);
    return { userID: docRef.id, ...newUser };
  }

  /**
   * Update user fields: userName, userRole, isActive only
   * @param {string} userID
   * @param {Object} updateData { userName, userRole, isActive }
   */
  async updateUser(userID, { userName, userRole, accountStatus }) {
    if (!userID) throw new Error('userID is required');

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();
    if (!doc.exists) throw new Error('User not found');

    const updatePayload = {};

    if (userName !== undefined) {
      if (!userName || userName.trim() === '') throw new Error('userName cannot be empty');
      updatePayload.userName = userName.trim();
    }

    if (userRole !== undefined) {
      const allowedRoles = ['admin', 'user'];
      if (!allowedRoles.includes(userRole)) throw new Error('userRole must be "admin" or "user"');
      updatePayload.userRole = userRole;
    }

    if (accountStatus !== undefined) {
      const allowedStatuses = [0, 1, 2];
      if (!allowedStatuses.includes(Number(accountStatus))) {
        throw new Error('accountStatus must be 0 (Active), 1 (Not Active), or 2 (Suspended)');
      }
      updatePayload.accountStatus = Number(accountStatus);
    }

    await userRef.update(updatePayload);
    return true;
  }

  /**
   * Delete a user by userID
   * @param {string} userID
   */
  async deleteUser(userID) {
    if (!userID) throw new Error('userID is required');

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();
    if (!doc.exists) throw new Error('User not found');

    await userRef.delete();
    return true;
  }
}

module.exports = new AdminUserService();
