import { useState } from 'react';

export const useLogin = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    // Trigger onMutate before the request starts
    if (onMutate) {
      onMutate();
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Backend returns { token, userId } as requested
      localStorage.setItem('token', data.token || data.idToken);
      
      // Trigger onSuccess after a successful request
      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      setError(err.message);
      
      // Trigger onError if the request fails
      if (onError) {
        onError(err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};