import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

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
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      userName: (val) =>
        !val || val.trim() === '' ? 'Name is required' : null,
      userRole: (val) => (!val ? 'Role is required' : null),
      userPhone: (val) =>
        !val || /^\+?[\d\s\-()]{7,15}$/.test(val)
          ? null
          : 'Enter a valid phone number',
      newPassword: (val) =>
        val && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val)
          ? 'Password must be at least 8 characters with uppercase, lowercase, number and special character.'
          : null,
      confirmPassword: (val, values) =>
        values.newPassword && val !== values.newPassword ? 'Passwords do not match' : null,
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
        newPassword: '',
        confirmPassword: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const handleSubmit = async (values) => {
    if (!selectedUser?.userID) return;
    try {
      const payload = {
        userID: selectedUser.userID,
        userName: values.userName,
        userRole: values.userRole,
        accountStatus: values.accountStatus,
      };

      if (values.newPassword) {
        payload.newPassword = values.newPassword;
      }

      await apiClient.put('/admin/users/update', payload);

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
        message: err.response?.data?.error || err.message || 'Update failed',
        color: 'red',
      });
    }
  };

  return { form, handleSubmit };
};

export default useUpdateUsers;
