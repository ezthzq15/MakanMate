import React from 'react';
import { Box, Group, Text, Avatar, Menu, useMantineColorScheme, useComputedColorScheme, UnstyledButton } from '@mantine/core';
import { IconSun, IconMoon, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { getAuthUser, logout } from '../../utils/auth';

const AdminHeader = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const handleLogout = () => {
    logout();
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const user = getAuthUser();
  const userName = user?.userName || 'Admin User';
  
  // Extract Initials (e.g. "Super Admin" -> "SA")
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Box 
      component="header" 
      style={{ 
        height: '80px', 
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'var(--mantine-color-body)',
        borderBottom: '1px solid var(--mantine-color-default-border)'
      }}
    >
      <Menu shadow="md" width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }} radius="md" withArrow>
        <Menu.Target>
          <UnstyledButton>
            <Group 
              gap="sm" 
              style={{ 
                backgroundColor: 'var(--mantine-color-default)', 
                padding: '6px 16px 6px 6px', 
                borderRadius: '32px',
                border: '1px solid var(--mantine-color-default-border)',
                transition: 'background-color 150ms ease',
              }}
            >
              <Avatar 
                radius="xl" 
                size={36}
                color="teal.8"
                variant="filled"
                style={{ fontWeight: 700, backgroundColor: '#1C3B35' }}
              >
                {getInitials(userName)}
              </Avatar>
              <Box>
                <Text fw={700} size="sm" style={{ color: 'var(--mantine-color-text)', lineHeight: 1.2 }}>
                  {userName}
                </Text>
                <Text size="xs" c="dimmed" fw={600} style={{ lineHeight: 1.2 }}>
                  Admin Console
                </Text>
              </Box>
              <IconChevronDown size={16} color="var(--mantine-color-dimmed)" />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown p="xs">
          <Menu.Label style={{ fontSize: '12px', fontWeight: 600 }}>Preferences</Menu.Label>
          
          <Menu.Item
            leftSection={computedColorScheme === 'dark' ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
            onClick={toggleColorScheme}
            style={{ fontSize: '14px', fontWeight: 500, padding: '10px 12px' }}
          >
            {computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Menu.Item>

          <Menu.Divider my="sm" />

          <Menu.Label style={{ fontSize: '12px', fontWeight: 600 }}>Account</Menu.Label>
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
    </Box>
  );
};

export default AdminHeader;
