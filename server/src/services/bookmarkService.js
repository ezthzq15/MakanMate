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
   * Get a Set of all stall IDs bookmarked by a user — single Firestore query.
   * Use this instead of calling isBookmarked() per stall (N+1 problem).
   */
  async getUserBookmarkedIds(userId) {
    if (!userId) return new Set();
    const snapshot = await db.collection('Bookmarks')
      .where('userId', '==', userId)
      .get();
    return new Set(snapshot.docs.map(d => d.data().stallId));
  }

  /**
   * Get all bookmarked stalls for a user (Stall IDs only)
   */
  async getUserBookmarks(userId) {
    const snapshot = await db.collection('Bookmarks')
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map(doc => doc.data().stallId);
  }

  /**
   * Get all bookmarked stalls with full details for a user
   */
  async getUserFullBookmarks(userId) {
    const bookmarkSnapshot = await db.collection('Bookmarks')
      .where('userId', '==', userId)
      .get();

    if (bookmarkSnapshot.empty) return [];

    const stallIds = bookmarkSnapshot.docs.map(doc => doc.data().stallId);
    
    // Fetch stall details in chunks (Firebase limit is 10 for 'in' queries, but we can just fetch all and filter or fetch individually)
    // For simplicity and to avoid complex chunking for now, we'll fetch them individually or use a bulk fetch if IDs are few.
    const stallPromises = stallIds.map(async id => {
      const doc = await db.collection('FoodStalls').doc(id).get();
      if (doc.exists) {
        return this._normalizeStall(doc.id, doc.data());
      }
      return null;
    });

    const stalls = await Promise.all(stallPromises);
    
    // Fetch Real-time Price Range from Menu in batches of 30 to prevent N+1 queries
    const activeStalls = stalls.filter(s => s !== null);
    const stallIDs = activeStalls.map(s => s.id);
    const menuItemsByStall = {};

    if (stallIDs.length > 0) {
      const chunks = [];
      for (let i = 0; i < stallIDs.length; i += 30) {
        chunks.push(stallIDs.slice(i, i + 30));
      }

      const menuSnapshots = await Promise.all(
        chunks.map(chunk => db.collection('menu').where('stallID', 'in', chunk).get())
      );

      menuSnapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const stallID = data.stallID;
          if (!menuItemsByStall[stallID]) {
            menuItemsByStall[stallID] = [];
          }
          menuItemsByStall[stallID].push(parseFloat(data.menuPrice) || 0);
        });
      });
    }

    const populatedStalls = activeStalls.map(s => {
      let priceRange = s.priceRange;
      const prices = (menuItemsByStall[s.id] || []).filter(p => p > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        priceRange = min === max ? `RM${min.toFixed(2)}` : `RM${min.toFixed(2)} - RM${max.toFixed(2)}`;
      }
      return { ...s, isSaved: true, priceRange };
    });
    
    return populatedStalls;
  }

  /**
   * Helper: Normalize Firestore stall to Unified API Structure (Replicated from SearchService)
   */
  _normalizeStall(id, data) {
    return {
      id,
      name: data.stallName || 'Unnamed Stall',
      rating: parseFloat(data.rating) || 0,
      cuisine: Array.isArray(data.cuisineType) ? data.cuisineType : [data.cuisineType || 'General'],
      halal: data.isHalal === true,
      spiceLevel: data.spiceLevel || 'Medium',
      priceRange: data.budgetRange || 'RM5-10',
      location: {
        lat: parseFloat(data.latitude) || 0,
        lng: parseFloat(data.longitude) || 0
      },
      imageURL: data.imageURL || null,
      description: data.description || '',
      operatingHours: data.operatingHours || '',
      operatingDays: data.operatingDays || '',
      specialHours: data.specialHours || ''
    };
  }
}

module.exports = new BookmarkService();
