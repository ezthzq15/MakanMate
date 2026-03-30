import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

const API_BASE = 'http://localhost:5000/api';

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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userID: user.userID, accountStatus: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Toggle failed');
      notifications.show({
        title: isSuspended ? 'User Activated' : 'User Suspended',
        message: `${user.userName} has been ${isSuspended ? 'activated' : 'suspended'}.`,
        color: isSuspended ? 'green' : 'orange',
      });
      await fetchUsers();
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.userName}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users/${user.userID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      notifications.show({
        title: 'User Deleted',
        message: `${user.userName} has been removed.`,
        color: 'red',
      });
      await fetchUsers();
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
    }
  };

  return { users, loading, fetchUsers, handleToggleActive, handleDelete };
};

export default useTableUsers;
