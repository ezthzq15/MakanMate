const stallService = require('../services/stallService');

/**
 * UC009: Manage Food Stalls — Admin Controller
 * Variables strictly from class diagram. 
 * Data mapping enforced: { stallID, stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL }
 */

/**
 * GET /admin/stalls
 * Retrieve all food stalls
 */
const { 
  getAllStalls, 
  createStall, 
  updateStall, 
  deleteStall 
} = {
  getAllStalls: async (req, res) => {
    try {
      const stalls = await stallService.getAllStalls();
      return res.status(200).json({ stalls });
    } catch (error) {
      console.error('getAllStalls Error:', error.message);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  },

  createStall: async (req, res) => {
    try {
      const { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL } = req.body;

      // Strict Validation Rule: stallName, cuisineType are required
      if (!stallName || !cuisineType) {
        return res.status(400).json({ error: 'stallName and cuisineType are required' });
      }

      // Coordinate Range Validation: latitude (-90 to 90), longitude (-180 to 180)
      if (latitude !== undefined && longitude !== undefined) {
          const lat = Number(latitude);
          const long = Number(longitude);
          if (lat < -90 || lat > 90 || long < -180 || long > 180) {
            return res.status(400).json({ error: 'Latitude must be between -90 and 90. Longitude must be between -180 and 180.' });
          }
      }

      // Create stall with strict mapping
      const newStall = await stallService.createStall({
        stallName,
        cuisineType,
        isHalal: isHalal === true || isHalal === 'true',
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        description: description || '',
        operatingHours: operatingHours || '',
        imageURL: imageURL || ''
      });

      return res.status(201).json({ message: 'Stall created successfully', stall: newStall });
    } catch (error) {
      console.error('createStall Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  updateStall: async (req, res) => {
    try {
      const { stallID, stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL } = req.body;
      if (!stallID) return res.status(400).json({ error: 'stallID is required for updates' });

      // Range checks for latitude/longitude if provided
      if (latitude !== undefined) {
        const lat = Number(latitude);
        if (lat < -90 || lat > 90) return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
      }
      if (longitude !== undefined) {
        const long = Number(longitude);
        if (long < -180 || long > 180) return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
      }

      await stallService.updateStall(stallID, { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL });
      return res.status(200).json({ message: 'Stall updated successfully' });
    } catch (error) {
      console.error('updateStall Error:', error.message);
      const status = error.message === 'Stall not found' ? 404 : 500;
      return res.status(status).json({ error: error.message });
    }
  },

  deleteStall: async (req, res) => {
    try {
      const { stallID } = req.params;
      if (!stallID) return res.status(400).json({ error: 'stallID is required' });

      await stallService.deleteStall(stallID);
      return res.status(200).json({ message: 'Stall deleted successfully' });
    } catch (error) {
      console.error('deleteStall Error:', error.message);
      const status = error.message === 'Stall not found' ? 404 : 500;
      return res.status(status).json({ error: error.message });
    }
  }
};

module.exports = { getAllStalls, createStall, updateStall, deleteStall };
