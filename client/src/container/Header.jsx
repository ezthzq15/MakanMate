import React from 'react';
import { Group, ActionIcon, Text, Container, Box, Image, Menu, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconUser, IconSearch, IconLogout, IconUserCircle, IconSun, IconMoon } from '@tabler/icons-react';
import { logout } from '../utils/auth';

const Header = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const handleLogout = () => {
    logout();
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Home', link: '/home' },
    { label: 'Search', link: '/search' },
    { label: 'Makan Mate', isLogo: true },
    { label: 'Map', link: '/map' },
    { label: 'Bookmarks', link: '/bookmarks' },
  ];

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
          {/* User Menu (Left) */}
          <Menu shadow="md" width={200} position="bottom-start" transitionProps={{ transition: 'pop-top-left' }}>
            <Menu.Target>
              <ActionIcon 
                variant="light" 
                size="xl" 
                radius="md" 
                color="gray"
                style={{ backgroundColor: 'var(--mm-bg-body)', border: 'none' }}
              >
                <IconUser size={24} color="var(--mm-text-main)" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item 
                leftSection={<IconUserCircle size={16} stroke={1.5} />}
                onClick={() => window.location.href = '/profile'}
              >
                My Profile
              </Menu.Item>
              
              <Menu.Item
                leftSection={computedColorScheme === 'dark' ? <IconSun size={16} stroke={1.5} /> : <IconMoon size={16} stroke={1.5} />}
                onClick={toggleColorScheme}
              >
                {computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Exit</Menu.Label>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Navigation (Center) */}
          <Group gap={60} align="center">
            {navItems.map((item, index) => {
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
                  component="a" 
                  href={item.link}
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
