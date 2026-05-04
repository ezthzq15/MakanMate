const { db, FieldValue } = require('../config/firebase');

class MenuEngagementService {
  async toggleLike(userId, menuId) {
    const likeRef = db.collection('menuLikes').doc(`${userId}_${menuId}`);
    const likeDoc = await likeRef.get();
    const menuRef = db.collection('menu').doc(menuId);
    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      throw new Error(`Menu item with ID ${menuId} not found.`);
    }

    if (likeDoc.exists) {
      // Unlike
      await likeRef.delete();
      await menuRef.update({
        likes: FieldValue.increment(-1)
      });
      return { liked: false };
    } else {
      // Like
      const menuData = menuDoc.data();
      await likeRef.set({
        userId,
        menuId,
        stallId: menuData.stallID, // Added stall reference for easier indexing
        timestamp: new Date().toISOString()
      });
      await menuRef.update({
        likes: FieldValue.increment(1)
      });
      return { liked: true };
    }
  }

  async isLiked(userId, menuId) {
    if (!userId) return false;
    const likeRef = db.collection('menuLikes').doc(`${userId}_${menuId}`);
    const likeDoc = await likeRef.get();
    return likeDoc.exists;
  }
}

module.exports = new MenuEngagementService();
