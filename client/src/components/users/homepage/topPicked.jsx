import React from 'react';
import { 
  Box, 
  Container, 
  Title, 
  Text, 
  Image, 
  Badge, 
  Group, 
  Stack, 
  Paper,
  SimpleGrid
} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

const TopPicked = ({ data }) => {
  const featured = data?.featuredItem;
  if (!featured) return null;

  const topPicked = featured.topPicked?.length > 0 ? featured.topPicked : [
    { label: "Chef's Special", image: featured.mainImage || '/cendol.png' },
  ];

  return (
    <Container size="xl" my={60}>
      {/* Single compact card matching the reference */}
      <Paper
        radius="2rem"
        withBorder
        shadow="sm"
        style={{ overflow: 'hidden' }}
        p={0}
      >
        <Group gap={0} align="stretch" wrap="nowrap">

          {/* LEFT: Image with badge overlays */}
          <Box style={{ position: 'relative', flexShrink: 0, width: '42%', minHeight: 340 }}>
            <Image
              src={featured.mainImage || '/cendol.png'}
              h="100%"
              w="100%"
              style={{ objectFit: 'cover', display: 'block' }}
              fallbackSrc="https://placehold.co/500x400?text=Stall"
            />
            {/* Badges top-right */}
            <Group gap="xs" style={{ position: 'absolute', top: 20, right: 20 }}>
              {featured.isMuslimFriendly && (
                <Badge
                  color="yellow.4"
                  size="lg"
                  radius="sm"
                  fw={700}
                  style={{ color: '#333', padding: '10px 14px', height: 'auto' }}
                >
                  Muslim Friendly
                </Badge>
              )}
              <Badge
                color="gray.1"
                size="lg"
                radius="sm"
                fw={800}
                leftSection={<IconStar size={14} fill="#fab005" color="#fab005" />}
                style={{ color: '#1a1a1a', padding: '10px 14px', height: 'auto' }}
              >
                {featured.rating || '4.5'}
              </Badge>
            </Group>
          </Box>

          {/* RIGHT: Info section */}
          <Stack gap="lg" p="2rem" style={{ flex: 1 }} justify="center">
            <Box>
              <Title order={2} fw={900} style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>
                {featured.title}
              </Title>
              <Text mt="sm" c="dimmed" size="sm" style={{ lineHeight: 1.8, maxWidth: 500 }}>
                {featured.description}
              </Text>
            </Box>

            {/* Top Picked items */}
            <Box>
              <Text fw={900} size="lg" mb="md">Top Picked</Text>
              <Group gap={32}>
                {topPicked.slice(0, 3).map((pick, i) => (
                  <Stack key={i} align="center" gap="sm">
                    <Image
                      src={pick.image}
                      h={110}
                      w={110}
                      radius="50%"
                      style={{ objectFit: 'cover', border: '3px solid #f1f3f5' }}
                      fallbackSrc="https://placehold.co/110x110?text=Food"
                    />
                    <Paper
                      px="md"
                      py={6}
                      radius="xl"
                      withBorder
                      style={{ 
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#333',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {pick.label}
                    </Paper>
                  </Stack>
                ))}
              </Group>
            </Box>
          </Stack>

        </Group>
      </Paper>
    </Container>
  );
};

export default TopPicked;
