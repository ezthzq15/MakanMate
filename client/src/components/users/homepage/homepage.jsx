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
  Button,
} from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useMemo } from 'react';

const HomepageUI = ({ data }) => {
  const autoplay = useMemo(() => Autoplay({ 
    delay: 4000, 
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
      {/* ─── 1. FULL-BLEED HERO ─── */}
      <Box style={{ position: 'relative', height: '520px', overflow: 'hidden', width: '100%' }}>

        {/* Dark overlay */}
        <Box style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.2) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Text overlay */}
        <Box style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Container size="xl" style={{ width: '100%' }}>
            <Stack gap="lg" maw={560}>
              <Badge variant="filled" color="olive" size="md" radius="sm" style={{ width: 'fit-content' }}>
                WELCOME TO PENANG
              </Badge>
              <Title order={1} style={{ color: '#fff', fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                Discover Penang's<br/>Authentic Flavors
              </Title>
              <Text size="md" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: 420 }}>
                Your personal guide to the best street food and stalls in the Pearl of the Orient.
              </Text>
              <Group gap="md" mt="xs">
                <Button
                  size="lg"
                  radius="xl"
                  color="olive"
                  leftSection={<IconMapPin size={18} />}
                  fw={700}
                  onClick={() => window.location.href = '/map'}
                >
                  Explore Nearby Stalls
                </Button>
                <Button
                  size="lg"
                  radius="xl"
                  variant="white"
                  c="dark"
                  fw={700}
                  onClick={() => document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Recommendations
                </Button>
              </Group>
            </Stack>
          </Container>
        </Box>

        {/* Background carousel */}
        <Carousel
          withArrows={false}
          withIndicators={false}
          loop
          plugins={[autoplay]}
          height="520px"
          style={{ zIndex: 1 }}
        >
          {carouselImages.map((src, index) => (
            <Carousel.Slide key={index}>
              <Box style={{
                height: '520px',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>

      {/* ─── 2. FEATURE CARDS — float up over the hero ─── */}
      <Container size="xl" style={{ position: 'relative', zIndex: 10, marginTop: '-60px' }}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {data.features.map((feature) => {
            // Derive a very light pastel background from the feature accent color
            const pastelBg = {
              '#FF8A65': '#fff1ed',
              '#004D40': '#f0f7f5',
              '#FFF176': '#fffde6',
              '#81D4FA': '#e8f6fd',
            }[feature.color] || '#f8f9fa';

            const titleColor = {
              '#FF8A65': '#e05a2b',
              '#004D40': '#1a1a1a',
              '#FFF176': '#c9a800',
              '#81D4FA': '#1976b8',
            }[feature.color] || '#1a1a1a';

            return (
              <Paper
                key={feature.id}
                p="xl"
                radius="xl"
                shadow="sm"
                style={{
                  backgroundColor: pastelBg,
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Stack gap="xs" style={{ zIndex: 1 }}>
                  <Title
                    order={4}
                    style={{
                      color: titleColor,
                      fontSize: '17px',
                      fontWeight: 900,
                      lineHeight: 1.3,
                      maxWidth: '160px',
                    }}
                  >
                    {feature.title}
                  </Title>
                  <Text
                    size="xs"
                    style={{
                      color: '#555',
                      lineHeight: 1.6,
                      maxWidth: '150px',
                    }}
                  >
                    {feature.description}
                  </Text>
                </Stack>
                <Image
                  src={feature.image}
                  h={100}
                  w="auto"
                  fit="contain"
                  style={{ position: 'absolute', bottom: 12, right: 12 }}
                />
              </Paper>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HomepageUI;
