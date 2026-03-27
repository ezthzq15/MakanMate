import React from 'react';
import { Container, Group, Text, Stack, SimpleGrid, Box, ActionIcon, Divider } from '@mantine/core';
import { IconBrandInstagram, IconBrandLinkedin, IconBrandFacebook } from '@tabler/icons-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'ABOUT',
      links: [
        { label: 'Home', link: '/' },
        { label: 'Explore', link: '/explore' },
        { label: 'Recommendations', link: '/recommendations' },
        { label: 'Map Views', link: '/map' },
        { label: 'Planned Food Hunt', link: '/planned' },
      ],
    },
    {
      title: 'ABOUT',
      links: [
        { label: 'Home', link: '/' },
        { label: 'Explore', link: '/explore' },
        { label: 'Recommendations', link: '/recommendations' },
        { label: 'Map Views', link: '/map' },
        { label: 'Planned Food Hunt', link: '/planned' },
      ],
    },
    {
      title: 'ABOUT',
      links: [
        { label: 'Home', link: '/' },
        { label: 'Explore', link: '/explore' },
        { label: 'Recommendations', link: '/recommendations' },
        { label: 'Map Views', link: '/map' },
        { label: 'Planned Food Hunt', link: '/planned' },
      ],
    },
  ];

  return (
    <Box component="footer" style={{ backgroundColor: '#000', color: '#fff', paddingTop: '60px', paddingBottom: '30px' }}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {/* Logo and Description Section */}
          <Stack gap="md">
            <Text 
              style={{ 
                fontSize: '32px', 
                fontWeight: 900, 
                letterSpacing: '2px',
                fontFamily: 'Inter, sans-serif',
                WebkitTextStroke: '1px white',
                color: 'transparent',
                lineHeight: 1
              }}
            >
              MAKANMATE
            </Text>
            <Text size="sm" style={{ color: '#aaa', maxWidth: '300px', lineHeight: 1.6 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Group gap="sm">
              <ActionIcon variant="transparent" color="white" size="lg">
                <IconBrandInstagram size={24} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="transparent" color="white" size="lg">
                <IconBrandLinkedin size={24} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="transparent" color="white" size="lg">
                <IconBrandFacebook size={24} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* Link Columns */}
          {footerLinks.map((column, index) => (
            <Stack key={index} gap="lg">
              <Text size="md" fw={700} style={{ letterSpacing: '1px' }}>
                {column.title}
              </Text>
              <Stack gap="xs">
                {column.links.map((link, linkIndex) => (
                  <Text 
                    key={linkIndex} 
                    component="a" 
                    href={link.link} 
                    size="sm" 
                    style={{ color: '#aaa', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {link.label}
                  </Text>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my="xl" color="rgba(255, 255, 255, 0.1)" style={{ marginTop: '80px' }} />

        <Group justify="space-between" mt="md">
          <Text size="xs" style={{ color: '#777' }}>
            © {new Date().getFullYear()} MakanMate. All Rights Reserved.
          </Text>
          <Group gap="xl">
            <Text size="xs" component="a" href="/terms" style={{ color: '#777', textDecoration: 'none' }}>
              Terms & Conditions
            </Text>
            <Text size="xs" style={{ color: '#777' }}>•</Text>
            <Text size="xs" component="a" href="/privacy" style={{ color: '#777', textDecoration: 'none' }}>
              Privacy Policy
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
