import { useState, useEffect, useCallback } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import apiClient from '../../lib/apiClient';
import { getAuthUser, isAuthenticated } from '../../utils/auth';

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

  // Mock location for FYP simulation (or real geolocation if available)
  const userLoc = { lat: 3.1390, lng: 101.6869 }; 

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
        endpoint = '/recommendations';
        // Backend now handles userID from token (optionalVerifyToken)
      } else {
        endpoint = '/stalls/search';
        params = {
          ...params,
          q: debouncedSearch,
          cuisines: filters.cuisines.join(','),
          halal: filters.halal,
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
  }, [mode, debouncedSearch, filters, sortBy, page, isAuth]);

  useEffect(() => {
    fetchStalls();
  }, [fetchStalls]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, mode, sortBy]);

  const resetFilters = () => {
    setFilters({ cuisines: [], halal: 'all', budget: 'all', spice: 'all' });
    setSearch('');
  };

  return {
    mode, setMode,
    search, setSearch,
    filters, setFilters,
    sortBy, setSortBy,
    page, setPage,
    results, totalResults,
    loading, resetFilters,
    isAuth,
    refresh: fetchStalls
  };
};
