import React from 'react';
import {
  Group, ActionIcon, Text, Box, Menu, Button,
  useMantineColorScheme, useComputedColorScheme
} from '@mantine/core';
import {
  IconUser, IconSearch, IconLogout, IconSun, IconMoon
} from '@tabler/icons-react';
import { logout, isAuthenticated } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Box
      component="header"
      style={{
        borderBottom: '1px solid var(--mm-border-color)',
        backgroundColor: 'var(--mm-bg-header)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Box
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(12px, 4vw, 40px)',
          height: 'clamp(60px, 10vw, 90px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left — Person icon / Login button */}
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
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <IconUser size={22} color="var(--mantine-color-text)" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown p="xs">
              <Menu.Label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-dimmed)' }}>Application</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={18} stroke={1.5} />}
                onClick={() => navigate('/profile')}
                style={{ fontSize: 14, fontWeight: 500, padding: '10px 12px' }}
              >
                My Profile
              </Menu.Item>
              <Menu.Item
                leftSection={computedColorScheme === 'dark' ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
                onClick={toggleColorScheme}
                style={{ fontSize: 14, fontWeight: 500, padding: '10px 12px' }}
              >
                {computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Menu.Item>
              <Menu.Divider my="sm" />
              <Menu.Label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mantine-color-dimmed)' }}>Exit</Menu.Label>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={18} stroke={1.5} />}
                onClick={handleLogout}
                style={{ fontSize: 14, fontWeight: 500, padding: '10px 12px' }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            variant="filled"
            radius="xl"
            px={20}
            size="sm"
            style={{ backgroundColor: 'var(--mm-color-primary)', fontWeight: 700, flexShrink: 0 }}
            onClick={() => navigate('/auth/login')}
          >
            Login
          </Button>
        )}

        {/* Center — Logo: chunky food-style text */}
        <span
          onClick={() => navigate('/home')}
          style={{
            fontFamily: "'Fredoka One', 'Righteous', cursive",
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 900,
            color: '#ffffff',
            cursor: 'pointer',
            userSelect: 'none',
            letterSpacing: '2px',
            WebkitTextStroke: '3px #1a5c28',
            textShadow: `
              0 0 6px #52c46a,
              0 0 14px #2e7d32,
              3px 3px 0 #0f3d17,
              -1px -1px 0 #0f3d17,
              1px -1px 0 #0f3d17,
              -1px  1px 0 #0f3d17,
               1px  1px 0 #0f3d17
            `,
            display: 'inline-block',
            flexShrink: 0,
          }}
        >
          MakanMate
        </span>

        {/* Right — Search Icon */}
        <ActionIcon
          variant="light"
          size="xl"
          radius="md"
          color="gray"
          onClick={() => navigate('/search')}
          style={{ backgroundColor: 'var(--mm-bg-body)', border: 'none', flexShrink: 0 }}
        >
          <IconSearch size={22} color="var(--mm-text-main)" stroke={1.5} />
        </ActionIcon>
      </Box>
    </Box>
  );
};

export default Header;
