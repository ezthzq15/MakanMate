import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * Hook: UC009 Edit Stalls
 */
export const useEditStalls = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const editStall = async (formData) => {
    try {
      setLoading(true);
      await apiClient.put('/admin/stalls/update', formData);

      notifications.show({ title: 'Success', message: 'Stall updated successfully', color: 'green' });
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      notifications.show({ 
        title: 'Update Stall Error', 
        message: err.response?.data?.error || err.message || 'Failed to update stall', 
        color: 'red' 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editStall, loading };
};
