const searchService = require('../services/searchService');
const { parseFilters } = require('../utils/queryParser');

/**
 * Public Controller for Stall Discovery (UC006)
 */
const searchStalls = async (req, res) => {
  try {
    const filters = parseFilters(req.query);
    
    // Optional: Extract user location from query if provided
    const userLocation = req.query.lat && req.query.lng ? {
      lat: parseFloat(req.query.lat),
      lng: parseFloat(req.query.lng)
    } : null;

    const results = await searchService.searchStalls({
      ...filters,
      userLocation
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error('[Search Stalls Error]:', error);
    return res.status(500).json({ error: 'Internal server error during search' });
  }
};

module.exports = {
  searchStalls
};
