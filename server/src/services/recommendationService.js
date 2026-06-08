const { db } = require('../config/firebase');
const preferenceService = require('./preferenceService');
const bookmarkService = require('./bookmarkService');
const { calculateDistance } = require('../utils/distance');
const { matchBudget } = require('../utils/budgetMatcher');

/**
 * Service: UC005 Recommendation Engine (Unified & Optimized)
 */
class RecommendationService {
  async getRecommendations({ userId, page = 1, limit = 12, userLocation = null, searchQuery, cuisines, halal, budget, spice, cuisinesQueryProvided, halalQueryProvided }) {
    const isGuest = !userId;
    let preferences = null;

    if (!isGuest) {
      preferences = await preferenceService.getPreferences(userId);
    }

    const snapshot = await db.collection('FoodStalls').get();
    let stalls = snapshot.docs.map(doc => this._normalizeStall(doc.id, doc.data()));

    // 1. Core Logic: Guest vs Authenticated
    let scoredStalls = stalls.map(stall => {
      let score = 0;
      let distance = null;

      // Calculate Distance (Vital for both, but critical for Guest)
      if (userLocation && stall.location.lat && stall.location.lng) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, stall.location.lat, stall.location.lng);
      }

      // --- CASE A: GUEST (Proximity Focus) ---
      if (isGuest) {
        // Strict distance filtering for Guests (e.g. 2km)
        if (userLocation && distance > 2) return null; 
        
        // Scoring: Heavily weighted towards proximity
        score += (5 - (distance || 5)) * 30; 
        score += (stall.rating || 0) * 5;
        
        return { ...stall, distance, recommendationScore: score };
      }

      // --- CASE B: AUTHENTICATED (Preference Focus) ---
      if (preferences) {
        const prefCuisines = (preferences.cuisines || []).map(c => c.toLowerCase());
        const stallCuisines = stall.cuisine.map(c => c.toLowerCase());
        
        const hasCuisineMatch = prefCuisines.length === 0 || 
                               prefCuisines.some(c => stallCuisines.some(sc => sc.includes(c)));
        
        // Strict Preference Filters (skipped if query parameters are provided by frontend)
        const applyStrictHalal = preferences.halal && !halalQueryProvided;
        const applyStrictCuisine = prefCuisines.length > 0 && !cuisinesQueryProvided;

        if (applyStrictHalal && !stall.halal) return null;
        if (applyStrictCuisine && !hasCuisineMatch) return null;

        // Scoring: Weighted towards Preference Match
        if (hasCuisineMatch) score += 100;
        
        // Flexible matching for Spice and Budget
        if (preferences.spiceLevel && stall.spiceLevel && 
            preferences.spiceLevel.toLowerCase() === stall.spiceLevel.toLowerCase()) {
          score += 30;
        }
        if (preferences.budgetRange && stall.priceRange && 
            matchBudget(stall.priceRange, preferences.budgetRange)) {
          score += 40;
        }
        
        // Base Weights
        score += (stall.rating || 0) * 10;
        
        // Secondary Distance weight for Auth (wider exploration)
        if (distance) {
          if (distance < 2) score += 40;
          else if (distance < 5) score += 20;
        }

        return { ...stall, distance, recommendationScore: score };
      }

      // Fallback for Auth User with no preferences set yet
      score += (stall.rating || 0) * 10;
      return { ...stall, distance, recommendationScore: score };
    })
    .filter(s => s !== null);

    // 1.5 Extra Search and Filter from query params
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      scoredStalls = scoredStalls.filter(s => 
        (s.name && s.name.toLowerCase().includes(query)) || 
        (s.cuisine && s.cuisine.some(c => c.toLowerCase().includes(query)))
      );
    }

    if (cuisines && cuisines.length > 0) {
      scoredStalls = scoredStalls.filter(s => s.cuisine && cuisines.some(c => s.cuisine.some(sc => sc.toLowerCase().includes(c.toLowerCase()))));
    }

    if (halal) {
      scoredStalls = scoredStalls.filter(s => s.halal === true);
    }

    if (budget && budget !== 'all') {
      scoredStalls = scoredStalls.filter(s => matchBudget(s.priceRange, budget));
    }

    if (spice && spice !== 'all') {
      scoredStalls = scoredStalls.filter(s => s.spiceLevel && s.spiceLevel.toLowerCase() === spice.toLowerCase());
    }

    // 2. Final Sorting & Pagination
    scoredStalls.sort((a, b) => b.recommendationScore - a.recommendationScore);

    const total = scoredStalls.length;
    const start = (page - 1) * limit;
    let paginatedStalls = scoredStalls.slice(start, start + limit);

    // 3. Add Bookmark Status and Fetch Real-time Price Range in batches of 30 to prevent N+1 queries
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

    // Fetch all bookmarks in ONE query — no N+1 per stall
    const bookmarkedIds = userId
      ? await bookmarkService.getUserBookmarkedIds(userId)
      : new Set();

    paginatedStalls = paginatedStalls.map(s => {
      let priceRange = s.priceRange;
      const prices = (menuItemsByStall[s.id] || []).filter(p => p > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        priceRange = min === max ? `RM${min.toFixed(2)}` : `RM${min.toFixed(2)} - RM${max.toFixed(2)}`;
      }
      return { ...s, isSaved: bookmarkedIds.has(s.id), priceRange };
    });

    return {
      stalls: paginatedStalls,
      total,
      page,
      limit,
      isGuest
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

module.exports = new RecommendationService();
