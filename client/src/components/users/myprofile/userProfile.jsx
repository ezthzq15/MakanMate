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
  rem
} from '@mantine/core';
import { IconCamera, IconEye, IconEyeOff, IconTrash } from '@tabler/icons-react';

const UserProfile = ({ profile, onSave, onCancel, loading }) => {
  const [name, setName] = React.useState(profile?.name || '');
  const [password, setPassword] = React.useState('');

  return (
    <Container size="sm" py={50}>
      {/* Header Section */}
      <Group mb={40} gap="xl">
        <Box style={{ position: 'relative' }}>
          <Avatar 
            size={120} 
            radius="100%" 
            src={null} // Can add photo logic later
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
          <Title order={1} style={{ fontSize: '32px', fontWeight: 800 }}>Manage Profile</Title>
          <Text style={{ color: 'var(--mm-text-dimmed)' }}>Update your personal culinary identity</Text>
        </Box>
      </Group>

      <Stack gap={30}>
        {/* Personal Details Section */}
        <Paper p="32px" radius="32px" style={{ backgroundColor: 'rgba(15, 76, 92, 0.03)', border: 'none' }}>
          <Title order={3} size="lg" mb="xl" style={{ color: '#0f4c5c', fontWeight: 700 }}>Personal Details</Title>
          <Stack gap="lg">
            <TextInput
              label="FULL NAME"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.currentTarget.value)}
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: '#EFEFEF', border: 'none' },
                label: { fontSize: '12px', fontWeight: 800, color: '#666', marginBottom: '8px' }
              }}
            />
            <TextInput
              label="EMAIL ADDRESS"
              value={profile?.email || ''}
              readOnly
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: '#EFEFEF', border: 'none', color: '#888' },
                label: { fontSize: '12px', fontWeight: 800, color: '#666', marginBottom: '8px' }
              }}
            />
          </Stack>
        </Paper>

        {/* Security Section */}
        <Paper p="32px" radius="32px" style={{ backgroundColor: 'rgba(15, 76, 92, 0.03)', border: 'none' }}>
          <Group justify="space-between" mb="xl">
            <Title order={3} size="lg" style={{ color: '#0f4c5c', fontWeight: 700 }}>Security</Title>
            <Badge color="rgba(15, 76, 92, 0.1)" size="sm" style={{ color: '#0f4c5c' }}>Last changed 3 months ago</Badge>
          </Group>
          <Stack gap="lg">
            <PasswordInput
              label="CURRENT PASSWORD"
              placeholder="••••••••••••"
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: '#EFEFEF', border: 'none' },
                label: { fontSize: '12px', fontWeight: 800, color: '#666', marginBottom: '8px' }
              }}
            />
            <PasswordInput
              label="NEW PASSWORD"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.currentTarget.value)}
              radius="xl"
              size="lg"
              styles={{
                input: { backgroundColor: '#EFEFEF', border: 'none' },
                label: { fontSize: '12px', fontWeight: 800, color: '#666', marginBottom: '8px' }
              }}
            />
          </Stack>
        </Paper>

        {/* Notification Preferences Section */}
        <Paper p="32px" radius="32px" style={{ backgroundColor: 'rgba(15, 76, 92, 0.03)', border: 'none' }}>
           <Title order={3} size="lg" mb="xl" style={{ color: '#0f4c5c', fontWeight: 700 }}>Notification Preferences</Title>
           <Stack gap="md">
              <Paper p="md" radius="lg" withBorder style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Text fw={700}>Recipe Recommendations</Text>
                  <Text size="xs" color="dimmed">Weekly curated lists based on your taste</Text>
                </Box>
                <Switch size="md" color="#0f4c5c" defaultChecked />
              </Paper>
              <Paper p="md" radius="lg" withBorder style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Text fw={700}>Order Updates</Text>
                  <Text size="xs" color="dimmed">Real-time tracking of your meal deliveries</Text>
                </Box>
                <Switch size="md" color="#0f4c5c" defaultChecked />
              </Paper>
           </Stack>
        </Paper>

        {/* Action Buttons */}
        <Group grow gap="xl" mt="xl">
          <Button 
            size="xl" 
            radius="xl" 
            color="#0f4c5c" 
            style={{ height: '60px' }}
            loading={loading}
            onClick={() => onSave({ name, password })}
          >
            Save Changes
          </Button>
          <Button 
            size="xl" 
            radius="xl" 
            variant="filled" 
            color="#EFE6D4" 
            style={{ height: '60px', color: '#5D5D5D' }}
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
