import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Group,
  Center,
  Box,
  Progress,
  useMantineTheme,
  Alert,
} from '@mantine/core';
import { IconMail, IconKey, IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { TwoFactorForm } from './2FA';
import useForgotPassword from '../../hooks/auth/useForgotPassword';

export function ForgotPassword() {
  const theme = useMantineTheme();
  const {
    step,
    isLoading,
    findAccountForm,
    handleFindAccount,
    handleVerifyCode,
    resetPasswordForm,
    handleResetPassword,
    handleReturnToLogin,
    timer,
    canResend,
    handleResend,
    otpError,
    resetPasswordError,
  } = useForgotPassword();

  const checks = [
    { label: 'At least 8 characters', re: /[a-zA-Z0-9\W]{8,}/ },
    { label: 'Uppercase letter (A-Z)', re: /[A-Z]/ },
    { label: 'Lowercase letter (a-z)', re: /[a-z]/ },
    { label: 'Number (0-9)', re: /[0-9]/ },
    { label: 'Symbol (!@#$%...)', re: /[^a-zA-Z0-9]/ },
  ];

  const getStrength = (password) => {
    let multiplier = password.length > 5 ? 0 : 1;
    checks.forEach((check) => {
      if (!check.re.test(password)) {
        multiplier += 1;
      }
    });
    return Math.max(100 - (100 / (checks.length + 1)) * multiplier, 10);
  };

  const strength = getStrength(resetPasswordForm.values.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const renderFindAccount = () => (
    <Box p={{ base: 30, sm: 50 }} w={{ base: '90%', xs: '85%', sm: 550 }} style={{ backgroundColor: 'var(--mm-bg-surface)', borderRadius: '24px', boxShadow: 'var(--mm-shadow)' }}>
      <Group justify="flex-start" mb="md">
        <Button 
          variant="light" 
          color="gray"
          leftSection={<IconArrowLeft size={14} />} 
          onClick={handleReturnToLogin} 
          size="xs"
          radius="xl"
          style={{ fontWeight: 600, color: 'var(--mm-text-dimmed)' }}
        >
          Back to Login
        </Button>
      </Group>
      <Center mb="md">
        <Box p="sm" bg="rgba(10, 67, 55, 0.1)" style={{ borderRadius: '50%' }}>
          <IconKey size={32} color="#0A4337" />
        </Box>
      </Center>
      <Title order={2} ta="center" mb="sm" style={{ color: 'var(--mm-text-main)' }}>Find Your Account</Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Enter your email address to receive a password reset verification code.
      </Text>

      <form onSubmit={findAccountForm.onSubmit(handleFindAccount)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            withAsterisk
            placeholder="Your email address"
            {...findAccountForm.getInputProps('usr_email')}
            leftSection={<IconMail size={16} />}
            size="md"
            styles={{
              label: { fontWeight: 600, marginBottom: '8px' },
              input: { borderRadius: '12px', '&:focus': { borderColor: 'var(--mm-color-primary)' } }
            }}
          />
          <Button fullWidth type="submit" loading={isLoading} size="lg" radius="xl" mt="md" style={{ backgroundColor: 'var(--mm-color-primary)', fontWeight: 800 }}>
            Send Verification Code
          </Button>
        </Stack>
      </form>
    </Box>
  );

  const renderVerifyCode = () => (
    <TwoFactorForm
      onSubmit={handleVerifyCode}
      isLoading={isLoading}
      onResend={handleResend}
      error={otpError}
      timer={timer}
      canResend={canResend}
    />
  );

  const renderResetPassword = () => (
    <Box p={{ base: 30, sm: 50 }} w={{ base: '90%', xs: '85%', sm: 550 }} style={{ backgroundColor: 'var(--mm-bg-surface)', borderRadius: '24px', boxShadow: 'var(--mm-shadow)' }}>
      <Center mb="md">
        <Box p="sm" bg="rgba(10, 67, 55, 0.1)" style={{ borderRadius: '50%' }}>
          <IconKey size={32} color="#0A4337" />
        </Box>
      </Center>
      <Title order={2} ta="center" mb="sm" style={{ color: 'var(--mm-text-main)' }}>Create New Password</Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Your new password must be different from previous used passwords.
      </Text>

      <form onSubmit={resetPasswordForm.onSubmit(handleResetPassword)}>
        <Stack gap="md">
          {resetPasswordError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
              {resetPasswordError}
            </Alert>
          )}

          <PasswordInput
            label="New Password"
            withAsterisk
            placeholder="New Password"
            {...resetPasswordForm.getInputProps('password')}
            size="md"
            styles={{
              label: { fontWeight: 600, marginBottom: '8px' },
              input: { borderRadius: '12px', '&:focus': { borderColor: 'var(--mm-color-primary)' } }
            }}
          />

          <PasswordInput
            label="Confirm New Password"
            withAsterisk
            placeholder="Confirm New Password"
            {...resetPasswordForm.getInputProps('confirmPassword')}
            size="md"
            styles={{
              label: { fontWeight: 600, marginBottom: '8px' },
              input: { borderRadius: '12px', '&:focus': { borderColor: 'var(--mm-color-primary)' } }
            }}
          />

          <Box mt="xs">
            <Group justify="space-between" mb={5}>
              <Text component="span" c="dimmed" size="xs">
                Must include: Uppercase, Lowercase, Number, Symbol (min 8 chars)
              </Text>
            </Group>
            <Progress color={color} value={strength} size={5} mb={5} />
            <Group justify="space-between" mb={10}>
              <Text size="xs" c={strength === 100 ? 'teal' : 'dimmed'}>
                {strength === 100 ? 'Strong Password ✓' : 'Weak Password'}
              </Text>
            </Group>
          </Box>

          <Button fullWidth type="submit" loading={isLoading} size="lg" radius="xl" mt="md" style={{ backgroundColor: 'var(--mm-color-primary)', fontWeight: 800 }}>
            Reset Password
          </Button>
        </Stack>
      </form>
    </Box>
  );

  return (
    <Center style={{ minHeight: '100vh', backgroundColor: '#0A4337', background: 'radial-gradient(circle at top right, #1d6e5d 0%, #0A4337 45%, #05261f 100%)' }}>
      {step === 'find-account' && renderFindAccount()}
      {step === 'verify-code' && renderVerifyCode()}
      {step === 'reset-password' && renderResetPassword()}
    </Center>
  );
}
