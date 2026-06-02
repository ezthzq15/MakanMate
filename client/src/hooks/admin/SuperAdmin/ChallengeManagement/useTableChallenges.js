import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useTableChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/challenges');
      setChallenges(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch challenges', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const deleteChallenge = async (id) => {
    try {
      await apiClient.delete(`/admin/challenges/${id}`);
      notifications.show({ title: 'Success', message: 'Challenge deleted successfully', color: 'green' });
      fetchChallenges();
      return true;
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to delete challenge', color: 'red' });
      return false;
    }
  };

  const generateRandomChallenge = async () => {
    try {
      const response = await apiClient.post('/admin/challenges/generate-random');
      notifications.show({ 
        title: 'Challenge Generated', 
        message: `Generated "${response.data.title}" successfully with ${response.data.points} points!`, 
        color: 'green' 
      });
      fetchChallenges();
      return true;
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: error.response?.data?.error || 'Failed to generate random challenge', 
        color: 'red' 
      });
      return false;
    }
  };

  return { challenges, loading, fetchChallenges, deleteChallenge, generateRandomChallenge };
};
