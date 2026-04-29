const { db } = require('../config/firebase');

class MenuManagementService {
  async getMenuByStall(stallID) {
    const snapshot = await db.collection('menu')
      .where('stallID', '==', stallID)
      .get();
    
    return snapshot.docs.map(doc => ({
      menuID: doc.id,
      ...doc.data()
    }));
  }

  async addMenuItem(itemData) {
    const docRef = await db.collection('menu').add({
      ...itemData,
      createdAt: new Date().toISOString()
    });
    return { menuID: docRef.id, ...itemData };
  }

  async updateMenuItem(menuID, updateData) {
    const menuRef = db.collection('menu').doc(menuID);
    const doc = await menuRef.get();
    if (!doc.exists) throw new Error('Item not found');

    const cleanData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) cleanData[key] = updateData[key];
    });

    await menuRef.update(cleanData);
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
