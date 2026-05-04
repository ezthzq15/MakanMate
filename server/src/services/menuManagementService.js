const { db } = require('../config/firebase');
const Menu = require('../models/Menu');

class MenuManagementService {
  async getMenuByStall(stallID) {
    const snapshot = await db.collection('menu')
      .where('stallID', '==', stallID)
      .get();
    
    return snapshot.docs.map(doc => Menu.fromFirestore(doc));
  }

  async addMenuItem(itemData) {
    const firestoreData = Menu.toFirestore(itemData);
    const docRef = await db.collection('menu').add(firestoreData);
    return { menuID: docRef.id, ...firestoreData };
  }

  async updateMenuItem(menuID, updateData) {
    const menuRef = db.collection('menu').doc(menuID);
    const doc = await menuRef.get();
    if (!doc.exists) throw new Error('Item not found');

    const firestoreData = Menu.toFirestore({ ...doc.data(), ...updateData });
    // Remove menuID and createdDate from update if they exist
    delete firestoreData.createdDate; 

    await menuRef.update(firestoreData);
    return true;
  }

  async deleteMenuItem(menuID) {
    const menuRef = db.collection('menu').doc(menuID);
    const doc = await menuRef.get();
    if (!doc.exists) throw new Error('Item not found');
    await menuRef.delete();
    return true;
  }
}

module.exports = new MenuManagementService();
