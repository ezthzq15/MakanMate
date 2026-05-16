import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * Hook for Stall Managers to manage their own stall information.
 */
export const useStallInformation = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stallData, setStallData] = useState({
    stallName: '',
    cuisineType: '',
    isHalal: false,
    isMuslimFriendly: false,
    latitude: 0,
    longitude: 0,
    description: '',
    operatingHours: '',
    imageURL: ''
  });

  const fetchMyStall = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stalls/my-stall');
      setStallData(res.data.stall);
    } catch (err) {
      console.error('Fetch stall error:', err);
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to fetch stall data',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMyStall = async (values) => {
    setSaving(true);
    try {
      await apiClient.put('/stalls/my-stall', values);
      notifications.show({
        title: 'Success',
        message: 'Stall information updated successfully',
        color: 'green'
      });
      setStallData(values);
      return true;
    } catch (err) {
      console.error('Update stall error:', err);
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to update stall information',
        color: 'red'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchMyStall();
  }, []);

  return { stallData, setStallData, loading, saving, updateMyStall, fetchMyStall };
};
