const { db } = require('../config/firebase');
const emailService = require('./emailService');

/**
 * Admin Service: CRUD for FoodStalls collection (UC009)
 * Variables strictly from class diagram: 
 * stallID, stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL
 */
class StallManagementService {
  /**
   * Fetch all stalls from Firestore
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
        isMuslimFriendly: data.isMuslimFriendly === true,
        latitude: Number(data.latitude) || 0,
        longitude: Number(data.longitude) || 0,
        description: data.description || '',
        operatingHours: data.operatingHours || '',
        imageURL: data.imageURL || '',
        managerID: data.managerID || null,
        halalCertURL: data.halalCertURL || ''
      };
    });
  }

  /**
   * Create a new stall
   */
  async createStall({ stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, imageURL, managerID }) {
    if (managerID) {
      const existingStall = await db.collection('FoodStalls')
        .where('managerID', '==', managerID)
        .limit(1)
        .get();
      if (!existingStall.empty) {
        throw new Error('This Stall Manager is already assigned to another stall');
      }
    }

    const newStall = {
      stallName,
      cuisineType,
      isHalal: Boolean(isHalal),
      isMuslimFriendly: Boolean(isMuslimFriendly),
      latitude: Number(latitude),
      longitude: Number(longitude),
      description: description || '',
      operatingHours: operatingHours || '',
      imageURL: imageURL || '',
      managerID: managerID || null,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('FoodStalls').add(newStall);
    const stallID = docRef.id;

    await docRef.update({ stallID });

    // If a manager is assigned at creation, notify them
    if (managerID) {
      this._notifyManagerAssignment(managerID, stallName);
    }

    return { stallID, ...newStall };
  }

  /**
   * Update an existing stall
   */
  async updateStall(stallID, { stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, imageURL, managerID, halalCertURL }) {
    if (!stallID) throw new Error('stallID is required');

    const stallRef = db.collection('FoodStalls').doc(stallID);
    const doc = await stallRef.get();
    if (!doc.exists) throw new Error('Stall not found');

    if (managerID !== undefined && managerID !== null && managerID !== doc.data().managerID) {
      const existingStall = await db.collection('FoodStalls')
        .where('managerID', '==', managerID)
        .limit(1)
        .get();
      if (!existingStall.empty) {
        throw new Error('This Stall Manager is already assigned to another stall');
      }
    }

    const updatePayload = {};

    if (stallName !== undefined) updatePayload.stallName = stallName;
    if (cuisineType !== undefined) updatePayload.cuisineType = cuisineType;
    if (isHalal !== undefined) updatePayload.isHalal = Boolean(isHalal);
    if (isMuslimFriendly !== undefined) updatePayload.isMuslimFriendly = Boolean(isMuslimFriendly);
    if (latitude !== undefined) updatePayload.latitude = Number(latitude);
    if (longitude !== undefined) updatePayload.longitude = Number(longitude);
    if (description !== undefined) updatePayload.description = description;
    if (operatingHours !== undefined) updatePayload.operatingHours = operatingHours;
    if (imageURL !== undefined) updatePayload.imageURL = imageURL;
    if (managerID !== undefined) updatePayload.managerID = managerID;
    if (halalCertURL !== undefined) updatePayload.halalCertURL = halalCertURL;

    await stallRef.update(updatePayload);

    // If manager was changed or assigned, notify them
    if (managerID !== undefined && managerID !== null && managerID !== doc.data().managerID) {
      this._notifyManagerAssignment(managerID, updatePayload.stallName || doc.data().stallName);
    }

    return true;
  }

  /**
   * Internal helper to notify manager of assignment
   */
  async _notifyManagerAssignment(managerID, stallName) {
    try {
      const userDoc = await db.collection('users').doc(managerID).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        await emailService.sendStallAssignment(userData.userEmail, userData.userName, stallName);
      }
    } catch (err) {
      console.error(`[Assignment Notification Error] ${err.message}`);
    }
  }

  /**
   * Delete a stall by stallID
   */
  async deleteStall(stallID) {
    if (!stallID) throw new Error('stallID is required');

    const stallRef = db.collection('FoodStalls').doc(stallID);
    const doc = await stallRef.get();
    if (!doc.exists) throw new Error('Stall not found');

    await stallRef.delete();
    return true;
  }

  /**
   * Get stall by Manager ID
   */
  async getStallByManager(managerID) {
    const snapshot = await db.collection('FoodStalls')
      .where('managerID', '==', managerID)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data();

    // Dynamically calculate total menu items
    const menuSnapshot = await db.collection('menu')
      .where('stallID', '==', doc.id)
      .get();
      
    const totalMenuItems = menuSnapshot.size;

    return {
      stallID: doc.id,
      ...data,
      totalMenuItems
    };
  }
}

module.exports = new StallManagementService();
