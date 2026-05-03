import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

export const useProfile = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (onMutate) onMutate();
      try {
        const response = await apiClient.get('/users/profile');
        const profileData = response.data.profile;
        setProfile(profileData);
        if (onSuccess) onSuccess(profileData);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch profile');
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
