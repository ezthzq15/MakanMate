import { useState } from 'react';
import apiClient from '../../lib/apiClient';

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
      const response = await apiClient.post('/auth/login', {
        userEmail,
        userPassword,
      });

      const data = response.data;

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
      // Suspended account — special case
      if (err.response?.status === 403 && err.response?.data?.error === 'ACCOUNT_SUSPENDED') {
        setIsSuspended(true);
        setLoading(false);
        return null;
      }

      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      
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