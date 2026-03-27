const { db } = require('../config/firebase');
const PreferenceModel = require('../models/preferenceModel');

class PreferenceService {
  /**
   * Fetch preferences by preferenceID
   * @param {string} preferenceID 
   * @returns {PreferenceModel|null}
   */
  async getPreferences(preferenceID) {
    if (!preferenceID) return null;

    const prefRef = db.collection('userPreferences').doc(preferenceID);
    const doc = await prefRef.get();

    if (!doc.exists) return null;

    return PreferenceModel.fromFirestore(doc);
  }

  /**
   * Save or update preferences for a user
   * @param {string} userID 
   * @param {Object} data Preferences data
   */
  async savePreferences(userID, data) {
    if (!userID) throw new Error('userID is required');

    const userRef = db.collection('users').doc(userID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) throw new Error('User not found');

    const userData = userDoc.data();
    let preferenceID = userData.preferenceID;

    const prefPayload = PreferenceModel.toFirestore(data);

    if (preferenceID) {
      // Update existing
      await db.collection('userPreferences').doc(preferenceID).set(prefPayload, { merge: true });
    } else {
      // Create new
      const newPrefRef = await db.collection('userPreferences').add(prefPayload);
      preferenceID = newPrefRef.id;
      // Link back to user
      await userRef.update({ preferenceID });
    }

    return preferenceID;
  }
}

module.exports = new PreferenceService();
