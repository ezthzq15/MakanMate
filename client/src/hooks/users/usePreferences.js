import { useState, useEffect, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../lib/apiClient';
import { getAuthUser } from '../../utils/auth';

/**
 * Hook: UC004 — Manage User Preferences
 * Aligned with the new MVC backend structure.
 */
export const usePreferences = () => {
  const [cuisines, setCuisines] = useState([]);
  const [halal, setHalal] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState('MEDIUM');
  const [budgetRange, setBudgetRange] = useState('RM10–20');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user && user.userID) {
      setUserId(user.userID);
      fetchPreferences(user.userID);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPreferences = async (uid) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/preferences/${uid}`);
      const data = response.data;
      
      const normalized = {
        cuisines: data.cuisines || [],
        halal: data.halal === true,
        spiceLevel: data.spiceLevel || 'MEDIUM',
        budgetRange: data.budgetRange || 'RM10–20'
      };

      setCuisines(normalized.cuisines);
      setHalal(normalized.halal);
      setSpiceLevel(normalized.spiceLevel);
      setBudgetRange(normalized.budgetRange);
      setInitialData(normalized);
    } catch (error) {
      console.error('Fetch Preferences Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const payload = {
        userId,
        cuisines,
        halal,
        spiceLevel,
        budgetRange
      };

      await apiClient.post('/preferences', payload);

      notifications.show({
        title: 'Preferences Saved',
        message: 'Your food hunting preferences have been updated successfully!',
        color: 'green'
      });
      
      setInitialData(payload); // Update initial state to disable save button
    } catch (error) {
      notifications.show({
        title: 'Update Failed',
        message: error.response?.data?.error || error.message || 'Failed to update preferences',
        color: 'red'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = () => {
    if (initialData) {
      setCuisines(initialData.cuisines);
      setHalal(initialData.halal);
      setSpiceLevel(initialData.spiceLevel);
      setBudgetRange(initialData.budgetRange);
    } else {
      setCuisines([]);
      setHalal(false);
      setSpiceLevel('MEDIUM');
      setBudgetRange('RM10–20');
    }
  };

  const toggleCuisine = (cuisine) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter(c => c !== cuisine));
    } else {
      setCuisines([...cuisines, cuisine]);
    }
  };

  // Check if any changes were made
  const hasChanges = useMemo(() => {
    if (!initialData) return cuisines.length > 0;
    return (
      JSON.stringify(cuisines.sort()) !== JSON.stringify(initialData.cuisines.sort()) ||
      halal !== initialData.halal ||
      spiceLevel !== initialData.spiceLevel ||
      budgetRange !== initialData.budgetRange
    );
  }, [cuisines, halal, spiceLevel, budgetRange, initialData]);

  return {
    cuisines,
    halal,
    spiceLevel,
    budgetRange,
    loading,
    saving,
    hasChanges,
    toggleCuisine,
    setHalal,
    setSpiceLevel,
    setBudgetRange,
    handleSave,
    resetPreferences,
    refresh: () => fetchPreferences(userId)
  };
};
