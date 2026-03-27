// Homepage UI Component with Hero Carousel
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
  Paper, 
  Card,
  ActionIcon
} from '@mantine/core';
import { IconChevronRight, IconStar } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useMemo } from 'react';

const HomepageUI = ({ data }) => {
  const autoplay = useMemo(() => Autoplay({ 
    delay: 35000, 
    stopOnInteraction: false,
    stopOnMouseEnter: false,
    playOnInit: true
  }), []);

  if (!data) return null;

  const carouselImages = [
    '/carousell-1.jpg',
    '/carousell-2.jpg',
    '/carousell-3.jpg',
    '/carousell-4.jpg',
    '/carousell-5.png',
  ];

  return (
    <Box>
      <Box style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
        {/* 1. Static Overlay & Title layer (Always on top) */}
      <Box 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 10,
          pointerEvents: 'none', // Allow clicking through to carousel if needed
          display: 'flex',
          alignItems: 'center'
        }} 
      >
        <Container size="xl" style={{ width: '100%' }}>
          <Title order={1} style={{ color: '#fff', fontSize: '64px', maxWidth: '700px', fontWeight: 900, lineHeight: 1.1 }}>
            Find Good Food in<br/> Penang Anytime.
          </Title>
        </Container>
      </Box>

      {/* 2. Background Carousel */}
      <Carousel
        withArrows={false}
        withIndicators={false}
        loop
        plugins={[autoplay]}
        height="100%"
        style={{ zIndex: 1 }}
      >
        {carouselImages.map((src, index) => (
          <Carousel.Slide key={index}>
            <Box 
              style={{ 
                height: '600px', 
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>

      {/* 2. Feature Cards */}
      <Container size="xl" mt={-60} style={{ position: 'relative', zIndex: 10 }}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {data.features.map((feature) => (
            <Paper 
              key={feature.id} 
              p="xl" 
              radius="lg" 
              style={{ 
                backgroundColor: feature.color, 
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2sease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Title order={3} style={{ color: feature.color === '#FFF176' ? '#000' : '#fff', fontSize: '18px', maxWidth: '140px' }}>
                {feature.title}
              </Title>
              <Image src={feature.image} h={100} w="auto" fit="contain" style={{ marginLeft: 'auto' }} />
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

    </Box>
  );
};

export default HomepageUI;
