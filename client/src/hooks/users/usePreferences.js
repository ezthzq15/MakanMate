import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

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

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeToken(token);
        if (decoded && decoded.userID) {
          setUserID(decoded.userID);
          fetchPreferences(decoded.userID);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Invalid token', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPreferences = async (uid) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/preferences/${uid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCuisineType(data.cuisineType || []);
        setIsHalal(data.isHalal === true);
        setSpicyLevel(data.spicyLevel || 'MEDIUM');
        setBudgetAmount(data.budgetAmount || 2);
      }
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
      const token = localStorage.getItem('token');
      const payload = {
        userID,
        cuisineType,
        isHalal,
        spicyLevel,
        budgetAmount
      };

      const response = await fetch('http://localhost:5000/api/preferences/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to update preferences');

      notifications.show({
        title: 'Success',
        message: 'Your culinary preferences have been updated!',
        color: 'teal'
      });
    } catch (error) {
      notifications.show({
        title: 'Save Failed',
        message: error.message,
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
