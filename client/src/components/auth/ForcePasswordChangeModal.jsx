import React, { useState, useEffect } from 'react';
import { Modal, Paper, Title, Text, Stack, PasswordInput, Button, Alert, Group, ThemeIcon, Progress, Box } from '@mantine/core';
import { IconLock, IconAlertCircle, IconCheck, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../lib/apiClient';
import { logout } from '../../utils/auth';

const ForcePasswordChangeModal = ({ opened, user, onPasswordChanged }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  // Timer logic
  useEffect(() => {
    if (!opened) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          notifications.show({
            title: 'Session Expired',
            message: 'You did not change your password in time. Logging out...',
            color: 'red',
          });
          setTimeout(() => logout(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [opened]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notifications.show({ title: 'Error', message: 'Passwords do not match', color: 'red' });
      return;
    }

    try {
      setLoading(true);
      await apiClient.put('/auth/change-password', { currentPassword, newPassword });

      notifications.show({ 
        title: 'Success', 
        message: 'Password changed successfully.', 
        color: 'green',
        icon: <IconCheck size={18} /> 
      });

      onPasswordChanged();
    } catch (err) {
      notifications.show({ 
        title: 'Error', 
        message: err.response?.data?.error || err.message || 'Failed to change password', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  const progressColor = timeLeft > 60 ? 'teal' : timeLeft > 20 ? 'orange' : 'red';

  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Block closing
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="md"
      radius="lg"
      overlayProps={{ blur: 10, opacity: 0.8 }}
    >
      <Box p="md">
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon size={60} radius="xl" color="olive" variant="light">
            <IconLock size={32} />
          </ThemeIcon>
          <Title order={2} style={{ color: '#4D6459', fontWeight: 900 }}>Security Required</Title>
          <Text c="dimmed" size="sm" ta="center">
            Your account is using a temporary password. Please update it now to secure your account.
          </Text>
        </Stack>

        <Paper withBorder p="lg" radius="md" bg="var(--mantine-color-gray-0)">
            <Group justify="space-between" mb={5}>
                <Group gap="xs">
                    <IconClock size={16} color={timeLeft < 30 ? 'red' : 'gray'} />
                    <Text size="xs" fw={700} c={timeLeft < 30 ? 'red' : 'dimmed'}>
                        TIME REMAINING
                    </Text>
                </Group>
                <Text size="xs" fw={900} c={timeLeft < 30 ? 'red' : 'olive'}>
                    {timeLeft}s
                </Text>
            </Group>
            <Progress 
                value={(timeLeft / 120) * 100} 
                size="sm" 
                color={progressColor} 
                radius="xl"
                mb="md"
                animated={timeLeft < 20}
            />
        </Paper>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <Stack>
            <PasswordInput
              label="Current Temporary Password"
              placeholder="Enter temporary password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              radius="md"
            />
            <PasswordInput
              label="New Secure Password"
              placeholder="Min. 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              radius="md"
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Repeat new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              radius="md"
            />

            <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light" py="xs">
              <Text size="xs">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </Text>
            </Alert>

            <Button 
                type="submit" 
                fullWidth 
                mt="md" 
                color="olive" 
                radius="xl" 
                size="md"
                loading={loading}
            >
              Secure Account
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ForcePasswordChangeModal;
