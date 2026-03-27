import React from 'react';
import { Box, Stack, Title, Text, UnstyledButton, Group, Button, ThemeIcon } from '@mantine/core';
import { 
  IconLayoutDashboard, 
  IconBuildingStore, 
  IconUsers, 
  IconSettings, 
  IconHelpCircle, 
  IconLogout,
  IconPlus
} from '@tabler/icons-react';
import { logout } from '../../utils/auth';

const AdminNavbar = () => {
  const currentPath = window.location.pathname;

  const mainLinks = [
    { label: 'Dashboard', icon: IconLayoutDashboard, path: '/admin/dashboard' },
    { label: 'Stall Management', icon: IconBuildingStore, path: '/admin/stalls' },
    { label: 'User Management', icon: IconUsers, path: '/admin/users' },
    { label: 'Settings', icon: IconSettings, path: '/admin/settings' },
  ];

  const bottomLinks = [
    { label: 'Help Center', icon: IconHelpCircle, path: '/admin/help' },
    { label: 'Logout', icon: IconLogout, action: logout },
  ];

  return (
    <Box 
      style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: '#4D6459', 
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        color: '#fff'
      }}
    >
      {/* Logo Section */}
      <Box mb={60}>
        <Title order={2} style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.5px' }}>
          MakanMate
        </Title>
        <Text size="xs" style={{ opacity: 0.7, fontWeight: 500, marginTop: '2px' }}>
          Admin Console
        </Text>
      </Box>

      {/* Main Navigation */}
      <Stack gap={10} style={{ flex: 1 }}>
        {mainLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <UnstyledButton
              key={link.label}
              onClick={() => window.location.href = link.path}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '24px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Group gap="md">
                <link.icon size={22} stroke={1.5} color={isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)'} />
                <Text fw={isActive ? 700 : 500} size="sm" style={{ color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)' }}>
                  {link.label}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* Action Button */}
      <Box mb={40}>
        <Button 
          fullWidth 
          radius="xl" 
          size="md"
          leftSection={<IconPlus size={18} />}
          style={{ 
            backgroundColor: '#E9E2D0', 
            color: '#4D6459',
            fontWeight: 700,
            fontSize: '14px'
          }}
          onClick={() => window.location.href = '/admin/stalls/new'}
        >
          Add New Stall
        </Button>
      </Box>

      {/* Bottom Navigation */}
      <Stack gap={10}>
        {bottomLinks.map((link) => (
          <UnstyledButton
            key={link.label}
            onClick={link.action || (() => window.location.href = link.path)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '24px',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Group gap="md">
              <link.icon size={22} stroke={1.5} color="rgba(255, 255, 255, 0.7)" />
              <Text fw={500} size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {link.label}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Box>
  );
};

export default AdminNavbar;