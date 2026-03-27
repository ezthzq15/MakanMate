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
  const { register, loading, error: registerError } = useRegister({
    onSuccess: () => {
      window.location.href = '/auth/login'; // Redirect to login on success
    }
  });

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

    register(name, email, password);
  };

  return (
    <Paper className="login-card" withBorder={false}>
      <Stack align="center" mb={30}>
        <Title order={2} fw={700}>Create an Account</Title>
        <Text c="dimmed" size="sm">Join MakanMate and discover great food</Text>
      </Stack>

      {(validationError || registerError) && (
        <Alert color="red" mb="md" variant="light">
          {validationError || registerError}
        </Alert>
      )}

      <form onSubmit={handleRegister}>
        <Stack spacing={20}>
          <TextInput
            label="Full Name"
            placeholder="John Hamsten"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            required
          />

          <TextInput
            label="Email"
            placeholder="@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••••••••"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
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
