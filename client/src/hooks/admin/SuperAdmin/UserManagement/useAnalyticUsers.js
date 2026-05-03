import { useState, useEffect } from 'react';
import apiClient from '../../../../lib/apiClient';

/**
 * useAnalyticUsers
 * Fetches all users and derives analytics: totalUsers, activeToday, newSignups (last 24h)
 */
const useAnalyticUsers = () => {
  const [stats, setStats] = useState({ total: 0, activeToday: 0, newSignups: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/admin/users');
        const data = response.data;

        const users = data.users || [];
        const total = users.length;
        const activeToday = users.filter((u) => u.accountStatus === 0).length;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newSignups = users.filter(
          (u) => u.createdAt && new Date(u.createdAt) > oneDayAgo
        ).length;

        setStats({ total, activeToday, newSignups });
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useAnalyticUsers;
