import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * useAddUsers
 * All variables strictly from class diagram:
 * userID (auto), userName, userEmail, userPassword, userPhone, userRole, isActive, preferenceID
 */
const useAddUsers = ({ onCreated, onClose } = {}) => {
  const form = useForm({
    initialValues: {
      userName: '',
      userEmail: '',
      userPassword: '',
      userPhone: '',
      userRole: 'user',
      accountStatus: 0,
      preferenceID: '',
    },
    validate: {
      userName: (val) =>
        !val || val.trim() === '' ? 'Name is required' : null,
      userEmail: (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Invalid email address',
      userPassword: (val) =>
        val.length >= 8 ? null : 'Password must be at least 8 characters',
      userRole: (val) => (!val ? 'Role is required' : null),
      userPhone: (val) =>
        !val || /^\+?[\d\s\-()]{7,15}$/.test(val)
          ? null
          : 'Enter a valid phone number',
    },
  });

  const handleSubmit = async (values) => {
    try {
      await apiClient.post('/admin/users', values);

      notifications.show({
        title: 'User Created',
        message: `${values.userName} has been added successfully.`,
        color: 'green',
      });

      form.reset();
      onClose?.();
      onCreated?.();
    } catch (err) {
      notifications.show({
        title: 'Creation Failed',
        message: err.response?.data?.error || err.message || 'Failed to create user',
        color: 'red',
      });
    }
  };

  return { form, handleSubmit };
};

export default useAddUsers;
