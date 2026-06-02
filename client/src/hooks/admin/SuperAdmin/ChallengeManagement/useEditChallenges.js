import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

export const useEditChallenges = ({ challenge, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      points: 50,
      isActive: true,
    },
    validate: {
      title: (val) => (!val ? 'Challenge Title is required' : null),
      description: (val) => (!val ? 'Description is required' : null),
      points: (val) => (!val || val < 1 ? 'Points must be at least 1' : null),
    },
  });

  useEffect(() => {
    if (challenge) {
      form.setValues({
        title: challenge.title || '',
        description: challenge.description || '',
        points: challenge.points || 50,
        isActive: challenge.isActive !== false,
      });
    }
  }, [challenge]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.put(`/admin/challenges/${challenge.id}`, values);
      notifications.show({ title: 'Success', message: 'Challenge updated successfully', color: 'green' });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update challenge';
      notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleSubmit };
};
