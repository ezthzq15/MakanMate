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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error: loginError } = useLogin({
    onMutate: () => {
      // You can add additional state here if needed when login start
    },
    onSuccess: (data) => {
      // Redirect to home without waiting inside handleLogin
      window.location.href = '/'; 
    },
    onError: (err) => {
      // The error is already handled by the hook state (loginError)
      // but you can fire additional side effects here if you want
      console.error('Login failed', err);
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // We no longer need to await result or manually redirect here
    // as it is handled automatically by the onSuccess callback in the hook
    login(email, password);
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
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />

          <Stack spacing={8}>
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
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