import { useState } from 'react';

export const useLogin = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  const login = async (userEmail, userPassword) => {
    if (onMutate) onMutate();
    setLoading(true);
    setError(null);
    setIsSuspended(false);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, userPassword }),
      });

      const data = await response.json();

      // Suspended account — special case, show modal not generic error
      if (response.status === 403 && data.error === 'ACCOUNT_SUSPENDED') {
        setIsSuspended(true);
        setLoading(false);
        return null;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token || data.idToken);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Store wasInactive flag for homepage Welcome Back modal
      if (data.wasInactive) {
        localStorage.setItem('wasInactive', JSON.stringify({
          flag: true,
          userName: data.user?.userName || 'there',
        }));
      } else {
        localStorage.removeItem('wasInactive');
      }

      if (onSuccess) onSuccess(data);

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

  return { login, loading, error, isSuspended };
};