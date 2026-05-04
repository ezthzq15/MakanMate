import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const mainLinks = [
    { label: 'Dashboard', icon: IconLayoutDashboard, path: '/admin/dashboard', matchPaths: ['/admin', '/admin/dashboard'] },
    { label: 'Stall Management', icon: IconBuildingStore, path: '/admin/stalls', matchPaths: ['/admin/stalls'] },
    { label: 'User Management', icon: IconUsers, path: '/admin/users', matchPaths: ['/admin/users'] },
    // { label: 'Settings', icon: IconSettings, path: '/admin/settings', matchPaths: ['/admin/settings'] },
  ];

  const bottomLinks = [
    // { label: 'Help Center', icon: IconHelpCircle, path: '/admin/help' },
    { label: 'Logout', icon: IconLogout, action: handleLogout },
  ];

  return (
    <Box 
      style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: 'var(--mm-admin-sidebar-bg)', 
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
      <Stack gap={8} style={{ flex: 1 }}>
        {mainLinks.map((link) => {
          const isActive = link.matchPaths
            ? link.matchPaths.includes(currentPath)
            : currentPath === link.path;
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
              // Applying hover styles manually if Mantine style prop doesn't handle pseudo-classes well in this version
              sx={(theme) => ({
                '&:hover': {
                   backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                }
              })}
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

      {/* Action Button */}
      {/* <Box mb={40}>
        <Button 
          fullWidth 
          radius="xl" 
          size="md"
          leftSection={<IconPlus size={18} />}
          style={{ 
            backgroundColor: 'var(--mm-admin-accent)', 
            color: 'var(--mm-admin-sidebar)',
            fontWeight: 700,
            fontSize: '14px'
          }}
          onClick={() => navigate('/admin/stalls/new')}
        >
          Add New Stall
        </Button>
      </Box> */}

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

export default AdminNavbar;