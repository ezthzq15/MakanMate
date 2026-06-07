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


  const carouselImages = [
    '/carousell-1.jpg',
    '/carousell-2.jpg',
    '/carousell-3.jpg',
    '/carousell-4.jpg',
    '/carousell-5.png',
  ];

  const features = data?.features || [
    { id: 1, title: "Personalized Food Suggestions", color: "#FF8A65", image: "/Personalized Recommendations.png", description: "Get recommendations that match your taste and preferences." },
    { id: 2, title: "Nearby Eats with Live GPS",     color: "#004D40", image: "/PC.png",                           description: "Find the best food around you in real-time." },
    { id: 3, title: "Interactive Map Explorer",       color: "#FFF176", image: "/Maps.png",                        description: "Explore food spots across Penang with ease." },
    { id: 4, title: "Plan Ahead or Go Instant Mode",  color: "#81D4FA", image: "/PlannedMode.png",                 description: "Plan your food hunt or find food on the go instantly." },
  ];



  return (
    <Box>
      {/* ─── 1. FULL-BLEED HERO ─── */}
      <Box style={{ position: 'relative', height: 'clamp(220px, 55vw, 520px)', overflow: 'hidden', width: '100%' }}>

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
          <Container size="xl" style={{ width: '100%', paddingInline: 'clamp(16px, 5vw, 40px)' }}>
            <Stack gap={{ base: 'sm', md: 'lg' }} maw={560}>
              <Badge variant="filled" color="olive" size="md" radius="sm" style={{ width: 'fit-content' }}>
                WELCOME TO PENANG
              </Badge>
              <Title order={1} style={{ color: '#fff', fontSize: 'clamp(22px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                Discover Penang's<br/>Authentic Flavors
              </Title>
              <Text size="md" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: 420, fontSize: 'clamp(13px, 2.5vw, 16px)' }}>
                Your personal guide to the best street food and stalls in the Pearl of the Orient.
              </Text>
              <Group gap="sm" mt={{ base: 0, md: 'xs' }}>
                <Button
                  size="md"
                  radius="xl"
                  color="olive"
                  leftSection={<IconMapPin size={16} />}
                  fw={700}
                  onClick={() => window.location.href = '/map'}
                >
                  Explore Nearby
                </Button>
                <Button
                  size="md"
                  radius="xl"
                  variant="white"
                  c="dark"
                  fw={700}
                  onClick={() => window.location.href = '/search'}
                >
                  Recommendations
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
          height="clamp(220px, 55vw, 520px)"
          style={{ zIndex: 1 }}
        >
          {carouselImages.map((src, index) => (
            <Carousel.Slide key={index}>
              <Box style={{
                height: 'clamp(220px, 55vw, 520px)',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>

      {/* ─── 2. FEATURE CARDS — float up over the hero ─── */}
      <Container size="xl" style={{ position: 'relative', zIndex: 10, marginTop: 'clamp(-30px, -5vw, -60px)', paddingInline: 'clamp(12px, 4vw, 40px)' }}>
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing={{ base: 'sm', md: 'lg' }}>
          {features.map((feature) => {
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
