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
} from '@mantine/core';
import { useRegister } from '../../hooks/auth/useRegister';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, loading, error: registerError } = useRegister();

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const result = await register(name, email, password);
    
    if (result) {
      window.location.href = '/auth/login'; // Redirect to login on success
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ width: '100%', maxWidth: 450 }}>
      <Stack align="center" mb="xl">
        <Title order={2} fw={700}>Create an Account</Title>
        <Text c="dimmed" size="sm">Start your food discovery journey today</Text>
      </Stack>

      {(validationError || registerError) && (
        <Alert color="red" mb="md" variant="light">
          {validationError || registerError}
        </Alert>
      )}

      <form onSubmit={handleRegister}>
        <Stack spacing="md">
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            required
          />

          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            required
          />

          <Button 
            type="submit" 
            fullWidth 
            mt="xl" 
            loading={loading}
            color="brand.8"
            radius="xl"
          >
            Sign Up
          </Button>

          <Center mt="md">
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor size="sm" fw={700} href="/auth/login">
                Sign In
              </Anchor>
            </Text>
          </Center>
        </Stack>
      </form>
    </Paper>
  );
}
