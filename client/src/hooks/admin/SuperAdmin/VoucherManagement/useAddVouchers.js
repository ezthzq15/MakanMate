import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useAddVouchers = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [stalls, setStalls] = useState([]);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const res = await apiClient.get('/admin/stalls');
        setStalls(res.data.stalls || []);
      } catch (err) {
        console.error('Fetch stalls error:', err);
      }
    };
    fetchStalls();
  }, []);

  const form = useForm({
    initialValues: {
      stallID: '',
      title: '',
      discountType: 'Percentage',
      discountValue: '',
      minSpend: '',
      quantity: 100,
      validUntil: null,
    },
    validate: {
      stallID: (val) => (!val ? 'Stall is required' : null),
      title: (val) => (!val ? 'Voucher Title is required' : null),
      discountValue: (val) => (!val ? 'Discount value is required' : null),
      quantity: (val) => (!val || val < 1 ? 'Quantity must be at least 1' : null),
      validUntil: (val) => (!val ? 'Valid until date is required' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.post('/admin/vouchers', {
        ...values,
        validUntil: new Date(values.validUntil).toISOString(),
      });
      notifications.show({ title: 'Success', message: 'Voucher added successfully', color: 'green' });
      form.reset();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add voucher';
      notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return { form, stalls, loading, handleSubmit };
};
