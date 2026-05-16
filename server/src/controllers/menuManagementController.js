const menuManagementService = require('../services/menuManagementService');

/**
 * UC011: Manage Stall Menu — Controller
 */

const getStallMenu = async (req, res) => {
  try {
    const { stallID } = req.params;
    if (!stallID) return res.status(400).json({ error: 'stallID is required' });

    const menu = await menuManagementService.getMenuByStall(stallID);
    return res.status(200).json({ menu });
  } catch (error) {
    console.error('getStallMenu Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { stallID, menuName, menuPrice, itemDescription, menuPic, isAvailable, category } = req.body;

    if (!stallID || !menuName || menuPrice === undefined) {
      return res.status(400).json({ error: 'stallID, menuName, and menuPrice are required' });
    }

    const newItem = await menuManagementService.addMenuItem({
      stallID,
      menuName,
      menuPrice: Number(menuPrice),
      itemDescription: itemDescription || '',
      menuPic: menuPic || '',
      isAvailable: isAvailable !== false,
      category: category || 'Others'
    });

    return res.status(201).json({ message: 'Menu item added successfully', item: newItem });
  } catch (error) {
    console.error('createMenuItem Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { menuID, menuName, menuPrice, itemDescription, menuPic, isAvailable, category } = req.body;
    if (!menuID) return res.status(400).json({ error: 'menuID is required' });

    await menuManagementService.updateMenuItem(menuID, { menuName, menuPrice, itemDescription, menuPic, isAvailable, category });
    return res.status(200).json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('updateMenuItem Error:', error.message);
    const status = error.message === 'Item not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { menuID } = req.params;
    if (!menuID) return res.status(400).json({ error: 'menuID is required' });

    await menuManagementService.deleteMenuItem(menuID);
    return res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('deleteMenuItem Error:', error.message);
    const status = error.message === 'Item not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

const getGlobalCategories = async (req, res) => {
  try {
    const categories = await menuManagementService.getAllCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    console.error('getGlobalCategories Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStallMenu, createMenuItem, updateMenuItem, deleteMenuItem, getGlobalCategories };
