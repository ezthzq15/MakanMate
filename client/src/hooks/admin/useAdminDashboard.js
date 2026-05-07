import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

/**
 * HOOK: useAdminDashboard
 * Fetches real dashboard stats from the backend.
 */
export const useAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState(null);
  const [error, setError]     = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [dashRes, stallsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/stalls'),
        apiClient.get('/admin/users'),
      ]);

      const allStalls = stallsRes.data.stalls || [];
      const allUsers  = usersRes.data.users  || [];
      const dash      = dashRes.data;

      setStats({
        totalStalls:  allStalls.length,
        totalUsers:   allUsers.length,
        activeUsers:  allUsers.filter(u => u.accountStatus === 0).length,
        mostPopular:  dash.mostPopular || null,
        dailyActivity: dash.dailyActivity || [],
        topStalls:    dash.topStalls   || allStalls.slice(0, 5).map(s => ({
          id:       s.stallID,
          name:     s.stallName,
          category: s.cuisineType || '—',
          rating:   s.overallRating || 0,
          reviews:  s.reviewCount  || 0,
          status:   'ACTIVE',
          imageURL: s.imageURL || '',
        })),
        recentUsers:  allUsers
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5),
      });
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);
  return { loading, stats, error, refresh };
};
