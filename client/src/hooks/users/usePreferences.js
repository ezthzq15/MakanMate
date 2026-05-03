import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../lib/apiClient';
import { getAuthUser } from '../../utils/auth';

/**
 * Custom hook to manage user culinary preferences
 */
export const usePreferences = () => {
  const [cuisineType, setCuisineType] = useState([]);
  const [isHalal, setIsHalal] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState('MEDIUM');
  const [budgetAmount, setBudgetAmount] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user && user.userID) {
      setUserID(user.userID);
      fetchPreferences(user.userID);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPreferences = async (uid) => {
    try {
      const response = await apiClient.get(`/preferences/${uid}`);
      const data = response.data;
      
      setCuisineType(data.cuisineType || []);
      setIsHalal(data.isHalal === true);
      setSpicyLevel(data.spicyLevel || 'MEDIUM');
      setBudgetAmount(data.budgetAmount || 2);
    } catch (error) {
      console.error('Fetch Preferences Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userID) return;
    setSaving(true);
    try {
      const payload = {
        userID,
        cuisineType,
        isHalal,
        spicyLevel,
        budgetAmount
      };

      await apiClient.put('/preferences/update', payload);

      notifications.show({
        title: 'Success',
        message: 'Your culinary preferences have been updated!',
        color: 'teal'
      });
    } catch (error) {
      notifications.show({
        title: 'Save Failed',
        message: error.response?.data?.error || error.message || 'Failed to update preferences',
        color: 'red'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCuisine = (cuisine) => {
    if (cuisineType.includes(cuisine)) {
      setCuisineType(cuisineType.filter(c => c !== cuisine));
    } else {
      setCuisineType([...cuisineType, cuisine]);
    }
  };

  return {
    cuisineType,
    isHalal,
    spicyLevel,
    budgetAmount,
    loading,
    saving,
    setCuisineType,
    setIsHalal,
    setSpicyLevel,
    setBudgetAmount,
    toggleCuisine,
    handleSave,
  };
};
