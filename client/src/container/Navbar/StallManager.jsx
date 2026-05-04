import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Stack, Title, Text, UnstyledButton, Group } from '@mantine/core';
import { 
  IconLayoutDashboard, 
  IconBuildingStore, 
  IconToolsKitchen2, 
  IconLogout
} from '@tabler/icons-react';
import { logout } from '../../utils/auth';

const StallManagerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const mainLinks = [
    { label: 'Dashboard', icon: IconLayoutDashboard, path: '/stall/dashboard' },
    { label: 'My Stall', icon: IconBuildingStore, path: '/stall/my' },
    { label: 'Menu Management', icon: IconToolsKitchen2, path: '/stall/menu' },
  ];

  const bottomLinks = [
    { label: 'Logout', icon: IconLogout, action: handleLogout },
  ];

  return (
    <Box 
      style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: '#4D6459', // Dark olive matching admin
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
          Stall Manager
        </Text>
      </Box>

      {/* Main Navigation */}
      <Stack gap={10} style={{ flex: 1 }}>
        {mainLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <UnstyledButton
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '24px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Group gap="md" wrap="nowrap">
                <link.icon size={22} stroke={1.5} color={isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)'} />
                <Text fw={isActive ? 700 : 500} size="sm" style={{ color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)' }}>
                  {link.label}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* Bottom Navigation */}
      <Stack gap={10}>
        {bottomLinks.map((link) => (
          <UnstyledButton
            key={link.label}
            onClick={link.action || (() => navigate(link.path))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '24px',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Group gap="md">
              <link.icon size={22} stroke={1.5} color="rgba(255, 255, 255, 0.6)" />
              <Text fw={500} size="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {link.label}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Box>
  );
};

export default StallManagerNavbar;
