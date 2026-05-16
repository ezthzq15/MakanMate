import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';
import { Box, Container, Title, Text, SimpleGrid, Card, Image, Button, Group, Stack, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'StallManager') navigate('/stall/dashboard', { replace: true });
      else navigate('/home', { replace: true });
    }
  }, [navigate]);
  return (
    <Box style={{ overflowX: 'hidden', backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <Box 
        style={{ 
          backgroundColor: '#0B463A', 
          minHeight: '85vh', 
          position: 'relative',
          paddingTop: '40px',
          paddingBottom: '60px',
          overflow: 'hidden'
        }}
      >
        {/* Yellow Logo Box (Penang Flag) */}
        <Box 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: '10%', 
            backgroundColor: '#FDE047', // Yellow
            padding: '20px',
            width: '130px',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 20
          }}
        >
          <Image src="/benderaPenang.png" alt="Penang Flag" width={90} />
        </Box>

        <Container size="lg" style={{ paddingTop: '60px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <Center mb="xl">
            <Image src="/logoMakanMate.png" alt="MakanMate" style={{ maxWidth: '500px', width: '100%' }} />
          </Center>
          
          <Text 
            size="xl" 
            c="white" 
            mx="auto"
            style={{ 
              maxWidth: '800px', 
              lineHeight: 1.5, 
              fontSize: 'clamp(15px, 2.5vw, 22px)', 
              fontWeight: 400,
              opacity: 0.9,
              padding: '0 16px'
            }}
          >
            Your personal guide to Penang's best food stalls. Discover, explore,{' '}
            and savor authentic street food with personalized recommendations.
          </Text>
        </Container>

        {/* Responsive Food Images Composition - hidden on small screens */}
        <Box 
          style={{ 
            position: 'relative',
            marginTop: '40px',
            height: 'clamp(200px, 40vw, 420px)',
            width: '100%',
            maxWidth: '1100px',
            margin: '40px auto 0',
            zIndex: 10,
            overflow: 'hidden'
          }}
        >
          {/* Main Dish (Mee Kari) - Center */}
          <Box 
            style={{ 
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(300px, 55vw, 650px)',
              zIndex: 3
            }}
          >
            <Image src="/mee kari.png" alt="Mee Kari" style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.4))' }} />
          </Box>

          {/* Left Dish (Laksa) — hidden on narrow screens */}
          <Box 
            style={{ 
              position: 'absolute',
              top: 'clamp(60px, 12vw, 120px)',
              left: '5%',
              width: 'clamp(150px, 28vw, 350px)',
              zIndex: 2,
              display: isMobile ? 'none' : 'block'
            }}
          >
            <Image src="/laksa.png" alt="Laksa" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }} />
          </Box>

          {/* Right Dish (Cendol) — hidden on narrow screens */}
          <Box 
            style={{ 
              position: 'absolute',
              top: 'clamp(60px, 12vw, 120px)',
              right: '5%',
              width: 'clamp(150px, 28vw, 350px)',
              zIndex: 4,
              display: isMobile ? 'none' : 'block'
            }}
          >
            <Image src="/ceondol-2.png" alt="Cendol" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }} />
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box style={{ backgroundColor: '#FCFBF7', paddingTop: '80px', paddingBottom: '120px' }}>
        <Container size="xl">
          <Group align="flex-start" justify="space-between" mb={80} wrap="wrap" gap="xl">
            <Box style={{ minWidth: 'min(100%, 450px)', flex: 1 }}>
              <Box style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '20px' }} />
              <Title order={1} style={{ fontSize: 'clamp(28px, 5vw, 42px)', color: '#1A1A1A', fontWeight: 800, lineHeight: 1.1 }}>
                What Sets Us<br />Apart
              </Title>
            </Box>
            <Text c="dimmed" style={{ maxWidth: '450px', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6, flex: 1, minWidth: 'min(100%, 300px)' }}>
              Discover Penang's vibrant food scene with smart features designed to help you find your perfect meal
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            {/* Feature 1 */}
            <Card padding="xl" radius="md" withBorder={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <Center mb="lg" style={{ height: '100px' }}>
                <Image src="/Personalized Recommendations.png" h={90} fit="contain" />
              </Center>
              <Text fw={800} size="lg" mb="sm" style={{ color: '#1A1A1A' }}>Personalized<br/>Recommendations</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                Get food suggestions tailored to your taste preferences and dietary needs
              </Text>
            </Card>

            {/* Feature 2 */}
            <Card padding="xl" radius="md" withBorder={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <Center mb="lg" style={{ height: '100px' }}>
                <Image src="/UrgentMode.png" h={90} fit="contain" />
              </Center>
              <Text fw={800} size="lg" mb="sm" style={{ color: '#1A1A1A' }}>Urgent Mode</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                Find nearby stalls instantly when you're hungry right now
              </Text>
            </Card>

            {/* Feature 3 */}
            <Card padding="xl" radius="md" withBorder={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <Center mb="lg" style={{ height: '100px' }}>
                <Image src="/Maps.png" h={90} fit="contain" />
              </Center>
              <Text fw={800} size="lg" mb="sm" style={{ color: '#1A1A1A' }}>Interactive Map</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                Visualize food stalls on an interactive map with real-time location
              </Text>
            </Card>

            {/* Feature 4 */}
            <Card padding="xl" radius="md" withBorder={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <Center mb="lg" style={{ height: '100px' }}>
                <Image src="/PlannedMode.png" h={90} fit="contain" />
              </Center>
              <Text fw={800} size="lg" mb="sm" style={{ color: '#1A1A1A' }}>Planned Mode</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                Plan your food hunts ahead with curated recommendations
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box style={{ backgroundColor: '#FFFFFF', padding: '120px 0' }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={100} verticalSpacing="xl" align="center">
            <Center>
              <Box style={{ position: 'relative', width: '100%', maxWidth: '650px', margin: '0 auto' }}>
                {/* Modern Browser Frame */}
                <Box 
                  style={{ 
                    backgroundColor: '#f1f1f1', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.2), 0 30px 60px -30px rgba(0,0,0,0.25)',
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {/* Browser Header Bar */}
                  <Box style={{ height: '32px', backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
                    <Box style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <Box style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <Box style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                    <Box style={{ flex: 1, height: '18px', backgroundColor: 'white', borderRadius: '4px', margin: '0 20px', opacity: 0.6 }} />
                  </Box>
                  
                  {/* Website Screenshot */}
                  <Image 
                    src="/mmweb.png" 
                    alt="MakanMate Website" 
                    style={{ 
                      width: '100%', 
                      display: 'block',
                      aspectRatio: '16/10',
                      objectFit: 'cover',
                      objectPosition: 'top'
                    }} 
                  />
                </Box>

                {/* Floating "Smart Suggestions" Card */}
                {!isMobile && (
                  <Box 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-30px', 
                      left: '-40px', 
                      backgroundColor: 'white', 
                      padding: '16px', 
                      borderRadius: '20px', 
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                      width: '210px',
                      zIndex: 5,
                      border: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <Box style={{ backgroundColor: '#FFF9E6', padding: '8px', borderRadius: '12px' }}>
                      <Image src="/Personalized Recommendations.png" width={32} height={32} />
                    </Box>
                    <Box>
                      <Text fw={800} size="sm" style={{ color: '#1A1A1A' }}>Smart Suggestions</Text>
                      <Text size="10px" c="dimmed" fw={500}>Just for you</Text>
                    </Box>
                  </Box>
                )}

                {/* Floating "Real-time Map" Card */}
                {!isMobile && (
                  <Box 
                    style={{ 
                      position: 'absolute', 
                      top: '60px', 
                      right: '-30px', 
                      backgroundColor: 'white', 
                      padding: '12px', 
                      borderRadius: '20px', 
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                      zIndex: 5,
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <Stack gap={4} align="center">
                      <Box style={{ backgroundColor: '#E6F3FF', padding: '10px', borderRadius: '12px' }}>
                        <Image src="/Maps.png" width={36} height={36} />
                      </Box>
                      <Text fw={700} size="10px" style={{ color: '#1A1A1A' }}>Live Map</Text>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Center>
            
            <Stack justify="center" gap="xl">
              <Title order={1} style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#1A1A1A', lineHeight: 1 }}>JOIN US NOW</Title>
              <Text size="lg" c="dimmed" style={{ fontSize: '20px', maxWidth: '500px' }}>
                Join MakanMate today and never miss out on Penang's amazing food culture
              </Text>
              
              <Group gap="lg" mt="xl" wrap="wrap">
                <Button 
                  size="lg" 
                  radius="xl" 
                  px={32}
                  style={{ backgroundColor: '#0B463A', fontWeight: 700 }}
                  onClick={() => navigate('/auth/signup')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  radius="xl" 
                  px={32}
                  color="#0B463A"
                  style={{ borderColor: '#0B463A', color: '#0B463A', fontWeight: 700 }}
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In
                </Button>
                <Text 
                  size="md" 
                  c="dimmed" 
                  style={{ cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
                  onClick={() => navigate('/map')}
                >
                  Continue as a guest
                </Text>
              </Group>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Simple Footer */}
      <Box py="xl" style={{ borderTop: '1px solid #eee' }}>
        <Container size="xl">
          <Text size="xs" c="dimmed" ta="center">© 2024 MakanMate. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
}
