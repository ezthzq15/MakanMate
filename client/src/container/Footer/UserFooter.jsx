import React from 'react';
import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { IconCompass, IconSearch, IconHome, IconBookmark, IconUser } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isAuth = isAuthenticated();

  const allLinks = [
    { label: 'MAP',       icon: IconCompass,  path: '/map',       guestAllowed: true  },
    { label: 'SEARCH',    icon: IconSearch,   path: '/search',    guestAllowed: false },
    { label: 'HOME',      icon: IconHome,     path: '/home',      guestAllowed: false },
    { label: 'BOOKMARKS', icon: IconBookmark, path: '/bookmarks', guestAllowed: false },
    { label: 'PROFILE',   icon: IconUser,     path: '/profile',   guestAllowed: false },
  ];

  // Guests only see MAP; logged-in users see everything
  const links = isAuth ? allLinks : allLinks.filter(l => l.guestAllowed);

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: '#fbfaf5',
        borderTop: '1px solid #e9ecef',
        padding: '10px 0 12px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}
    >
      <Group
        justify={links.length === 1 ? 'center' : 'space-between'}
        align="center"
        gap={0}
        style={{ maxWidth: 600, margin: '0 auto', width: '100%', paddingInline: 16 }}
      >
        {links.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Box key={link.label} style={{ flex: links.length === 1 ? 'none' : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UnstyledButton
                onClick={() => navigate(link.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  color: isActive ? 'var(--mm-color-primary, #3b5d4f)' : '#6c757d',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: '4px 12px',
                }}
              >
                <link.icon size={22} stroke={isActive ? 2 : 1.5} />
                <Text size="xs" fw={700} style={{ letterSpacing: '0.5px', fontSize: '10px' }}>
                  {link.label}
                </Text>
                {isActive && (
                  <Box
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: 'var(--mm-color-primary, #3b5d4f)',
                      position: 'absolute',
                      bottom: -2,
                    }}
                  />
                )}
              </UnstyledButton>
            </Box>
          );
        })}
      </Group>
    </Box>
  );
};

export default Footer;
