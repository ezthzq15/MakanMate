import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

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
      isActive: true,
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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

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
        message: err.message,
        color: 'red',
      });
    }
  };

  return { form, handleSubmit };
};

export default useAddUsers;
