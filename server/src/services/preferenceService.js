const { db } = require('../config/firebase');
const PreferenceModel = require('../models/preferenceModel');

class PreferenceService {
  /**
   * Fetch preferences by userId
   */
  async getPreferences(userId) {
    if (!userId) return null;

    const prefSnapshot = await db.collection('userPreferences')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (prefSnapshot.empty) return null;

    const doc = prefSnapshot.docs[0];
    return PreferenceModel.fromFirestore(doc);
  }

  /**
   * Save or update preferences for a user
   */
  async savePreferences(userId, data) {
    if (!userId) throw new Error('userId is required');

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) throw new Error('User not found');

    const userData = userDoc.data();
    let preferenceID = userData.preferenceID;

    const prefPayload = PreferenceModel.toFirestore({ ...data, userId });

    if (preferenceID) {
      await db.collection('userPreferences').doc(preferenceID).set(prefPayload, { merge: true });
    } else {
      // Secondary check by userId in case preferenceID isn't linked to user doc yet
      const existing = await db.collection('userPreferences')
        .where('userId', '==', userId)
        .limit(1)
        .get();
      
      if (!existing.empty) {
        preferenceID = existing.docs[0].id;
        await db.collection('userPreferences').doc(preferenceID).set(prefPayload, { merge: true });
      } else {
        const newPrefRef = await db.collection('userPreferences').add(prefPayload);
        preferenceID = newPrefRef.id;
      }
      
      // Ensure the user document is linked to this preference entry
      await userRef.update({ preferenceID });
    }

    return preferenceID;
  }
}

module.exports = new PreferenceService();
