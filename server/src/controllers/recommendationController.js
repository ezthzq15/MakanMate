const recommendationService = require('../services/recommendationService');

/**
 * Controller for Personalized Recommendations (UC005)
 */
const getRecommendations = async (req, res) => {
  try {
    const { page, limit, lat, lng } = req.query;
    const userID = req.user?.userID || null;

    const userLocation = lat && lng ? {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    } : null;

    const results = await recommendationService.getRecommendations(
      userID,
      parseInt(page) || 1,
      parseInt(limit) || 12,
      userLocation
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error('[Recommendations Error]:', error);
    return res.status(500).json({ error: 'Internal server error fetching recommendations' });
  }
};

module.exports = {
  getRecommendations
};
