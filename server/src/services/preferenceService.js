const { db } = require('../config/firebase');
const PreferenceModel = require('../models/preferenceModel');

class PreferenceService {
  /**
   * Fetch preferences by userID
   * @param {string} userID 
   * @returns {PreferenceModel|null}
   */
  async getPreferences(userID) {
    if (!userID) return null;

    // Find the preference document that has this userID
    const prefSnapshot = await db.collection('userPreferences').where('userID', '==', userID).limit(1).get();

    if (prefSnapshot.empty) return null;

    const doc = prefSnapshot.docs[0];
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

    const prefPayload = PreferenceModel.toFirestore({ ...data, userID });

    if (preferenceID) {
      // Update existing
      await db.collection('userPreferences').doc(preferenceID).set(prefPayload, { merge: true });
    } else {
      // Check if document exists with this userID already (extra safety)
      const existing = await db.collection('userPreferences').where('userID', '==', userID).limit(1).get();
      
      if (!existing.empty) {
        preferenceID = existing.docs[0].id;
        await db.collection('userPreferences').doc(preferenceID).set(prefPayload, { merge: true });
      } else {
        // Create new
        const newPrefRef = await db.collection('userPreferences').add(prefPayload);
        preferenceID = newPrefRef.id;
      }
      
      // Link back to user
      await userRef.update({ preferenceID });
    }

    return preferenceID;
  }
}

module.exports = new PreferenceService();
