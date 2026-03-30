import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
  Stack,
  Anchor,
  Center,
  Popover,
  Progress,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRegister } from '../../hooks/auth/useRegister';

const PasswordRequirement = ({ meets, label }) => (
  <Text 
    c={meets ? 'teal' : 'red'} 
    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }} 
    mt="xs"
  >
    {meets ? <IconCheck size={14} stroke={3} /> : <IconX size={14} stroke={3} />}
    {label}
  </Text>
);

export function Signup() {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [popoverOpened, setPopoverOpened] = useState(false);

  const checks = [
    { label: 'Includes at least 8 characters', meets: formData.userPassword.length >= 8 },
    { label: 'Includes number', meets: /[0-9]/.test(formData.userPassword) },
    { label: 'Includes lowercase letter', meets: /[a-z]/.test(formData.userPassword) },
    { label: 'Includes uppercase letter', meets: /[A-Z]/.test(formData.userPassword) },
    { label: 'Includes special symbol', meets: /[^A-Za-z0-9]/.test(formData.userPassword) },
  ];

  const strength = checks.filter(c => c.meets).length;
  const color = strength === 5 ? 'teal' : strength > 2 ? 'yellow' : 'red';

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.userName || !formData.userEmail || !formData.userPassword || !formData.confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (formData.userPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.userPassword)) {
      setValidationError('Password must be at least 8 characters, include uppercase, lowercase, number and special character.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please log in.',
        color: 'green'
      });
      window.location.href = '/auth/login';
    } catch (error) {
      setValidationError(error.message);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="login-card" withBorder={false}>
      <Stack align="center" mb={30}>
        <Title order={2} fw={700}>Create an Account</Title>
        <Text c="dimmed" size="sm">Join MakanMate and discover great food</Text>
      </Stack>

      {validationError && (
        <Alert color="red" mb="md" variant="light">
          {validationError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={20}>
          <TextInput
            label="Full Name"
            placeholder="John Hamsten"
            value={formData.userName}
            onChange={(event) => setFormData({...formData, userName: event.currentTarget.value})}
            required
          />

          <TextInput
            label="Email"
            placeholder="@gmail.com"
            value={formData.userEmail}
            onChange={(event) => setFormData({...formData, userEmail: event.currentTarget.value})}
            required
          />

          <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }} radius="lg">
            <Popover.Target>
              <PasswordInput
                label="Password"
                placeholder="••••••••••••••"
                value={formData.userPassword}
                onChange={(event) => setFormData({...formData, userPassword: event.currentTarget.value})}
                onFocus={() => setPopoverOpened(true)}
                onBlur={() => setPopoverOpened(false)}
                required
              />
            </Popover.Target>
            <Popover.Dropdown p="md" style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
              <Progress color={color} value={strength * 20} size="xs" mb="md" />
              {checks.map((check, index) => (
                <PasswordRequirement key={index} label={check.label} meets={check.meets} />
              ))}
            </Popover.Dropdown>
          </Popover>

          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••••••••"
            value={formData.confirmPassword}
            onChange={(event) => setFormData({...formData, confirmPassword: event.currentTarget.value})}
            required
          />

          <Button 
            type="submit" 
            fullWidth 
            mt="md" 
            loading={loading}
          >
            Sign Up
          </Button>

          <Center mt="sm">
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor size="sm" fw={700} href="/auth/login" c="#5b9bd5">
                Sign In
              </Anchor>
            </Text>
          </Center>
        </Stack>
      </form>
    </Paper>
  );
}
