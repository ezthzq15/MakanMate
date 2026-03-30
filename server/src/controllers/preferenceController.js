const preferenceService = require('../services/preferenceService');

/**
 * Handle GET /profile/preference/:userID
 */
const getPreferences = async (req, res) => {
  try {
    const { userID } = req.params;

    // Optional: Add authorization check if req.user.userID !== userID
    // if (req.user.userID !== userID) {
    //   return res.status(403).json({ error: 'Unauthorized to view these preferences' });
    // }

    const preference = await preferenceService.getPreferences(userID);

    if (!preference) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    return res.status(200).json(preference);
  } catch (error) {
    console.error('getPreferences Error:', error);
    return res.status(500).json({ error: 'Internal server error fetching preferences' });
  }
};

/**
 * Handle PUT /profile/preference/update
 * Body: { userID, cuisineType, isHalal, spicyLevel, budgetAmount, ... }
 */
const savePreferences = async (req, res) => {
  try {
    const { userID, cuisineType, isHalal, spicyLevel, budgetAmount, preferredDistance, dietaryRestrictions, allergyInfo } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID is required' });
    }

    if (!cuisineType || !Array.isArray(cuisineType) || cuisineType.length === 0) {
      return res.status(400).json({ error: 'At least one cuisineType must be selected' });
    }

    const validSpicyLevels = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validSpicyLevels.includes(spicyLevel)) {
      return res.status(400).json({ error: 'spicyLevel must be one of LOW, MEDIUM, or HIGH' });
    }

    const budget = Number(budgetAmount);
    if (![1, 2, 3, 4].includes(budget)) {
      return res.status(400).json({ error: 'budgetAmount must be between 1 and 4' });
    }

    const preferenceData = {
      cuisineType,
      isHalal: isHalal === true || isHalal === 'true',
      spicyLevel,
      budgetAmount: budget,
      preferredDistance: preferredDistance || null,
      dietaryRestrictions: dietaryRestrictions || null,
      allergyInfo: allergyInfo || null
    };

    const preferenceID = await preferenceService.savePreferences(userID, preferenceData);

    return res.status(200).json({ 
      message: 'Preferences updated successfully',
      preferenceID 
    });
  } catch (error) {
    console.error('savePreferences Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  getPreferences,
  savePreferences
};
