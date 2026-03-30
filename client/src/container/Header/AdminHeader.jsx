import React from 'react';
import { Box, Group, Title, Text, ActionIcon, Avatar, Indicator, Stack } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { getAuthUser } from '../../utils/auth';

const AdminHeader = () => {
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
              style={{ backgroundColor: '#fff' }}
            >
              <IconBell size={22} color="var(--mm-admin-sidebar)" stroke={1.5} />
            </ActionIcon>
          </Indicator>

          <Group 
            gap="sm" 
            style={{ 
              backgroundColor: '#fff', 
              padding: '6px 16px 6px 6px', 
              borderRadius: '32px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
        </Group>
      </Group>
    </Box>
  );
};

export default AdminHeader;
