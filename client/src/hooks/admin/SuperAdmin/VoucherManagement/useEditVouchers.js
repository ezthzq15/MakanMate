import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useEditVouchers = ({ voucher, onSuccess, onClose }) => {
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
      isActive: true,
    },
    validate: {
      stallID: (val) => (!val ? 'Stall is required' : null),
      title: (val) => (!val ? 'Voucher Title is required' : null),
      discountValue: (val) => (!val ? 'Discount value is required' : null),
      quantity: (val) => (!val || val < 1 ? 'Quantity must be at least 1' : null),
      validUntil: (val) => (!val ? 'Valid until date is required' : null),
    },
  });

  useEffect(() => {
    if (voucher) {
      form.setValues({
        stallID: voucher.stallID || '',
        title: voucher.title || '',
        discountType: voucher.discountType || 'Percentage',
        discountValue: voucher.discountValue || '',
        minSpend: voucher.minSpend || '',
        quantity: voucher.quantity || 100,
        validUntil: voucher.validUntil ? new Date(voucher.validUntil) : null,
        isActive: voucher.isActive !== false,
      });
    }
  }, [voucher]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.put(`/admin/vouchers/${voucher.id}`, {
        ...values,
        validUntil: new Date(values.validUntil).toISOString(),
      });
      notifications.show({ title: 'Success', message: 'Voucher updated successfully', color: 'green' });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update voucher';
      notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return { form, stalls, loading, handleSubmit };
};
