import React from 'react';
import { Group, ActionIcon, Text, Container, Box, Image } from '@mantine/core';
import { IconUser, IconSearch } from '@tabler/icons-react';

const Header = () => {
  const navItems = [
    { label: 'Home', link: '/' },
    { label: 'Search', link: '/search' },
    { label: 'Logo', isLogo: true },
    { label: 'Map', link: '/map' },
    { label: 'Bookmarks', link: '/bookmarks' },
  ];

  return (
    <Box 
      component="header" 
      style={{ 
        height: '80px', 
        borderBottom: '1px solid #f0f0f0', 
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container size="xl" style={{ width: '100%' }}>
        <Group justify="space-between" align="center" style={{ width: '100%' }}>
          {/* User Icon (Left) */}
          <ActionIcon 
            variant="light" 
            size="lg" 
            radius="md" 
            color="gray"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <IconUser size={20} color="#333" stroke={1.5} />
          </ActionIcon>

          {/* Navigation (Center) */}
          <Group gap={40} align="center">
            {navItems.map((item, index) => {
              if (item.isLogo) {
                return (
                  <Box key={index} style={{ cursor: 'pointer' }}>
                    <Image 
                      src="/logoMakanMate.png" 
                      alt="MakanMate Logo" 
                      h={45} 
                      w="auto" 
                      fit="contain"
                    />
                  </Box>
                );
              }
              return (
                <Text 
                  key={index} 
                  component="a" 
                  href={item.link}
                  style={{ 
                    fontWeight: 500, 
                    color: '#444', 
                    fontSize: '15px',
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
            size="lg" 
            radius="md" 
            color="gray"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <IconSearch size={20} color="#333" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
