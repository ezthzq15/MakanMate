import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../../utils/auth';

export const useProfile = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (onMutate) onMutate();
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }

        const profileData = data.profile;
        setProfile(profileData);
        if (onSuccess) onSuccess(profileData);
      } catch (err) {
        setError(err.message);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
