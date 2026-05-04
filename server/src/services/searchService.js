const { db } = require('../config/firebase');
const { calculateDistance } = require('../utils/distance');
const bookmarkService = require('./bookmarkService');

/**
 * Service: UC006 Search Food Stall (Unified Structure)
 */
class SearchService {
  async searchStalls({ searchQuery, cuisines, halal, budget, spice, sort, page, limit, userLocation, userId }) {
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
      stalls = stalls.filter(s => cuisines.some(c => s.cuisine.includes(c)));
    }

    if (halal) {
      stalls = stalls.filter(s => s.halal === true);
    }

    if (budget) {
      stalls = stalls.filter(s => s.priceRange === budget);
    }

    if (spice) {
      stalls = stalls.filter(s => s.spiceLevel === spice);
    }

    // 3. Distance & Scoring
    stalls = stalls.map(s => {
      const distance = userLocation 
        ? calculateDistance(userLocation.lat, userLocation.lng, s.location.lat, s.location.lng) 
        : null;
      return { ...s, distance };
    });

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

    // 5. Bookmark Check (If User Logged In)
    if (userId) {
      stalls = await Promise.all(stalls.map(async s => {
        const isSaved = await bookmarkService.isBookmarked(userId, s.id);
        return { ...s, isSaved };
      }));
    }

    // 6. Pagination
    const total = stalls.length;
    const start = (page - 1) * limit;
    
    return {
      stalls: stalls.slice(start, start + limit),
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
      cuisine: Array.isArray(data.cuisineType) ? data.cuisineType : [data.cuisineType || 'General'],
      halal: data.isHalal === true,
      spiceLevel: data.spiceLevel || 'Medium',
      priceRange: data.budgetRange || 'RM5-10', // Consistent with budgetRange in DB
      location: {
        lat: parseFloat(data.latitude) || 0,
        lng: parseFloat(data.longitude) || 0
      },
      imageURL: data.imageURL || null,
      description: data.description || '',
      operatingHours: data.operatingHours || ''
    };
  }
}

module.exports = new SearchService();
