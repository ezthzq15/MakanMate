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
      userLocation,
      userId: req.user?.userID
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error('[Search Stalls Error]:', error);
    return res.status(500).json({ error: 'Internal server error during search' });
  }
};

const { db } = require('../config/firebase');
const bookmarkService = require('../services/bookmarkService');

const Menu = require('../models/Menu');

/**
 * Public Controller: Get Detailed Stall Info (FR09)
 */
const getStallById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userID;

    // 1. Fetch Stall Metadata
    const stallDoc = await db.collection('FoodStalls').doc(id).get();
    if (!stallDoc.exists) {
      return res.status(404).json({ error: 'Stall not found' });
    }
    const stallData = { id: stallDoc.id, ...stallDoc.data() };

    // 2. Fetch Menu Items (Unified with MenuModel)
    const menuSnapshot = await db.collection('menu')
      .where('stallID', '==', id)
      .get();
    
    const menuEngagementService = require('../services/menuEngagementService');
    const menuItems = await Promise.all(menuSnapshot.docs.map(async doc => {
      const item = Menu.fromFirestore(doc);
      item.isLiked = userId ? await menuEngagementService.isLiked(userId, item.menuID) : false;
      return item;
    }));

    // 3. Check Bookmark Status
    const isSaved = userId ? await bookmarkService.isBookmarked(userId, id) : false;

    return res.status(200).json({
      ...stallData,
      menu: menuItems,
      isSaved
    });
  } catch (error) {
    console.error('[Get Stall Detail Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  searchStalls,
  getStallById
};
