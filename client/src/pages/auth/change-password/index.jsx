import React, { useState } from 'react';
import { Paper, Title, Text, TextInput, PasswordInput, Button, Container, Stack, Group, ThemeIcon, Alert } from '@mantine/core';
import { IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { API_BASE } from '../../../lib/api';
import { getAuthHeaders, getAuthUser } from '../../../utils/auth';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notifications.show({ title: 'Error', message: 'Passwords do not match', color: 'red' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      notifications.show({ 
        title: 'Success', 
        message: 'Password changed successfully. Redirecting...', 
        color: 'green',
        icon: <IconCheck size={18} /> 
      });

      // Update local user object to clear forcePasswordChange flag
      const updatedUser = { ...user, forcePasswordChange: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => {
        window.location.replace(user.userRole === 'admin' ? '/admin' : '/stall/dashboard');
      }, 2000);
    } catch (err) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" style={{ color: '#4D6459', fontWeight: 900 }}>
        Security Update
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Please update your temporary password to continue.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <PasswordInput
              label="Current Password"
              placeholder="Enter temporary password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <PasswordInput
              label="New Password"
              placeholder="Min. 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Repeat new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Alert icon={<IconAlertCircle size="16" />} title="Note" color="blue" variant="light" size="xs">
              Password must be at least 8 characters long.
            </Alert>

            <Button type="submit" fullWidth mt="xl" color="olive" radius="xl" loading={loading}>
              Update Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
