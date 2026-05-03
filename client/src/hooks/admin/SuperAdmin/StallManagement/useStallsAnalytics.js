import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * Hook: UC009 Stalls Analytics
 * Fetches all stalls and computes metrics for display.
 */
export const useStallsAnalytics = () => {
  const [data, setData] = useState({
    totalStalls: 0,
    halalCount: 0,
    nonHalalCount: 0,
    cuisineDistribution: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/stalls');
      const result = response.data;
      
      const stalls = result.stalls || [];

      const stats = stalls.reduce((acc, stall) => {
        acc.totalStalls++;
        if (stall.isHalal) acc.halalCount++;
        else acc.nonHalalCount++;

        const cuisine = stall.cuisineType || 'Unknown';
        acc.cuisineDistribution[cuisine] = (acc.cuisineDistribution[cuisine] || 0) + 1;

        return acc;
      }, {
        totalStalls: 0,
        halalCount: 0,
        nonHalalCount: 0,
        cuisineDistribution: {}
      });

      setData(stats);
    } catch (err) {
      notifications.show({ 
        title: 'Analytics Error', 
        message: err.response?.data?.error || err.message || 'Failed to fetch analytics', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { ...data, loading, refresh: fetchAnalytics };
};
