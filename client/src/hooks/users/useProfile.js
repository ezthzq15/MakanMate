import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../../utils/auth';

/**
 * Example Hook to fetch the user's profile using the authenticated flow.
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          // Use our helper to attach the Authorization: Bearer <token>
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }

        setProfile(data.profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
