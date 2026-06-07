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

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Box style={{ backgroundColor: '#0B463A', position: 'relative', paddingTop: '32px', paddingBottom: 0, overflow: 'visible' }}>

        {/* Penang flag */}
        <Box style={{
          position: 'absolute', top: 0,
          left: 'clamp(16px, 8%, 140px)',
          backgroundColor: '#FDE047',
          padding: '14px',
          width: 'clamp(70px, 10vw, 120px)',
          height: 'clamp(100px, 15vw, 165px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 20
        }}>
          <Image src="/benderaPenang.png" alt="Penang Flag" width={80} />
        </Box>

        {/* Logo + tagline */}
        <Container size="lg" style={{ paddingTop: '48px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <Center mb="md">
            <Image src="/logoMakanMate.png" alt="MakanMate" style={{ maxWidth: 'clamp(220px, 44vw, 420px)', width: '100%' }} />
          </Center>
          <Text c="white" mx="auto" style={{
            maxWidth: '700px',
            lineHeight: 1.5,
            fontSize: 'clamp(13px, 2.2vw, 20px)',
            fontWeight: 400,
            opacity: 0.88,
            padding: '0 16px',
            marginBottom: 'clamp(40px, 10vw, 90px)',
          }}>
            Your personal guide to Penang's best food stalls. Discover, explore,{' '}
            and savor authentic street food with personalized recommendations.
          </Text>
        </Container>

        {/* Food images — bottom-anchored so they sit on the green/white edge */}
        <Box style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', height: 'clamp(130px, 28vw, 320px)' }}>
          {/* Mee Kari — center */}
          <Box style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 'clamp(200px, 42vw, 500px)', zIndex: 3 }}>
            <Image src="/mee kari.png" alt="Mee Kari" style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.4))' }} />
          </Box>
          {/* Laksa — left, hidden on mobile */}
          {!isMobile && (
            <Box style={{ position: 'absolute', bottom: 0, left: '5%', width: 'clamp(120px, 22vw, 260px)', zIndex: 2 }}>
              <Image src="/laksa.png" alt="Laksa" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))' }} />
            </Box>
          )}
          {/* Cendol — right, hidden on mobile */}
          {!isMobile && (
            <Box style={{ position: 'absolute', bottom: 0, right: '5%', width: 'clamp(120px, 22vw, 260px)', zIndex: 4 }}>
              <Image src="/ceondol-2.png" alt="Cendol" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))' }} />
            </Box>
          )}
        </Box>

        {/* Copyright */}
        <Box style={{ position: 'absolute', bottom: 6, right: 20, zIndex: 10 }}>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>© 2026 Ezzat Haziq. All rights reserved.</Text>
        </Box>
      </Box>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <Box style={{ backgroundColor: '#FCFBF7', paddingTop: '40px', paddingBottom: '60px' }}>
        <Container size="xl">
          <Group align="flex-start" justify="space-between" mb={48} wrap="wrap" gap="lg">
            <Box style={{ minWidth: 'min(100%, 400px)', flex: 1 }}>
              <Box style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '16px' }} />
              <Title order={1} style={{ fontSize: 'clamp(24px, 4.5vw, 38px)', color: '#1A1A1A', fontWeight: 800, lineHeight: 1.1 }}>
                What Sets Us<br />Apart
              </Title>
            </Box>
            <Text c="dimmed" style={{ maxWidth: '420px', fontSize: 'clamp(14px, 1.8vw, 17px)', lineHeight: 1.6, flex: 1, minWidth: 'min(100%, 260px)' }}>
              Discover Penang's vibrant food scene with smart features designed to help you find your perfect meal
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            {[
              { img: '/Personalized Recommendations.png', title: 'Personalized\nRecommendations', desc: 'Get food suggestions tailored to your taste and dietary needs' },
              { img: '/UrgentMode.png', title: 'Urgent Mode', desc: "Find nearby stalls instantly when you're hungry right now" },
              { img: '/Maps.png', title: 'Interactive Map', desc: 'Visualize food stalls on an interactive map with real-time location' },
              { img: '/PlannedMode.png', title: 'Planned Mode', desc: 'Plan your food hunts ahead with curated recommendations' },
            ].map(({ img, title, desc }) => (
              <Card key={title} padding="lg" radius="md" withBorder={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                <Center mb="md" style={{ height: '80px' }}>
                  <Image src={img} h={72} fit="contain" />
                </Center>
                <Text fw={800} size="md" mb={6} style={{ color: '#1A1A1A', whiteSpace: 'pre-line' }}>{title}</Text>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>{desc}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Box style={{ backgroundColor: '#FFFFFF', padding: '60px 0' }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} verticalSpacing="xl" align="center">
            <Center>
              <Box style={{ position: 'relative', width: '100%', maxWidth: '580px', margin: '0 auto' }}>
                {/* Browser mockup */}
                <Box style={{ backgroundColor: '#f1f1f1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 30px 70px -15px rgba(0,0,0,0.18)', border: '1px solid #e0e0e0', position: 'relative', zIndex: 1 }}>
                  <Box style={{ height: '28px', backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '7px' }}>
                    <Box style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <Box style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <Box style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                    <Box style={{ flex: 1, height: '16px', backgroundColor: 'white', borderRadius: '4px', margin: '0 16px', opacity: 0.6 }} />
                  </Box>
                  <Image src="/mmweb.png" alt="MakanMate Website" style={{ width: '100%', display: 'block', aspectRatio: '16/10', objectFit: 'cover', objectPosition: 'top' }} />
                </Box>

                {/* Floating badge — Smart Suggestions */}
                {!isMobile && (
                  <Box style={{ position: 'absolute', bottom: '-20px', left: '-32px', backgroundColor: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)', width: '190px', zIndex: 5, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Box style={{ backgroundColor: '#FFF9E6', padding: '7px', borderRadius: '10px' }}>
                      <Image src="/Personalized Recommendations.png" width={28} height={28} />
                    </Box>
                    <Box>
                      <Text fw={800} size="xs" style={{ color: '#1A1A1A' }}>Smart Suggestions</Text>
                      <Text size="10px" c="dimmed" fw={500}>Just for you</Text>
                    </Box>
                  </Box>
                )}

                {/* Floating badge — Live Map */}
                {!isMobile && (
                  <Box style={{ position: 'absolute', top: '50px', right: '-24px', backgroundColor: 'white', padding: '10px', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)', zIndex: 5, border: '1px solid #f0f0f0' }}>
                    <Stack gap={3} align="center">
                      <Box style={{ backgroundColor: '#E6F3FF', padding: '8px', borderRadius: '10px' }}>
                        <Image src="/Maps.png" width={30} height={30} />
                      </Box>
                      <Text fw={700} size="10px" style={{ color: '#1A1A1A' }}>Live Map</Text>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Center>

            <Stack justify="center" gap="md" align={{ base: 'center', md: 'flex-start' }}>
              <Title order={1} ta={{ base: 'center', md: 'left' }} style={{ fontSize: 'clamp(30px, 5.5vw, 58px)', fontWeight: 900, color: '#1A1A1A', lineHeight: 1 }}>JOIN US NOW</Title>
              <Text c="dimmed" ta={{ base: 'center', md: 'left' }} style={{ fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '460px', lineHeight: 1.6 }}>
                Join MakanMate today and never miss out on Penang's amazing food culture
              </Text>
              <Group gap="md" mt="sm" wrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
                <Button size="md" radius="xl" px={28} style={{ backgroundColor: '#0B463A', fontWeight: 700 }} onClick={() => navigate('/auth/signup')}>
                  Get Started
                </Button>
                <Button variant="outline" size="md" radius="xl" px={28} color="#0B463A" style={{ borderColor: '#0B463A', color: '#0B463A', fontWeight: 700 }} onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }} onClick={() => navigate('/map')}>
                  Continue as a guest
                </Text>
              </Group>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <Box py="md" style={{ borderTop: '1px solid #eee' }}>
        <Container size="xl">
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Text size="xs" c="dimmed" fw={600}>MakanMate — Penang's Food Discovery App</Text>
            <Text size="xs" c="dimmed">© 2026 Ezzat Haziq. All rights reserved.</Text>
          </Group>
        </Container>
      </Box>

    </Box>
  );
}
