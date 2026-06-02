import { useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useAddChallenges = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      points: 50,
    },
    validate: {
      title: (val) => (!val ? 'Challenge Title is required' : null),
      description: (val) => (!val ? 'Description is required' : null),
      points: (val) => (!val || val < 1 ? 'Points must be at least 1' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.post('/admin/challenges', values);
      notifications.show({ title: 'Success', message: 'Challenge added successfully', color: 'green' });
      form.reset();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add challenge';
      notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleSubmit };
};
