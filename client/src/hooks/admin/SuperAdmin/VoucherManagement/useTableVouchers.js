import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useTableVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/vouchers');
      setVouchers(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch vouchers', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const deleteVoucher = async (id) => {
    try {
      await apiClient.delete(`/admin/vouchers/${id}`);
      notifications.show({ title: 'Success', message: 'Voucher deleted successfully', color: 'green' });
      fetchVouchers();
      return true;
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to delete voucher', color: 'red' });
      return false;
    }
  };

  const generateRandomVoucher = async () => {
    try {
      const response = await apiClient.post('/admin/vouchers/generate-random');
      notifications.show({ 
        title: 'Voucher Generated', 
        message: `Generated "${response.data.title}" successfully for ${response.data.stallName}!`, 
        color: 'green' 
      });
      fetchVouchers();
      return true;
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: error.response?.data?.error || 'Failed to generate random voucher', 
        color: 'red' 
      });
      return false;
    }
  };

  return { vouchers, loading, fetchVouchers, deleteVoucher, generateRandomVoucher };
};
