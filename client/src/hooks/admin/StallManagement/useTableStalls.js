import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/stalls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch stalls');
      setStalls(data.stalls || []);
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stallID, stallName) => {
    if (!window.confirm(`Are you sure you want to delete "${stallName}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/stalls/${stallID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      
      notifications.show({ title: 'Success', message: 'Stall deleted successfully', color: 'green' });
      fetchStalls();
    } catch (err) {
      notifications.show({ title: 'Delete Error', message: err.message, color: 'red' });
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  return { stalls, loading, refresh: fetchStalls, handleDelete };
};
