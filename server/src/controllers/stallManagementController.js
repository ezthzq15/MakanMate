const stallManagementService = require('../services/stallManagementService');

const getAllStalls = async (req, res) => {
  try {
    const stalls = await stallManagementService.getAllStalls();
    return res.status(200).json({ stalls });
  } catch (error) {
    console.error('getAllStalls Error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const createStall = async (req, res) => {
  try {
    const { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL, managerID } = req.body;

    if (!stallName || !cuisineType) {
      return res.status(400).json({ error: 'stallName and cuisineType are required' });
    }

    if (latitude !== undefined && longitude !== undefined) {
        const lat = Number(latitude);
        const long = Number(longitude);
        if (lat < -90 || lat > 90 || long < -180 || long > 180) {
          return res.status(400).json({ error: 'Latitude must be between -90 and 90. Longitude must be between -180 and 180.' });
        }
    }

    const newStall = await stallManagementService.createStall({
      stallName,
      cuisineType,
      isHalal: isHalal === true || isHalal === 'true',
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      description: description || '',
      operatingHours: operatingHours || '',
      imageURL: imageURL || '',
      managerID: managerID || null
    });

    return res.status(201).json({ message: 'Stall created successfully', stall: newStall });
  } catch (error) {
    console.error('createStall Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateStall = async (req, res) => {
  try {
    const { stallID, stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL, managerID } = req.body;
    if (!stallID) return res.status(400).json({ error: 'stallID is required for updates' });

    if (latitude !== undefined) {
      const lat = Number(latitude);
      if (lat < -90 || lat > 90) return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    if (longitude !== undefined) {
      const long = Number(longitude);
      if (long < -180 || long > 180) return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }

    await stallManagementService.updateStall(stallID, { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL, managerID });
    return res.status(200).json({ message: 'Stall updated successfully' });
  } catch (error) {
    console.error('updateStall Error:', error.message);
    const status = error.message === 'Stall not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const deleteStall = async (req, res) => {
  try {
    const { stallID } = req.params;
    if (!stallID) return res.status(400).json({ error: 'stallID is required' });

    await stallManagementService.deleteStall(stallID);
    return res.status(200).json({ message: 'Stall deleted successfully' });
  } catch (error) {
    console.error('deleteStall Error:', error.message);
    const status = error.message === 'Stall not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const getMyStall = async (req, res) => {
  try {
    const managerID = req.user.userID;
    const stall = await stallManagementService.getStallByManager(managerID);
    
    if (!stall) {
      return res.status(404).json({ message: 'No stall assigned yet' });
    }

    return res.status(200).json({ stall });
  } catch (error) {
    console.error('getMyStall Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateMyStall = async (req, res) => {
  try {
    const managerID = req.user.userID;
    const stall = await stallManagementService.getStallByManager(managerID);

    if (!stall) {
      return res.status(404).json({ error: 'No stall assigned to you' });
    }

    const { stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL } = req.body;
    
    // Safety: prevent manager from changing managerID
    await stallManagementService.updateStall(stall.stallID, { 
      stallName, cuisineType, isHalal, latitude, longitude, description, operatingHours, imageURL 
    });

    return res.status(200).json({ message: 'Your stall was updated successfully' });
  } catch (error) {
    console.error('updateMyStall Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllStalls, createStall, updateStall, deleteStall, getMyStall, updateMyStall };
