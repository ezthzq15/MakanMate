import { useState, useEffect, useCallback } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import apiClient from '../../lib/apiClient';
import { getAuthUser, isAuthenticated } from '../../utils/auth';
import useRoadDistances from '../map/useRoadDistances';

/**
 * Hook: UC006 + UC005 — Find Stalls & Recommendations
 * Adaptive behavior for Guest vs Authenticated
 */
export const useFindStalls = () => {
  const [mode, setMode] = useState('personalized');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const isAuth = isAuthenticated();
  
  const [filters, setFilters] = useState({
    cuisines: [],
    halal: 'all',
    budget: 'all',
    spice: 'all'
  });
  
  const [sortBy, setSortBy] = useState('recommended');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userLoc, setUserLoc] = useState({ lat: 5.4141, lng: 100.3288 }); // George Town, Penang default

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

  const fetchPreferences = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await apiClient.get('/preferences/my');
      if (res.data) {
        setFilters({
          cuisines: res.data.cuisines || [],
          halal: res.data.halal ? 'yes' : 'all',
          budget: res.data.budgetRange || 'all',
          spice: res.data.spiceLevel || 'all'
        });
      }
    } catch (err) {
      console.error('Failed to sync preferences', err);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isAuth && mode === 'personalized') {
      fetchPreferences();
    }
  }, [isAuth, mode, fetchPreferences]);

  const fetchStalls = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let params = {
        page,
        limit: 12,
        lat: userLoc.lat,
        lng: userLoc.lng
      };

      if (mode === 'personalized') {
        endpoint = '/recommendation';
        // Backend now handles userID from token (optionalVerifyToken)
      } else {
        endpoint = '/stalls/search';
        params = {
          ...params,
          q: debouncedSearch,
          cuisines: filters.cuisines.join(','),
          halalTags: (filters.halalTags && filters.halalTags.length > 0)
            ? filters.halalTags.join(',')
            : filters.halal === 'yes' ? 'halal' : '',
          budget: filters.budget,
          spice: filters.spice,
          sort: sortBy
        };
      }

      const response = await apiClient.get(endpoint, { params });
      setResults(response.data.stalls || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Fetch Stalls Error:', error);
    } finally {
      setLoading(false);
    }
  }, [mode, debouncedSearch, filters, sortBy, page, isAuth, userLoc.lat, userLoc.lng]);

  useEffect(() => {
    fetchStalls();
  }, [fetchStalls]);

  useEffect(() => {
    if (mode === 'explore') {
       setPage(1);
    }
  }, [debouncedSearch, filters, mode, sortBy]);

  const resetFilters = () => {
    setFilters({ cuisines: [], halal: 'all', budget: 'all', spice: 'all' });
    setSearch('');
  };

  const finalResults = useRoadDistances(userLoc, results);

  return {
    mode, setMode,
    search, setSearch,
    filters, setFilters,
    sortBy, setSortBy,
    page, setPage,
    results: finalResults, totalResults,
    loading, resetFilters,
    isAuth,
    refresh: fetchStalls
  };
};
