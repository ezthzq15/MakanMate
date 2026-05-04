const { db } = require('../config/firebase');
const { calculateDistance } = require('../utils/distance');

/**
 * Service: UC006 Search Food Stall
 */
class SearchService {
  async searchStalls({ searchQuery, cuisines, halal, budget, spice, sort, page, limit, userLocation }) {
    let query = db.collection('FoodStalls');

    // Fetch all stalls (for complex client-side filtering since Firestore has query limitations)
    // For a production app with thousands of stalls, we would use Algolia/ElasticSearch.
    const snapshot = await query.get();
    let stalls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 1. Keyword Search (Name or Cuisine)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      stalls = stalls.filter(s => 
        s.stallName?.toLowerCase().includes(q) || 
        s.cuisineType?.toLowerCase().includes(q)
      );
    }

    // 2. Filters
    if (cuisines && cuisines.length > 0) {
      stalls = stalls.filter(s => {
        const stallCuisines = Array.isArray(s.cuisineType) ? s.cuisineType : [s.cuisineType];
        return cuisines.some(c => stallCuisines.includes(c));
      });
    }

    if (halal) {
      stalls = stalls.filter(s => s.isHalal === true);
    }

    if (budget) {
      stalls = stalls.filter(s => s.budgetRange === budget);
    }

    if (spice) {
      stalls = stalls.filter(s => s.spiceLevel === spice);
    }

    // 3. Calculate Distances if location provided
    if (userLocation) {
      stalls = stalls.map(s => ({
        ...s,
        distance: calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude)
      }));
    }

    // 4. Sorting
    switch (sort) {
      case 'rating':
        stalls.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        if (userLocation) stalls.sort((a, b) => a.distance - b.distance);
        break;
      case 'recommended':
      default:
        // Default ranking: Combination of rating and "Top Pick" status
        stalls.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    // 5. Pagination
    const total = stalls.length;
    const start = (page - 1) * limit;
    const paginatedStalls = stalls.slice(start, start + limit);

    return {
      stalls: paginatedStalls,
      total,
      page,
      limit
    };
  }
}

module.exports = new SearchService();
