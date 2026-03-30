import React from 'react';
import { Box, Group, Title, Text, ActionIcon, Avatar, Indicator, Stack, Menu, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconBell, IconSun, IconMoon, IconLogout } from '@tabler/icons-react';
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
  
  // Extract Initials (e.g. "Aiman Haiqal" -> "AH")
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
        height: '100px', 
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Group justify="space-between" align="center" style={{ width: '100%' }}>
        {/* Welcome Section */}
        <Stack gap={2}>
          <Title order={1} style={{ fontSize: '26px', fontWeight: 800, color: 'var(--mm-admin-sidebar)' }}>
            System Overview
          </Title>
          <Text size="sm" style={{ color: 'var(--mm-admin-text-dimmed)', fontWeight: 500 }}>
            Welcome back, {userName.split(' ')[0]}. Here's what's happening today.
          </Text>
        </Stack>

        {/* Right Section: Notification & Profile */}
        <Group gap="xl">
          <Indicator color="#A48B5D" size={8} offset={4} withBorder>
            <ActionIcon 
              variant="subtle" 
              size={44} 
              radius="xl"
              style={{ backgroundColor: 'var(--mm-bg-surface)' }}
            >
              <IconBell size={22} color="var(--mm-admin-sidebar)" stroke={1.5} />
            </ActionIcon>
          </Indicator>

          <Menu shadow="md" width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }} radius="md" withArrow>
            <Menu.Target>
              <Group 
                gap="sm" 
                style={{ 
                  backgroundColor: 'var(--mm-bg-surface)', 
                  padding: '6px 16px 6px 6px', 
                  borderRadius: '32px',
                  cursor: 'pointer',
                  boxShadow: 'var(--mm-shadow)'
                }}
              >
                <Avatar 
                  radius="xl" 
                  size={32}
                  color="olive"
                  variant="filled"
                  style={{ fontWeight: 700 }}
                >
                  {getInitials(userName)}
                </Avatar>
                <Text fw={700} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>
                  {userName}
                </Text>
              </Group>
            </Menu.Target>

            <Menu.Dropdown p="xs">
              <Menu.Label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mantine-color-dimmed)' }}>Application</Menu.Label>
              
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
        </Group>
      </Group>
    </Box>
  );
};

export default AdminHeader;
