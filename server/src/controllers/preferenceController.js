const preferenceService = require('../services/preferenceService');

/**
 * UC004: Set/Update User Preference
 */
const getMyPreferences = async (req, res) => {
  try {
    const userId = req.user.userID;
    const preference = await preferenceService.getPreferences(userId);

    if (!preference) {
      return res.status(200).json({
        cuisines: [],
        halal: false,
        spiceLevel: "MEDIUM",
        budgetRange: "RM10–20",
        isNew: true
      });
    }

    return res.status(200).json(preference);
  } catch (error) {
    console.error('[GET My Preferences Error]:', error);
    return res.status(500).json({ error: 'Internal server error fetching preferences' });
  }
};

const getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const preference = await preferenceService.getPreferences(userId);

    // If not found, return default empty structure to help frontend
    if (!preference) {
      return res.status(200).json({
        cuisines: [],
        halal: false,
        spiceLevel: "MEDIUM",
        budgetRange: "RM10–20",
        isNew: true
      });
    }

    return res.status(200).json(preference);
  } catch (error) {
    console.error('[GET Preferences Error]:', error);
    return res.status(500).json({ error: 'Internal server error fetching preferences' });
  }
};

const savePreferences = async (req, res) => {
  try {
    const { userId, cuisines, halal, spiceLevel, budgetRange } = req.body;

    // Validation per UC004
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!cuisines || !Array.isArray(cuisines) || cuisines.length === 0) {
      return res.status(400).json({ error: 'Please select at least one cuisine type.' });
    }

    const validSpice = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validSpice.includes(spiceLevel)) {
      return res.status(400).json({ error: 'Invalid spice level selection.' });
    }

    const validBudget = ['RM5–10', 'RM10–20', 'RM20–30', 'RM30+'];
    if (!validBudget.includes(budgetRange)) {
      return res.status(400).json({ error: 'Invalid budget range selection.' });
    }

    const preferenceData = {
      userId,
      cuisines,
      halal: halal === true || halal === 'true',
      spiceLevel,
      budgetRange
    };

    const preferenceID = await preferenceService.savePreferences(userId, preferenceData);

    return res.status(200).json({ 
      message: 'Preferences updated successfully',
      preferenceID 
    });
  } catch (error) {
    console.error('[SAVE Preferences Error]:', error);
    return res.status(500).json({ error: error.message || 'Internal server error saving preferences' });
  }
};

module.exports = {
  getMyPreferences,
  getPreferences,
  savePreferences
};
