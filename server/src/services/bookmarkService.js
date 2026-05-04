const { db } = require('../config/firebase');

/**
 * Service: UC007 Bookmark Management
 */
class BookmarkService {
  /**
   * Toggle bookmark state for a user/stall pair
   */
  async toggleBookmark(userId, stallId) {
    if (!userId || !stallId) throw new Error('Missing userId or stallId');

    const bookmarkRef = db.collection('Bookmarks')
      .where('userId', '==', userId)
      .where('stallId', '==', stallId);
    
    const snapshot = await bookmarkRef.get();

    if (snapshot.empty) {
      // Add bookmark
      await db.collection('Bookmarks').add({
        userId,
        stallId,
        createdAt: new Date().toISOString()
      });
      return { saved: true };
    } else {
      // Remove bookmark
      const docId = snapshot.docs[0].id;
      await db.collection('Bookmarks').doc(docId).delete();
      return { saved: false };
    }
  }

  /**
   * Check if a stall is bookmarked by a user
   */
  async isBookmarked(userId, stallId) {
    if (!userId || !stallId) return false;

    const snapshot = await db.collection('Bookmarks')
      .where('userId', '==', userId)
      .where('stallId', '==', stallId)
      .get();

    return !snapshot.empty;
  }

  /**
   * Get all bookmarked stalls for a user
   */
  async getUserBookmarks(userId) {
    const snapshot = await db.collection('Bookmarks')
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map(doc => doc.data().stallId);
  }
}

module.exports = new BookmarkService();
