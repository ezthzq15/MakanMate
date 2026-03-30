import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

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
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch users');

        const users = data.users || [];
        const total = users.length;
        const activeToday = users.filter((u) => u.isActive).length;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newSignups = users.filter(
          (u) => u.createdAt && new Date(u.createdAt) > oneDayAgo
        ).length;

        setStats({ total, activeToday, newSignups });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useAnalyticUsers;
