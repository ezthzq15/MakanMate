import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../../lib/apiClient';
import { notifications } from '@mantine/notifications';
import useRoadDistances from '../map/useRoadDistances';

/**
 * HOOK: UC007 Bookmarks Logic
 * Handles fetching, filtering, and removing bookmarked stalls.
 */
export const useStallsBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoc, setUserLoc] = useState({ lat: 5.4141, lng: 100.3288 }); // Default Penang

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    cuisines: [],
    halal: 'all',
    budget: 'all',
    spice: 'all'
  });
  const [sortBy, setSortBy] = useState('recent');

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/engagement/my');
      setBookmarks(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
      setError('Could not load your saved spots. Please try again.');
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch bookmarks',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const removeBookmark = async (stallId) => {
    try {
      await apiClient.post('/engagement/toggle', { stallId });
      // Optimistic Update
      setBookmarks(prev => prev.filter(b => b.id !== stallId));
      notifications.show({
        title: 'Removed',
        message: 'Stall removed from your saved spots',
        color: 'gray'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove bookmark',
        color: 'red'
      });
    }
  };

  // Derived State: Filtered & Sorted Bookmarks
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Search Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.cuisine.some(c => c.toLowerCase().includes(q))
      );
    }

    // Cuisine Filter
    if (filters.cuisines.length > 0) {
      result = result.filter(b => 
        filters.cuisines.some(c => b.cuisine.includes(c))
      );
    }

    // Halal Filter
    if (filters.halal === 'yes') {
      result = result.filter(b => b.halal === true);
    }

    // Budget Filter
    if (filters.budget !== 'all') {
      result = result.filter(b => b.priceRange === filters.budget);
    }

    // Spice Filter
    if (filters.spice !== 'all') {
      result = result.filter(b => b.spiceLevel === filters.spice);
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'distance':
        result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'recent':
      default:
        // Assuming the list comes from backend in chronological order
        // In a real app, we might have a savedAt field
        break;
    }

    return result;
  }, [bookmarks, search, filters, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setFilters({ cuisines: [], halal: 'all', budget: 'all', spice: 'all' });
  };

  const finalBookmarks = useRoadDistances(userLoc, filteredBookmarks);

  return {
    bookmarks: finalBookmarks,
    totalCount: bookmarks.length,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    removeBookmark,
    resetFilters,
    refresh: fetchBookmarks
  };
};
