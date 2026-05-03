import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * Hook: UC009 Add Stalls
 */
export const useAddStalls = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const addStall = async (formData) => {
    try {
      setLoading(true);
      await apiClient.post('/admin/stalls', formData);

      notifications.show({ title: 'Success', message: 'Stall added successfully', color: 'green' });
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      notifications.show({ 
        title: 'Add Stall Error', 
        message: err.response?.data?.error || err.message || 'Failed to add stall', 
        color: 'red' 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addStall, loading };
};
