import React, { useMemo } from 'react';
import { 
  Box, 
  Container, 
  Title, 
  Text, 
  SimpleGrid, 
  Image, 
  Badge, 
  Group, 
  Stack, 
  Paper 
} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

const TopPicked = () => {
  const autoplay = useMemo(() => Autoplay({ 
    delay: 15000, 
    stopOnInteraction: false,
    stopOnMouseEnter: false,
    playOnInit: true
  }), []);

  const stalls = [
    {
      id: 1,
      title: "Teo Chew ChenduL",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      mainImage: '/cendol.png', 
      rating: 4.5,
      isMuslimFriendly: true,
      topPicked: [
        { label: 'Chendul mangga', image: '/cendol.png' },
        { label: 'Laksa Power', image: '/laksa.png' },
        { label: 'Mee Kari Special', image: '/mee kari.png' },
      ]
    },
    {
      id: 2,
      title: "Penang Famous Laksa",
      description: "Experience the authentic taste of Penang Assam Laksa, served hot with fresh mackerel broth and aromatic herbs. A certified local favorite for over 30 years.",
      mainImage: '/laksa.png',
      rating: 4.8,
      isMuslimFriendly: true,
      topPicked: [
        { label: 'Big Bowl Laksa', image: '/laksa.png' },
        { label: 'Fried Spring Roll', image: '/3gmbrmakanan.png' },
        { label: 'Ice Kacang', image: '/cendol.png' },
      ]
    }
  ];

  return (
    <Container size="xl" my={100}>
      <Carousel
        withArrows={false}
        withIndicators={false}
        loop
        plugins={[autoplay]}
        height="100%"
        draggable={true}
        slideSize="100%"
        slideGap="xl"
      >
        {stalls.map((stall) => (
          <Carousel.Slide key={stall.id}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80} align="center" py="xl">
              <Box style={{ position: 'relative' }}>
                <Image 
                  src={stall.mainImage} 
                  radius="32px" 
                  h={500}
                  style={{ boxShadow: 'var(--mm-shadow)' }}
                />
                <Group gap="xs" style={{ position: 'absolute', top: 30, right: 30 }}>
                  {stall.isMuslimFriendly && (
                    <Badge 
                      color="yellow.4" 
                      size="xl" 
                      radius="sm" 
                      fw={600} 
                      style={{ color: 'var(--mantine-color-black)', padding: '12px 16px', height: 'auto' }}
                    >
                      Muslim Friendly
                    </Badge>
                  )}
                  <Badge 
                    color="blue.4" 
                    size="xl" 
                    radius="sm" 
                    fw={700} 
                    leftSection={<IconStar size={16} fill="currentColor" />}
                    style={{ padding: '12px 16px', height: 'auto' }}
                  >
                    {stall.rating}
                  </Badge>
                </Group>
              </Box>
              
              <Stack gap="xl">
                <Box>
                  <Title order={2} style={{ fontSize: '56px', fontWeight: 800 }}>
                    {stall.title}
                  </Title>
                  <Text mt="lg" size="lg" style={{ color: 'var(--mantine-color-dimmed)', lineHeight: 1.8, fontSize: '18px' }}>
                    {stall.description}
                  </Text>
                </Box>

                <Box mt="md">
                  <Text fw={800} size="xl" mb="2rem">Top Picked</Text>
                  <Group gap={40}>
                    {stall.topPicked.map((pick, i) => (
                      <Stack key={i} align="center" gap="xl">
                        <Image 
                          src={pick.image} 
                          h={140} 
                          w={140} 
                          radius="md" 
                        />
                        <Paper
                          component="a"
                          href="#"
                          px="xl"
                          py="sm"
                          radius="xl"
                          withBorder
                          style={{ 
                            borderColor: 'var(--mantine-color-default-border)',
                            color: 'var(--mantine-color-text)',
                            fontSize: '14px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {pick.label}
                        </Paper>
                      </Stack>
                    ))}
                  </Group>
                </Box>
              </Stack>
            </SimpleGrid>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
};

export default TopPicked;
