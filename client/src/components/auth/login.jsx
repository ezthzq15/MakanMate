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
  Group,
} from '@mantine/core';
import { useLogin } from '../../hooks/auth/useLogin';

export function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const { login, loading, error: loginError } = useLogin({
    onMutate: () => {
      // You can add additional state here if needed when login start
    },
    onSuccess: (data) => {
      // Role-based redirection
      const role = data.user?.userRole || 'user';
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/'; 
      }
    },
    onError: (err) => {
      // The error is already handled by the hook state (loginError)
      // but you can fire additional side effects here if you want
      console.error('Login failed', err);
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userEmail || !userPassword) return;

    login(userEmail, userPassword);
  };

  return (
    <Paper className="login-card" withBorder={false}>
      <Stack align="center" mb={30}>
        <Title order={2} fw={700}>
          Welcome Back!!
        </Title>
        <Text c="dimmed" size="sm">
          Sign in to continue your food journey
        </Text>
      </Stack>

      {loginError && (
        <Alert color="red" mb="md" variant="light">
          {loginError}
        </Alert>
      )}

      <form onSubmit={handleLogin}>
        <Stack spacing={20}>
          <TextInput
            label="Email"
            placeholder="@gmail.com"
            value={userEmail}
            onChange={(event) => setUserEmail(event.currentTarget.value)}
            required
          />

          <Stack spacing={8}>
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={userPassword}
              onChange={(event) => setUserPassword(event.currentTarget.value)}
              required
            />
            <Group justify="flex-end">
              <Anchor component="button" size="xs" c="dimmed">
                Forgot your password?
              </Anchor>
            </Group>
          </Stack>

          <Button 
            type="submit" 
            fullWidth 
            mt="md" 
            loading={loading}
          >
            Sign In
          </Button>

          <Center mt="sm">
            <Text size="sm" c="dimmed">
              Don't have an account?{' '}
              <Anchor size="sm" fw={700} href="/auth/signup" c="#5b9bd5">
                Sign Up
              </Anchor>
            </Text>
          </Center>

          <Center mt={-5}>
            <Anchor component="button" size="sm" c="dimmed">
              Continue as a guest
            </Anchor>
          </Center>
        </Stack>
      </form>
    </Paper>
  );
}