const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

/**
 * Service to handle User document operations in Firestore
 */
class UserService {
  /**
   * Retrieve a user by their userID
   * @param {string} userID 
   * @returns {UserModel|null}
   */
  async getUserProfile(userID) {
    if (!userID) throw new Error('userID is required');

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();

    if (!doc.exists) return null;

    // Convert Firestore doc into a UserModel instance
    return UserModel.fromFirestore(doc);
  }

  /**
   * Update allowed fields for a given userID
   * @param {string} userID 
   * @param {Object} updateData { userName, userPassword, userPhone }
   */
  async updateUserProfile(userID, updateData) {
    if (!userID) throw new Error('userID is required');

    const { userName, userPassword, userPhone } = updateData;
    const updatePayload = {};

    if (userName) updatePayload.userName = userName;
    if (userPhone !== undefined) updatePayload.userPhone = userPhone;

    if (userPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(userPassword)) {
        throw new Error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      }
      const saltRounds = 10;
      updatePayload.userPassword = await bcrypt.hash(userPassword, saltRounds);
    }

    const userRef = db.collection('users').doc(userID);
    
    // Check if user exists before updating
    const doc = await userRef.get();
    if (!doc.exists) throw new Error('User not found');

    // Use toFirestore static method to ensure only allowed fields are sent
    await userRef.update(updatePayload);

    return true;
  }
}

module.exports = new UserService();

