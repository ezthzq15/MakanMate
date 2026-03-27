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
    const { userID, ...preferenceData } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID is required' });
    }

    // Optional: Add authorization check
    // if (req.user.userID !== userID) {
    //   return res.status(403).json({ error: 'Unauthorized to update these preferences' });
    // }

    await preferenceService.savePreferences(userID, preferenceData);

    return res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('savePreferences Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  getPreferences,
  savePreferences
};
