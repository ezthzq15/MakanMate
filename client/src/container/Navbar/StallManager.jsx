import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Stack, Title, Text, UnstyledButton, Group } from '@mantine/core';
import { 
  IconLayoutDashboard, 
  IconBuildingStore, 
  IconToolsKitchen2, 
  IconTicket,
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
    { label: 'Vouchers', icon: IconTicket, path: '/stall/vouchers' },
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
      <Stack gap={8} style={{ flex: 1 }}>
        {mainLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <UnstyledButton
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '16px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateX(4px)',
                }
              }}
              // Manual hover logic for styles
              sx={{
                '&:hover': {
                   backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              {/* Active indicator pill */}
              {isActive && (
                <Box 
                  style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '25%', 
                    height: '50%', 
                    width: '4px', 
                    backgroundColor: '#fff', 
                    borderRadius: '0 4px 4px 0' 
                  }} 
                />
              )}

              <Group gap="md" wrap="nowrap">
                <link.icon 
                  size={22} 
                  stroke={isActive ? 2 : 1.5} 
                  color={isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)'} 
                  style={{ transition: 'transform 0.2s ease' }}
                />
                <Text 
                  fw={isActive ? 800 : 500} 
                  size="sm" 
                  style={{ 
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: isActive ? '0.3px' : '0'
                  }}
                >
                  {link.label}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* Bottom Navigation */}
      <Stack gap={8}>
        {bottomLinks.map((link) => (
          <UnstyledButton
            key={link.label}
            onClick={link.action || (() => navigate(link.path))}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '16px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            <Group gap="md">
              <link.icon size={22} stroke={1.5} color="rgba(255, 255, 255, 0.5)" />
              <Text fw={500} size="sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
