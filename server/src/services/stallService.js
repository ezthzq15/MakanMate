const { db } = require('../config/firebase');

/**
 * Admin Service: CRUD for FoodStalls collection (UC009)
 * Variables strictly from class diagram: 
 * stallID, stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL
 */
class StallService {
  /**
   * Fetch all stalls from Firestore
   * @returns {Array} List of stall objects
   */
  async getAllStalls() {
    const snapshot = await db.collection('FoodStalls').orderBy('stallName').get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        stallID: doc.id,
        stallName: data.stallName || '',
        cuisineType: data.cuisineType || '',
        isHalal: data.isHalal === true,
        latitude: Number(data.latitude) || 0,
        longitude: Number(data.longitude) || 0,
        description: data.description || '',
        operatingHours: data.operatingHours || '',
        imageURL: data.imageURL || ''
      };
    });
  }

  /**
   * Create a new stall
   * @param {Object} stallData
   */
  async createStall({ stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL }) {
    // Explicit mapping (no spread operators as per implementation plan)
    const newStall = {
      stallName,
      cuisineType,
      isHalal: Boolean(isHalal),
      latitude: Number(latitude),
      longitude: Number(longitude),
      description: description || '',
      operatingHours: operatingHours || '',
      imageURL: imageURL || '',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('FoodStalls').add(newStall);
    const stallID = docRef.id;

    // Redundantly store stallID inside document as per "Stall ID Strategy"
    await docRef.update({ stallID });

    return { stallID, ...newStall };
  }

  /**
   * Update an existing stall
   * @param {string} stallID
   * @param {Object} updateData
   */
  async updateStall(stallID, { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL }) {
    if (!stallID) throw new Error('stallID is required');

    const stallRef = db.collection('FoodStalls').doc(stallID);
    const doc = await stallRef.get();
    if (!doc.exists) throw new Error('Stall not found');

    const updatePayload = {};

    if (stallName !== undefined) updatePayload.stallName = stallName;
    if (cuisineType !== undefined) updatePayload.cuisineType = cuisineType;
    if (isHalal !== undefined) updatePayload.isHalal = Boolean(isHalal);
    if (latitude !== undefined) updatePayload.latitude = Number(latitude);
    if (longitude !== undefined) updatePayload.longitude = Number(longitude);
    if (description !== undefined) updatePayload.description = description;
    if (operatingHours !== undefined) updatePayload.operatingHours = operatingHours;
    if (imageURL !== undefined) updatePayload.imageURL = imageURL;

    await stallRef.update(updatePayload);
    return true;
  }

  /**
   * Delete a stall by stallID
   * @param {string} stallID
   */
  async deleteStall(stallID) {
    if (!stallID) throw new Error('stallID is required');

    const stallRef = db.collection('FoodStalls').doc(stallID);
    const doc = await stallRef.get();
    if (!doc.exists) throw new Error('Stall not found');

    await stallRef.delete();
    return true;
  }
}

module.exports = new StallService();
