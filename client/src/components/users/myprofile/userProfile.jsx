import React from 'react';
import { 
  Box, 
  Container, 
  Title, 
  Text, 
  TextInput, 
  PasswordInput, 
  Button, 
  Group, 
  Stack, 
  Avatar, 
  Paper,
  Switch,
  Divider,
  ActionIcon,
  Popover,
  Progress,
  rem
} from '@mantine/core';
import { IconCamera, IconEye, IconEyeOff, IconTrash, IconCheck, IconX } from '@tabler/icons-react';

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

const UserProfile = ({ profile, onSave, onCancel, loading }) => {
  const [userName, setUserName] = React.useState(profile?.userName || '');
  const [userPassword, setUserPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [popoverOpened, setPopoverOpened] = React.useState(false);

  const checks = [
    { label: 'Includes at least 8 characters', meets: userPassword.length >= 8 },
    { label: 'Includes number', meets: /[0-9]/.test(userPassword) },
    { label: 'Includes lowercase letter', meets: /[a-z]/.test(userPassword) },
    { label: 'Includes uppercase letter', meets: /[A-Z]/.test(userPassword) },
    { label: 'Includes special symbol', meets: /[^A-Za-z0-9]/.test(userPassword) },
  ];

  const strength = checks.filter(c => c.meets).length;
  const color = strength === 5 ? 'teal' : strength > 2 ? 'yellow' : 'red';

  const validatePassword = (password) => {
    if (!password) return true; // Optional update
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  React.useEffect(() => {
    if (profile?.userName) {
      setUserName(profile.userName);
    }
  }, [profile]);

  return (
    <Container size="lg" py={20}>
      {/* Header Section */}
      <Group mb={40} gap="xl">
        <Box style={{ position: 'relative' }}>
          <Avatar 
            size={120} 
            radius="100%" 
            src={profile?.profilePic || null}
            styles={{
              root: { border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }
            }}
          />
          <ActionIcon 
            variant="filled" 
            color="#0f4c5c" 
            radius="xl" 
            size="lg"
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0,
              border: '3px solid white' 
            }}
          >
            <IconCamera size={18} />
          </ActionIcon>
        </Box>
        <Box>
          <Title order={1} style={{ fontSize: '32px', fontWeight: 800, color: 'var(--mm-text-main)' }}>Manage Profile</Title>
          <Text style={{ color: 'var(--mm-text-dimmed)' }}>Update your personal culinary identity</Text>
        </Box>
      </Group>

      <Stack gap={30}>
        {/* Personal Details Section */}
        <Paper p="32px" radius="32px" style={{ backgroundColor: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border-color)' }}>
          <Title order={3} size="lg" mb="xl" style={{ color: 'var(--mm-color-primary)', fontWeight: 700 }}>Personal Details</Title>
          <Stack gap="lg">
            <TextInput
              label="FULL NAME"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', color: 'var(--mm-text-main)' },
                label: { fontSize: '12px', fontWeight: 800, color: 'var(--mm-text-dimmed)', marginBottom: '8px' }
              }}
            />
            <TextInput
              label="EMAIL ADDRESS"
              value={profile?.userEmail || ''}
              readOnly
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', color: 'var(--mm-text-dimmed)' },
                label: { fontSize: '12px', fontWeight: 800, color: 'var(--mm-text-dimmed)', marginBottom: '8px' }
              }}
            />
          </Stack>
        </Paper>

        {/* Security Section */}
        <Paper p="32px" radius="32px" style={{ backgroundColor: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border-color)' }}>
          <Group justify="space-between" mb="xl">
            <Title order={3} size="lg" style={{ color: 'var(--mm-color-primary)', fontWeight: 700 }}>Security</Title>
            <Badge color="var(--mm-color-primary-light)" size="sm" style={{ color: 'var(--mm-color-primary)' }}>Last changed 3 months ago</Badge>
          </Group>
          {error && (
            <Text c="red" size="sm" mb="md" fw={700} style={{ paddingLeft: '10px' }}>
              {error}
            </Text>
          )}
          <Stack gap="lg">
            <PasswordInput
              label="CURRENT PASSWORD"
              placeholder="••••••••••••"
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', color: 'var(--mm-text-main)' },
                label: { fontSize: '12px', fontWeight: 800, color: 'var(--mm-text-dimmed)', marginBottom: '8px' }
              }}
            />
            <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }} radius="lg">
              <Popover.Target>
                <PasswordInput
                  label="NEW PASSWORD"
                  placeholder="Min. 8 characters"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.currentTarget.value)}
                  onFocus={() => setPopoverOpened(true)}
                  onBlur={() => setPopoverOpened(false)}
                  radius="xl"
                  size="lg"
                  styles={{
                    input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', color: 'var(--mm-text-main)' },
                    label: { fontSize: '12px', fontWeight: 800, color: 'var(--mm-text-dimmed)', marginBottom: '8px' }
                  }}
                />
              </Popover.Target>
              <Popover.Dropdown p="md" style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
                <Progress color={color} value={strength * 20} size="xs" mb="md" />
                {checks.map((check, index) => (
                  <PasswordRequirement key={index} label={check.label} meets={check.meets} />
                ))}
              </Popover.Dropdown>
            </Popover>
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Group grow gap="xl" mt="xl">
          <Button 
            size="xl" 
            radius="xl" 
            style={{ backgroundColor: 'var(--mm-color-primary)', height: '60px' }}
            loading={loading}
            onClick={() => {
              if (userPassword && !validatePassword(userPassword)) {
                setError('Password must be at least 8 characters, include uppercase, lowercase, number and special character.');
                return;
              }
              setError('');
              onSave({ userName, userPassword });
            }}
          >
            Save Changes
          </Button>
          <Button 
            size="xl" 
            radius="xl" 
            variant="filled" 
            style={{ backgroundColor: 'var(--mm-border-color)', color: 'var(--mm-text-main)', height: '60px' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Group>

        <Divider mt="xl" />
        
        <Group justify="center" mt="md">
          <Button 
            variant="subtle" 
            color="red" 
            leftSection={<IconTrash size={16} />}
            styles={{ root: { '&:hover': { backgroundColor: 'transparent' } } }}
          >
            Deactivate my account
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

// Help helper for Badge if not imported correctly
const Badge = ({ children, color, size, style }) => (
  <Box style={{ 
    backgroundColor: color, 
    borderRadius: '20px', 
    padding: '4px 12px', 
    fontSize: '11px', 
    fontWeight: 700,
    ...style 
  }}>
    {children}
  </Box>
);

export default UserProfile;
