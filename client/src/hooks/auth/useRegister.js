import { useState } from 'react';
import apiClient from '../../lib/apiClient';

/**
 * Hook to handle register API call and state.
 * Returns { register, loading, error }
 */
export const useRegister = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (name, email, password) => {
    if (onMutate) {
      onMutate();
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', {
        displayName: name,
        email,
        password,
      });

      const data = response.data;

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
