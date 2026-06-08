const { db } = require('../config/firebase');
const { calculateDistance } = require('../utils/distance');
const bookmarkService = require('./bookmarkService');
const { matchBudget } = require('../utils/budgetMatcher');

/**
 * Service: UC006 Search Food Stall (Unified Structure)
 */
class SearchService {
  async searchStalls({ searchQuery, cuisines, halal, halalTags, budget, spice, sort, page, limit, userLocation, userId, radius, skipMenu }) {
    const snapshot = await db.collection('FoodStalls').get();
    let stalls = snapshot.docs.map(doc => this._normalizeStall(doc.id, doc.data()));

    // 1. Keyword Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      stalls = stalls.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.cuisine.some(c => c.toLowerCase().includes(q))
      );
    }

    // 2. Filters
    if (cuisines && cuisines.length > 0) {
      stalls = stalls.filter(s => cuisines.some(c => s.cuisine && s.cuisine.some(sc => sc.toLowerCase().includes(c.toLowerCase()))));
    }

    // Multi-tag halal/dietary filter
    const tags = Array.isArray(halalTags)
      ? halalTags
      : (halalTags ? halalTags.split(',').map(t => t.trim()).filter(Boolean) : []);

    // Legacy single-value support
    const effectiveTags = tags.length > 0 ? tags : (halal === 'yes' ? ['halal'] : []);

    if (effectiveTags.length > 0 && !effectiveTags.includes('all')) {
      stalls = stalls.filter(s => {
        return effectiveTags.some(tag => {
          if (tag === 'halal')          return s.halal === true;
          if (tag === 'muslimFriendly') return s.isMuslimFriendly === true;
          if (tag === 'nonHalal')       return s.halal !== true && s.isMuslimFriendly !== true;
          return true;
        });
      });
    }

    if (budget && budget !== 'all') {
      stalls = stalls.filter(s => matchBudget(s.priceRange, budget));
    }

    if (spice && spice !== 'all') {
      stalls = stalls.filter(s => s.spiceLevel && s.spiceLevel.toLowerCase() === spice.toLowerCase());
    }

    // 3. Distance & Scoring
    stalls = stalls.map(s => {
      const distance = userLocation 
        ? calculateDistance(userLocation.lat, userLocation.lng, s.location.lat, s.location.lng) 
        : null;
      return { ...s, distance };
    });

    // 3.5 Filter by Radius (frontend sends meters, distance is in km)
    let effectiveRadius = radius;
    if (!userId && userLocation) {
      // Unauthenticated users are not allowed to view more than 2km radius
      effectiveRadius = radius ? Math.min(radius, 2000) : 2000;
    }

    if (effectiveRadius && userLocation) {
      const radiusInKm = effectiveRadius / 1000;
      stalls = stalls.filter(s => s.distance <= radiusInKm);
    }

    // 4. Sorting
    switch (sort) {
      case 'rating':
        stalls.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        if (userLocation) stalls.sort((a, b) => a.distance - b.distance);
        break;
      default:
        stalls.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // 5. Bookmark Check (single query for all bookmarks, then O(1) set lookup — no N+1)
    const bookmarkedIds = userId
      ? await bookmarkService.getUserBookmarkedIds(userId)
      : new Set();

    stalls = stalls.map(s => ({ ...s, isSaved: bookmarkedIds.has(s.id) }));

    // 6. Pagination
    const total = stalls.length;
    const start = (page - 1) * limit;
    let paginatedStalls = stalls.slice(start, start + limit);

    // 7. Fetch Real-time Price Range from Menu in batches of 30 to prevent N+1 queries
    if (!skipMenu) {
      const stallIDs = paginatedStalls.map(s => s.id);
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

      paginatedStalls = paginatedStalls.map(s => {
        let priceRange = s.priceRange;
        const prices = (menuItemsByStall[s.id] || []).filter(p => p > 0);
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          priceRange = min === max ? `RM${min.toFixed(2)}` : `RM${min.toFixed(2)} - RM${max.toFixed(2)}`;
        }
        return { ...s, priceRange };
      });
    }
    
    return {
      stalls: paginatedStalls,
      total,
      page,
      limit
    };
  }

  /**
   * Helper: Normalize Firestore stall to Unified API Structure
   */
  _normalizeStall(id, data) {
    return {
      id,
      name: data.stallName || 'Unnamed Stall',
      rating: parseFloat(data.rating) || 0,
      reviewCount: parseInt(data.reviewCount) || 0,
      cuisine: Array.isArray(data.cuisineType) ? data.cuisineType : [data.cuisineType || 'General'],
      halal: data.isHalal === true,
      isMuslimFriendly: data.isMuslimFriendly === true,
      spiceLevel: data.spiceLevel || 'Medium',
      priceRange: data.budgetRange || 'RM5-10', // Consistent with budgetRange in DB
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

module.exports = new SearchService();
