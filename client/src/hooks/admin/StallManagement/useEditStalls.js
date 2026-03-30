import { useState } from 'react';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

/**
 * Hook: UC009 Edit Stalls
 */
export const useEditStalls = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const editStall = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/stalls/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stall');

      notifications.show({ title: 'Success', message: 'Stall updated successfully', color: 'green' });
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      notifications.show({ title: 'Update Stall Error', message: err.message, color: 'red' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editStall, loading };
};
