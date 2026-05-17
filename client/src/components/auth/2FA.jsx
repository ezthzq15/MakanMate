import { useState } from 'react';
import {
  Stack,
  Text,
  Button,
  Group,
  PinInput,
  Title,
  Center,
  Box,
  useMantineTheme,
  Alert,
} from '@mantine/core';
import { IconKey, IconAlertCircle } from '@tabler/icons-react';

export function TwoFactorForm({ onSubmit, isLoading, onResend, error, timer, canResend }) {
  const theme = useMantineTheme();
  const [value, setValue] = useState('');

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.length === 6) {
      onSubmit(value);
    }
  };

  return (
    <Box p={{ base: 30, sm: 50 }} w={{ base: '90%', xs: '85%', sm: 550 }} style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 40px 120px rgba(0,0,0,0.1)' }}>
      <Center mb="md">
        <Box p="sm" bg="rgba(10, 67, 55, 0.1)" style={{ borderRadius: '50%' }}>
          <IconKey size={32} color="#0A4337" />
        </Box>
      </Center>
      <Title order={2} ta="center" mb="sm" style={{ color: '#111' }}>
        Two-Step Verification
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Please enter the 6-digit verification code sent to your email.
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="md" align="center">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light" w="100%">
              {error}
            </Alert>
          )}

          <PinInput
            length={6}
            value={value}
            onChange={setValue}
            size="lg"
            placeholder="-"
            disabled={isLoading}
            styles={{ input: { borderColor: '#e0e0e0', '&:focus': { borderColor: '#0A4337' } } }}
          />

          <Button
            fullWidth
            type="submit"
            loading={isLoading}
            disabled={value.length < 6}
            size="lg"
            radius="xl"
            mt="md"
            style={{ backgroundColor: '#094033', fontWeight: 800 }}
          >
            Verify Code
          </Button>

          <Group justify="center" mt="md" gap={5}>
            <Text size="sm" c="dimmed">
              Didn't receive the code?
            </Text>
            {canResend ? (
              <Button
                variant="subtle"
                compact
                onClick={onResend}
                disabled={isLoading}
                style={{ color: '#0A4337' }}
              >
                Resend Code
              </Button>
            ) : (
              <Text size="sm" fw={600} style={{ color: '#0A4337' }}>
                Resend in {formatTime(timer)}
              </Text>
            )}
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
