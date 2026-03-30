import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

/**
 * useUpdateUsers
 * All class diagram variables shown/managed:
 * - Read-only: userID, userEmail
 * - Editable: userName, userPhone, userRole, isActive, preferenceID
 * - NOT editable: userPassword (separate flow)
 */
const useUpdateUsers = ({ selectedUser, onUpdated, onClose } = {}) => {
  const form = useForm({
    initialValues: {
      userName: '',
      userPhone: '',
      userRole: 'user',
      accountStatus: 0,
      preferenceID: '',
    },
    validate: {
      userName: (val) =>
        !val || val.trim() === '' ? 'Name is required' : null,
      userRole: (val) => (!val ? 'Role is required' : null),
      userPhone: (val) =>
        !val || /^\+?[\d\s\-()]{7,15}$/.test(val)
          ? null
          : 'Enter a valid phone number',
    },
  });

  // Populate form whenever selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      form.setValues({
        userName: selectedUser.userName || '',
        userPhone: selectedUser.userPhone || '',
        userRole: selectedUser.userRole || 'user',
        accountStatus: selectedUser.accountStatus !== undefined ? Number(selectedUser.accountStatus) : 0,
        preferenceID: selectedUser.preferenceID || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const handleSubmit = async (values) => {
    if (!selectedUser?.userID) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID: selectedUser.userID, ...values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      notifications.show({
        title: 'User Updated',
        message: `${values.userName} has been updated successfully.`,
        color: 'green',
      });

      onClose?.();
      onUpdated?.();
    } catch (err) {
      notifications.show({
        title: 'Update Failed',
        message: err.message,
        color: 'red',
      });
    }
  };

  return { form, handleSubmit };
};

export default useUpdateUsers;
