import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useMenu = (stallID) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalCategories, setGlobalCategories] = useState([]);

  const fetchGlobalCategories = async () => {
    try {
      const res = await apiClient.get('/menu/categories/global');
      setGlobalCategories(res.data.categories || []);
    } catch (err) {
      console.error('Fetch global categories error:', err);
    }
  };

  const fetchMenu = async () => {
    if (!stallID) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/menu/${stallID}`);
      setMenuItems(res.data.menu);
    } catch (err) {
      console.error('Fetch menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalCategories();
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [stallID]);

  const addMenuItem = async (values) => {
    try {
      await apiClient.post('/menu', { ...values, stallID });
      notifications.show({ title: 'Success', message: 'Item added to menu', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to add item', 
        color: 'red' 
      });
      return false;
    }
  };

  const updateMenuItem = async (menuID, values) => {
    try {
      await apiClient.put('/menu', { ...values, menuID });
      notifications.show({ title: 'Success', message: 'Menu item updated', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to update item', 
        color: 'red' 
      });
      return false;
    }
  };

  const deleteMenuItem = async (menuID) => {
    try {
      await apiClient.delete(`/menu/${menuID}`);
      notifications.show({ title: 'Success', message: 'Item removed from menu', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to delete item', 
        color: 'red' 
      });
      return false;
    }
  };

  const localCategories = [...new Set(menuItems.map(item => item.category))].filter(Boolean);
  const categories = [...new Set([...globalCategories, ...localCategories, 'Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Snacks'])].filter(Boolean);

  return { menuItems, loading, categories, addMenuItem, updateMenuItem, deleteMenuItem, fetchMenu };
};
