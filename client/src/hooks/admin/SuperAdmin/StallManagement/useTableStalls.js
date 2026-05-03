import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * Hook: UC009 Table Stalls
 * Fetches stall list and handles deletion.
 */
export const useTableStalls = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStalls = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/stalls');
      setStalls(response.data.stalls || []);
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to fetch stalls', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stallID, stallName) => {
    if (!window.confirm(`Are you sure you want to delete "${stallName}"?`)) return;
    try {
      await apiClient.delete(`/admin/stalls/${stallID}`);
      
      notifications.show({ title: 'Success', message: 'Stall deleted successfully', color: 'green' });
      fetchStalls();
    } catch (err) {
      notifications.show({ 
        title: 'Delete Error', 
        message: err.response?.data?.error || err.message || 'Delete failed', 
        color: 'red' 
      });
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  return { stalls, loading, refresh: fetchStalls, handleDelete };
};
