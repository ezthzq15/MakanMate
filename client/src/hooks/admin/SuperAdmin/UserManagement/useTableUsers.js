import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

/**
 * useTableUsers
 * Encapsulates all data-fetching and mutation logic for UsersTable.
 */
const useTableUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // true on mount to show loader immediately

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to load users', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial fetch on mount
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleActive = async (user) => {
    // accountStatus: 0 = Active, 1 = Not Active, 2 = Suspended
    const isSuspended = user.accountStatus === 2;
    const newStatus = isSuspended ? 0 : 2;
    try {
      await apiClient.put('/admin/users/update', { userID: user.userID, accountStatus: newStatus });
      notifications.show({
        title: isSuspended ? 'User Activated' : 'User Suspended',
        message: `${user.userName} has been ${isSuspended ? 'activated' : 'suspended'}.`,
        color: isSuspended ? 'green' : 'orange',
      });
      await fetchUsers();
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Toggle failed', 
        color: 'red' 
      });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.userName}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/admin/users/${user.userID}`);
      notifications.show({
        title: 'User Deleted',
        message: `${user.userName} has been removed.`,
        color: 'red',
      });
      await fetchUsers();
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Delete failed', 
        color: 'red' 
      });
    }
  };

  return { users, loading, fetchUsers, handleToggleActive, handleDelete };
};

export default useTableUsers;
