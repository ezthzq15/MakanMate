const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * Service to handle User document operations in Firestore
 */
class ProfileFeatureService {
  /**
   * Retrieve a user by their userID
   */
  async getUserProfile(userID) {
    if (!userID) throw new Error('userID is required');

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();

    if (!doc.exists) return null;

    return User.fromFirestore(doc);
  }

  /**
   * Update allowed fields for a given userID
   */
  async updateUserProfile(userID, updateData) {
    if (!userID) throw new Error('userID is required');

    const { userName, userPassword, currentPassword, userPhone, profilePic, address, gender, birthday } = updateData;

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();
    if (!doc.exists) throw new Error('User not found');

    const updatePayload = {};

    if (userName)              updatePayload.userName   = userName;
    if (userPhone  !== undefined) updatePayload.userPhone  = userPhone;
    if (profilePic !== undefined) updatePayload.profilePic = profilePic;
    if (address    !== undefined) updatePayload.address   = address;
    if (gender     !== undefined) updatePayload.gender    = gender;
    if (birthday   !== undefined) updatePayload.birthday  = birthday;

    if (userPassword) {
      // Verify current password first
      if (!currentPassword) throw new Error('Current password is required to set a new password.');
      const stored = doc.data().userPassword;
      const match = await bcrypt.compare(currentPassword, stored);
      if (!match) throw new Error('Current password is incorrect.');

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(userPassword)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, number and special character.');
      }
      updatePayload.userPassword = await bcrypt.hash(userPassword, 10);
    }

    await userRef.update(updatePayload);
    return true;
  }
}

module.exports = new ProfileFeatureService();
