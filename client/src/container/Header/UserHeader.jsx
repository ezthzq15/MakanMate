import React from 'react';
import { Group, ActionIcon, Text, Container, Box, Image, Menu, Button, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconUser, IconSearch, IconLogout, IconUserCircle, IconSun, IconMoon } from '@tabler/icons-react';
import { logout, isAuthenticated } from '../../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const isAuth = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Home', link: '/home' },
    { label: 'Search', link: '/search', authRequired: true },
    { label: 'Makan Mate', isLogo: true },
    { label: 'Map', link: '/map' },
    { label: 'Bookmarks', link: '/bookmarks', authRequired: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.authRequired || isAuth);

  return (
    <Box 
      component="header" 
      style={{ 
        height: '90px', 
        borderBottom: '1px solid var(--mm-border-color)', 
        backgroundColor: 'var(--mm-bg-header)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <Container fluid px={40} style={{ width: '100%' }}>
        <Group justify="space-between" align="center" style={{ width: '100%' }}>
          {/* User Menu or Login Button */}
          {isAuth ? (
            <Menu shadow="md" width={220} position="bottom-start" transitionProps={{ transition: 'pop-top-left' }} radius="md" withArrow>
              <Menu.Target>
                <ActionIcon 
                  variant="subtle" 
                  size={42} 
                  style={{ 
                    backgroundColor: 'var(--mantine-color-default)', 
                    borderRadius: '12px',
                    border: 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <IconUser size={22} color="var(--mantine-color-text)" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown p="xs">
                <Menu.Label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mantine-color-dimmed)' }}>Application</Menu.Label>
                <Menu.Item 
                  leftSection={<IconUser size={18} stroke={1.5} />}
                  onClick={() => navigate('/profile')}
                  style={{ fontSize: '14px', fontWeight: 500, padding: '10px 12px' }}
                >
                  My Profile
                </Menu.Item>
                
                <Menu.Item
                  leftSection={computedColorScheme === 'dark' ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
                  onClick={toggleColorScheme}
                  style={{ fontSize: '14px', fontWeight: 500, padding: '10px 12px' }}
                >
                  {computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Menu.Item>

                <Menu.Divider my="sm" />

                <Menu.Label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mantine-color-dimmed)' }}>Exit</Menu.Label>
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={18} stroke={1.5} />}
                  onClick={handleLogout}
                  style={{ fontSize: '14px', fontWeight: 500, padding: '10px 12px' }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button 
              variant="filled" 
              radius="xl"
              px={25}
              style={{ backgroundColor: 'var(--mm-color-primary)', fontWeight: 700 }}
              onClick={() => navigate('/auth/login')}
            >
              Login
            </Button>
          )}

          {/* Navigation (Center) */}
          <Group gap={60} align="center">
            {filteredNavItems.map((item, index) => {
              if (item.isLogo) {
                return (
                  <Text 
                    key={index}
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: 900, 
                      letterSpacing: '1px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--mm-color-primary)',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    Makan Mate
                  </Text>
                );
              }
              return (
                <Text 
                  key={index} 
                  component={Link} 
                  to={item.link}
                  style={{ 
                    fontWeight: 500, 
                    color: 'var(--mm-text-main)', 
                    fontSize: '16px',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </Text>
              );
            })}
          </Group>

          {/* Search Icon (Right) */}
          <ActionIcon 
            variant="light" 
            size="xl" 
            radius="md" 
            color="gray"
            onClick={() => navigate('/search')}
            style={{ backgroundColor: 'var(--mm-bg-body)', border: 'none' }}
          >
            <IconSearch size={24} color="var(--mm-text-main)" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
