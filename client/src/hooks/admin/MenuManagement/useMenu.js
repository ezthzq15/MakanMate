import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { API_BASE } from '../../../lib/api';
import { getAuthHeaders, getAuthUser } from '../../../utils/auth';

export const useMenu = (stallID) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();

  const fetchMenu = async () => {
    if (!stallID) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/menu?stallID=${stallID}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        setMenuItems(data.menu);
      }
    } catch (err) {
      console.error('Fetch menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [stallID]);

  const addMenuItem = async (values) => {
    try {
      const res = await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...values, stallID })
      });
      if (!res.ok) throw new Error('Failed to add item');
      notifications.show({ title: 'Success', message: 'Item added to menu', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
      return false;
    }
  };

  const updateMenuItem = async (menuID, values) => {
    try {
      const res = await fetch(`${API_BASE}/menu`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...values, menuID })
      });
      if (!res.ok) throw new Error('Failed to update item');
      notifications.show({ title: 'Success', message: 'Menu item updated', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
      return false;
    }
  };

  const deleteMenuItem = async (menuID) => {
    try {
      const res = await fetch(`${API_BASE}/menu/${menuID}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete item');
      notifications.show({ title: 'Success', message: 'Item removed from menu', color: 'green' });
      fetchMenu();
      return true;
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
      return false;
    }
  };

  return { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem, fetchMenu };
};
