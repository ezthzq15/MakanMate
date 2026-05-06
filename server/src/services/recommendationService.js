const { db } = require('../config/firebase');
const preferenceService = require('./preferenceService');
const bookmarkService = require('./bookmarkService');
const { calculateDistance } = require('../utils/distance');

/**
 * Service: UC005 Recommendation Engine (Unified & Optimized)
 */
class RecommendationService {
  async getRecommendations(userId, page = 1, limit = 12, userLocation = null) {
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
                               prefCuisines.some(c => stallCuisines.includes(c));
        
        // Strict Preference Filters
        if (preferences.halal && !stall.halal) return null;
        if (prefCuisines.length > 0 && !hasCuisineMatch) return null;

        // Scoring: Weighted towards Preference Match
        if (hasCuisineMatch) score += 100;
        
        // Flexible matching for Spice and Budget
        if (preferences.spiceLevel && stall.spiceLevel && 
            preferences.spiceLevel.toLowerCase() === stall.spiceLevel.toLowerCase()) {
          score += 30;
        }
        if (preferences.budgetRange && stall.priceRange && 
            preferences.budgetRange.toLowerCase() === stall.priceRange.toLowerCase()) {
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

    // 2. Final Sorting & Pagination
    scoredStalls.sort((a, b) => b.recommendationScore - a.recommendationScore);

    const total = scoredStalls.length;
    const start = (page - 1) * limit;
    let paginatedStalls = scoredStalls.slice(start, start + limit);

    // 3. Add Bookmark Status (Efficiency: only for the results being shown)
    if (userId) {
      paginatedStalls = await Promise.all(paginatedStalls.map(async s => {
        const isSaved = await bookmarkService.isBookmarked(userId, s.id);
        return { ...s, isSaved };
      }));
    }

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
      cuisine: Array.isArray(data.cuisineType) ? data.cuisineType : [data.cuisineType || 'General'],
      halal: data.isHalal === true,
      spiceLevel: data.spiceLevel || 'Medium',
      priceRange: data.budgetRange || 'RM5-10',
      location: {
        lat: parseFloat(data.latitude) || 0,
        lng: parseFloat(data.longitude) || 0
      },
      imageURL: data.imageURL || null
    };
  }
}

module.exports = new RecommendationService();
