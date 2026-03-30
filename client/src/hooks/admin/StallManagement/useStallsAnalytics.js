import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/stalls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to fetch analytics');
      
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
      notifications.show({ title: 'Analytics Error', message: err.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { ...data, loading, refresh: fetchAnalytics };
};
