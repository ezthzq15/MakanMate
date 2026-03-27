import { useState } from 'react';

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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      setError(err.message);
      
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
