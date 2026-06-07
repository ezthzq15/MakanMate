const stallManagementService = require('../services/stallManagementService');
const { storage } = require('../config/firebase');
const path = require('path');

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
    const { stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, operatingDays, specialHours, imageURL, managerID } = req.body;

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
      isMuslimFriendly: isMuslimFriendly === true || isMuslimFriendly === 'true',
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      description: description || '',
      operatingHours: operatingHours || '',
      operatingDays: operatingDays || '',
      specialHours: specialHours || '',
      imageURL: imageURL || '',
      managerID: managerID || null
    });

    return res.status(201).json({ message: 'Stall created successfully', stall: newStall });
  } catch (error) {
    console.error('createStall Error:', error.message);
    const status = error.message.includes('already assigned') ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const updateStall = async (req, res) => {
  try {
    const { stallID, stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, operatingDays, specialHours, imageURL, managerID } = req.body;
    if (!stallID) return res.status(400).json({ error: 'stallID is required for updates' });

    if (latitude !== undefined) {
      const lat = Number(latitude);
      if (lat < -90 || lat > 90) return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    if (longitude !== undefined) {
      const long = Number(longitude);
      if (long < -180 || long > 180) return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }

    await stallManagementService.updateStall(stallID, { stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, operatingDays, specialHours, imageURL, managerID });
    return res.status(200).json({ message: 'Stall updated successfully' });
  } catch (error) {
    console.error('updateStall Error:', error.message);
    let status = 500;
    if (error.message === 'Stall not found') status = 404;
    else if (error.message.includes('already assigned')) status = 400;
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

    const { stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, operatingDays, specialHours, imageURL } = req.body;
    
    // Safety: prevent manager from changing managerID
    await stallManagementService.updateStall(stall.stallID, { 
      stallName, cuisineType, isHalal, isMuslimFriendly, latitude, longitude, description, operatingHours, operatingDays, specialHours, imageURL 
    });

    return res.status(200).json({ message: 'Your stall was updated successfully' });
  } catch (error) {
    console.error('updateMyStall Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const uploadHalalCert = async (req, res) => {
  try {
    const managerID = req.user.userID;
    const stall = await stallManagementService.getStallByManager(managerID);

    if (!stall) {
      return res.status(404).json({ error: 'No stall assigned to you' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!storage) {
      return res.status(500).json({ error: 'Firebase Storage is not configured' });
    }

    const ext = path.extname(req.file.originalname) || '.' + req.file.mimetype.split('/')[1];
    const sanitizedStallName = stall.stallName ? stall.stallName.replace(/[^a-zA-Z0-9 ]/g, '').trim() : 'Unknown Stall';
    const filename = `Stalls/${sanitizedStallName}/${stall.stallID}/Certificate/cert_${Date.now()}${ext}`;
    const file = storage.file(filename);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true
    });

    const halalCertURL = `https://storage.googleapis.com/${storage.name}/${filename}`;

    // Update the stall with the new URL
    await stallManagementService.updateStall(stall.stallID, {
      ...stall,
      halalCertURL
    });

    return res.status(200).json({ message: 'Certificate uploaded successfully', halalCertURL });
  } catch (error) {
    console.error('uploadHalalCert Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const uploadStallHeader = async (req, res) => {
  try {
    const managerID = req.user.userID;
    const stall = await stallManagementService.getStallByManager(managerID);

    if (!stall) {
      return res.status(404).json({ error: 'No stall assigned to you' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!storage) {
      return res.status(500).json({ error: 'Firebase Storage is not configured' });
    }

    const ext = path.extname(req.file.originalname) || '.' + req.file.mimetype.split('/')[1];
    const sanitizedStallName = stall.stallName ? stall.stallName.replace(/[^a-zA-Z0-9 ]/g, '').trim() : 'Unknown Stall';
    const filename = `Stalls/${sanitizedStallName}/${stall.stallID}/StallHeaders/header_${Date.now()}${ext}`;
    const file = storage.file(filename);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true
    });

    const imageURL = `https://storage.googleapis.com/${storage.name}/${filename}`;

    // Update the stall with the new URL
    await stallManagementService.updateStall(stall.stallID, {
      ...stall,
      imageURL
    });

    return res.status(200).json({ message: 'Header image uploaded successfully', imageURL });
  } catch (error) {
    console.error('uploadStallHeader Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const uploadMenuImage = async (req, res) => {
  try {
    const managerID = req.user.userID;
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required for menu images' });
    }

    const stall = await stallManagementService.getStallByManager(managerID);

    if (!stall) {
      return res.status(404).json({ error: 'No stall assigned to you' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!storage) {
      return res.status(500).json({ error: 'Firebase Storage is not configured' });
    }

    const ext = path.extname(req.file.originalname) || '.' + req.file.mimetype.split('/')[1];
    const sanitizedStallName = stall.stallName ? stall.stallName.replace(/[^a-zA-Z0-9 ]/g, '').trim() : 'Unknown Stall';
    const sanitizedCategory = category.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
    const filename = `Stalls/${sanitizedStallName}/${stall.stallID}/Menu/${sanitizedCategory}/menu_${Date.now()}${ext}`;
    const file = storage.file(filename);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true
    });

    const imageURL = `https://storage.googleapis.com/${storage.name}/${filename}`;

    return res.status(200).json({ message: 'Menu image uploaded successfully', imageURL });
  } catch (error) {
    console.error('uploadMenuImage Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllStalls, createStall, updateStall, deleteStall, getMyStall, updateMyStall, uploadHalalCert, uploadStallHeader, uploadMenuImage };
