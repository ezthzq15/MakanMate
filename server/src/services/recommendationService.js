const { db } = require('../config/firebase');
const preferenceService = require('./preferenceService');
const { calculateDistance } = require('../utils/distance');

/**
 * Service: UC005 Recommendation Engine
 */
class RecommendationService {
  async getRecommendations(userId, page = 1, limit = 12, userLocation = null) {
    const isGuest = !userId;
    let preferences = null;

    if (!isGuest) {
      preferences = await preferenceService.getPreferences(userId);
    }

    // 2. Fetch all stalls
    const snapshot = await db.collection('FoodStalls').get();
    let stalls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Score and Filter Stalls
    let scoredStalls = stalls.map(stall => {
      let score = 0;
      let distance = null;

      // A. Calculate Distance
      if (userLocation && stall.latitude && stall.longitude) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, stall.latitude, stall.longitude);
      }

      // B. Guest Mode: Strict distance filtering (e.g. 3km)
      if (isGuest) {
        if (userLocation && distance > 3) return null; // Filter out if too far
        score += (5 - (distance || 5)) * 20; // Prioritize closer stalls
        score += (stall.rating || 0) * 5;
        return { ...stall, recommendationScore: score, distance };
      }

      // C. Auth Mode: Preference-based
      if (preferences) {
        const stallCuisines = Array.isArray(stall.cuisineType) ? stall.cuisineType : [stall.cuisineType];
        const hasCuisineMatch = preferences.cuisines.length === 0 || 
                               preferences.cuisines.some(c => stallCuisines.includes(c));
        
        if (hasCuisineMatch) score += 100;
        else score -= 500;

        if (preferences.halal && !stall.isHalal) return null; // Strict halal

        if (preferences.spiceLevel === stall.spiceLevel) score += 30;
        if (preferences.budgetRange === stall.budgetRange) score += 40;
        score += (stall.rating || 0) * 10;
        
        if (distance) {
          if (distance < 2) score += 40;
          else if (distance < 5) score += 20;
        }

        return { ...stall, recommendationScore: score, distance, hasCuisineMatch };
      }

      // Fallback for Auth User with no preferences
      score += (stall.rating || 0) * 10;
      return { ...stall, recommendationScore: score, distance };
    })
    .filter(s => s !== null);

    // G. Auth-only: Final Cuisine Filter
    if (!isGuest && preferences?.cuisines.length > 0) {
      scoredStalls = scoredStalls.filter(s => s.hasCuisineMatch);
    }

    // 4. Sort by score
    scoredStalls.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // 5. Pagination
    const total = scoredStalls.length;
    const start = (page - 1) * limit;
    return {
      stalls: scoredStalls.slice(start, start + limit),
      total,
      page,
      limit,
      isGuest // Helpful for frontend logic
    };
  }

  async _getFallbackRecommendations(page, limit) {
    const snapshot = await db.collection('FoodStalls').get();
    const stalls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort in-memory to handle missing rating fields gracefully
    stalls.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    const total = stalls.length;
    const start = (page - 1) * limit;
    return {
      stalls: stalls.slice(start, start + limit),
      total,
      page,
      limit
    };
  }
}

module.exports = new RecommendationService();
