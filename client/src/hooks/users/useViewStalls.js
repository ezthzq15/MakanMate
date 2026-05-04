import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../utils/auth';

export const useViewStalls = (stallId) => {
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  const fetchStallDetails = useCallback(async () => {
    if (!stallId) return;
    setLoading(true);
    try {
      // Mock coordinates for distance if needed (or real browser loc)
      const lat = 3.1390;
      const lng = 101.6869;
      
      const response = await apiClient.get(`/stalls/${stallId}`, {
        params: { lat, lng }
      });
      
      setStall(response.data);
      setIsSaved(response.data.isSaved);
    } catch (err) {
      setError(err.message);
      notifications.show({
        title: 'Error',
        message: 'Failed to load stall details',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [stallId]);

  useEffect(() => {
    fetchStallDetails();
  }, [fetchStallDetails]);

  const toggleBookmark = async () => {
    if (!isAuthenticated()) {
      notifications.show({
        title: 'Login Required',
        message: 'Please login to bookmark stalls',
        color: 'yellow'
      });
      return;
    }

    // Optimistic Update
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      const response = await apiClient.post('/engagement/toggle', { stallId });
      setIsSaved(response.data.saved);
      notifications.show({
        title: response.data.saved ? 'Saved' : 'Removed',
        message: response.data.saved ? 'Stall added to your bookmarks' : 'Stall removed from bookmarks',
        color: response.data.saved ? 'green' : 'gray'
      });
    } catch (err) {
      setIsSaved(previousState);
      notifications.show({
        title: 'Error',
        message: 'Failed to update bookmark',
        color: 'red'
      });
    }
  };

  return {
    stall,
    loading,
    isSaved,
    error,
    toggleBookmark,
    refresh: fetchStallDetails
  };
};
