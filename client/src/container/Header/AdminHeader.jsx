import React from 'react';
import { Box, Group, Title, Text, ActionIcon, Avatar, Indicator, Stack } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';

const AdminHeader = () => {
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
            Welcome back, Admin. Here's what's happening today.
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
              cursor: 'pointer'
            }}
          >
            <Avatar 
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png" 
              radius="xl" 
              size={32} 
            />
            <Text fw={700} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>
              Alex Chen
            </Text>
          </Group>
        </Group>
      </Group>
    </Box>
  );
};

export default AdminHeader;
