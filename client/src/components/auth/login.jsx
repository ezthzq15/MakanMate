import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Image,
  Button,
  Paper,
  Title,
  Text,
  Alert,
  Stack,
  Anchor,
  Group,
  Box,
} from '@mantine/core';
import { 
  IconMapPin, 
  IconBowl, 
  IconMail, 
  IconLock,
  IconMap,
  IconCamera,
  IconHeart,
} from '@tabler/icons-react';
import { useLogin } from '../../hooks/auth/useLogin';
import { AccountSuspend } from './AccountSuspend';

export function Login() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  
  // Use the existing auth hook properly
  const { login, loading, error: loginError, isSuspended } = useLogin({
    onSuccess: (data) => {
      const role = data.user?.userRole || 'user';
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'StallManager') navigate('/stall/dashboard', { replace: true });
      else navigate('/home', { replace: true });
    },
    onError: (err) => console.error('Login failed', err)
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userEmail || !userPassword) return;
    login(userEmail, userPassword);
  };

  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0A4337',
        background: 'radial-gradient(circle at top right, #1d6e5d 0%, #0A4337 45%, #05261f 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(16px, 5vw, 40px)'
      }}
    >
      {/* Background Decorative Plane/Path */}
      <Box style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
        <svg width="600" height="300" viewBox="0 0 600 300" fill="none">
          <path d="M0,200 C100,100 200,300 300,150 C400,0 500,200 600,100" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M590,90 L605,100 L590,110 Z" fill="white" />
        </svg>
      </Box>

      {/* Palm Tree Silhouettes - Left */}
      <Box style={{ position: 'absolute', bottom: '10%', left: '20px', opacity: 0.12, pointerEvents: 'none', zIndex: 0 }}>
        <svg width="400" height="300" viewBox="0 0 400 300" fill="currentColor" color="white">
          <path d="M50,300 Q60,200 50,100 M50,100 Q80,120 110,100 M50,100 Q20,120 -10,100 M50,100 Q80,80 110,60 M50,100 Q20,80 -10,60" stroke="white" strokeWidth="4" fill="none" />
          <path d="M150,300 Q160,150 150,50 M150,50 Q180,70 210,50 M150,50 Q120,70 90,50 M150,50 Q180,30 210,10 M150,50 Q120,30 90,10" stroke="white" strokeWidth="4" fill="none" />
        </svg>
      </Box>

      {/* Brand Identity - Top Left - hidden on very small screens */}
      <Box style={{ position: 'absolute', top: '40px', left: 'clamp(16px, 5vw, 60px)', zIndex: 10, display: 'var(--brand-display, block)' }}>
        <Anchor component={Link} to="/" style={{ textDecoration: 'none' }}>
          <Title 
            order={1} 
            style={{ 
              fontFamily: "'Fredoka One', 'Righteous', cursive",
              letterSpacing: '2px',
              fontSize: 'clamp(22px, 3vw, 38px)',
              fontWeight: 900,
              color: '#ffffff',
              WebkitTextStroke: '2px #1a5c28',
              textShadow: `
                0 0 6px #52c46a,
                0 0 14px #2e7d32,
                2px 2px 0 #0f3d17,
                -1px -1px 0 #0f3d17,
                1px -1px 0 #0f3d17,
                -1px 1px 0 #0f3d17
              `,
            }}
          >
            MakanMate
          </Title>
        </Anchor>
        <Box mt={30} ml={10} style={{ display: 'var(--slogan-display, block)' }}>
          <Stack gap={0}>
            <Text 
              style={{ 
                color: '#D1D5D1', 
                fontSize: 'clamp(28px, 4vw, 52px)', 
                fontFamily: '"Caveat", cursive',
                lineHeight: 0.8,
                opacity: 0.95
              }}
            >
              Explore.
            </Text>
            <Text 
              style={{ 
                color: '#D1D5D1', 
                fontSize: 'clamp(28px, 4vw, 52px)', 
                fontFamily: '"Caveat", cursive',
                lineHeight: 1.1,
                opacity: 0.95,
                marginLeft: '15px'
              }}
            >
              Taste.
            </Text>
            <Text 
              style={{ 
                color: '#D1D5D1', 
                fontSize: 'clamp(16px, 2.5vw, 28px)', 
                fontFamily: '"Playfair Display", serif',
                lineHeight: 1.2,
                opacity: 0.8,
                fontWeight: 700,
                letterSpacing: '1px'
              }}
            >
              Remember.
            </Text>
          </Stack>
          <Box style={{ width: '120px', height: '3px', backgroundColor: 'rgba(209, 213, 209, 0.4)', marginTop: '15px' }} />
        </Box>
      </Box>

      {/* Food Image - Top Right — hidden on small screens */}
      <Box 
        style={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: 'clamp(200px, 40vw, 650px)', 
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))',
          display: 'var(--food-display, block)'
        }}
      >
        <Image src="/laksa.png" style={{ transform: 'rotate(-10deg)', opacity: 0.95 }} />
      </Box>

      {/* Food Image - Bottom Left — hidden on small screens */}
      <Box 
        style={{ 
          position: 'absolute', 
          bottom: '-12%', 
          left: '-8%', 
          width: 'clamp(200px, 38vw, 600px)', 
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))',
          display: 'var(--food-display, block)'
        }}
      >
        <Image src="/ceondol-2.png" style={{ transform: 'rotate(15deg)', opacity: 0.95 }} />
      </Box>

      {/* Postcard Stamp - Bottom Right */}
      <Box 
        style={{ 
          position: 'absolute', 
          bottom: '120px', 
          right: '80px', 
          zIndex: 5,
          transform: 'rotate(8deg)'
        }}
      >
        <Box 
          p={20}
          style={{ 
            backgroundColor: '#094033', 
            border: '2px dashed rgba(255,255,255,0.4)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center',
            width: '200px',
            boxShadow: '10px 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <Text size="xs" fw={800} style={{ letterSpacing: '2px' }}>GOOD FOOD</Text>
          <Text size="xs" fw={800} style={{ letterSpacing: '2px' }}>GOOD MOOD</Text>
          <Text size="xs" fw={400} style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>GREAT MEMORIES</Text>
          <Group justify="center" mt={10}>
             <IconMapPin size={16} color="#D1D5D1" />
          </Group>
        </Box>
        {/* Postcard wavy lines */}
        <Box style={{ position: 'absolute', top: '20%', right: '-40px', opacity: 0.3 }}>
           <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
             <path d="M0,10 Q15,0 30,10 T60,10 T90,10" stroke="white" strokeWidth="1.5" />
             <path d="M0,25 Q15,15 30,25 T60,25 T90,25" stroke="white" strokeWidth="1.5" />
             <path d="M0,40 Q15,30 30,40 T60,40 T90,40" stroke="white" strokeWidth="1.5" />
           </svg>
        </Box>
      </Box>

      {/* Account Suspended Modal */}
      <AccountSuspend opened={isSuspended} onClose={() => {}} />

      {/* The Premium Login Card */}
      <Paper 
        p={{ base: 28, sm: 50 }} 
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
          zIndex: 100,
          borderRadius: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Custom Icon (Pin + Bowl) */}
        <Box style={{ position: 'relative', height: '60px', width: '60px', marginBottom: '25px' }}>
          <IconMapPin size={32} color="#0A4337" stroke={2.5} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
          <IconBowl size={32} color="#0A4337" stroke={2.5} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
        </Box>

        <Title order={2} fw={900} style={{ color: '#111', fontSize: '32px', marginBottom: '10px', textAlign: 'center' }}>
          Welcome Back, Foodie!
        </Title>
        <Text c="dimmed" size="sm" mb={40} ta="center" style={{ fontSize: '15px' }}>
          Sign in to continue your food journey
        </Text>

        {loginError && (
          <Alert color="red" mb="md" variant="light" radius="md" w="100%">
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <Stack gap={30}>
            {/* Email Input */}
            <Box>
              <Text size="14px" fw={700} color="#333" mb={10}>Email</Text>
              <TextInput
                placeholder="@gmail.com"
                value={userEmail}
                onChange={(event) => setUserEmail(event.currentTarget.value)}
                required
                size="md"
                variant="default"
                rightSection={<IconMail size={22} color="#bbb" />}
                styles={{
                  input: { 
                    borderRadius: '16px', 
                    border: '2px solid #f0f0f0',
                    fontSize: '15px',
                    height: '56px',
                    transition: 'all 0.2s ease',
                    '&:focus': { borderColor: '#0A4337', boxShadow: '0 0 0 4px rgba(10, 67, 55, 0.1)' }
                  }
                }}
              />
            </Box>

            {/* Password Input */}
            <Box>
              <Text size="14px" fw={700} color="#333" mb={10}>Password</Text>
              <PasswordInput
                placeholder="••••••••••••"
                value={userPassword}
                onChange={(event) => setUserPassword(event.currentTarget.value)}
                required
                size="md"
                variant="default"
                rightSection={<IconLock size={22} color="#bbb" />}
                styles={{
                  input: { 
                    borderRadius: '16px', 
                    border: '2px solid #f0f0f0',
                    fontSize: '15px',
                    height: '56px',
                    transition: 'all 0.2s ease',
                    '&:focus': { borderColor: '#0A4337', boxShadow: '0 0 0 4px rgba(10, 67, 55, 0.1)' }
                  },
                  innerInput: { height: '52px' }
                }}
              />
              <Group justify="flex-end" mt={10}>
                <Anchor 
                  component="button" 
                  type="button" 
                  size="13px" 
                  c="dimmed"
                  onClick={() => navigate('/auth/forgot-password')}
                >
                  Forgot your password?
                </Anchor>
              </Group>
            </Box>

            {/* Submit Button */}
            <Button 
              type="submit" 
              fullWidth 
              size="xl"
              radius="xl"
              loading={loading}
              mt={15}
              style={{ 
                backgroundColor: '#094033', 
                fontWeight: 800,
                height: '60px',
                fontSize: '18px',
                boxShadow: '0 10px 30px rgba(9, 64, 51, 0.3)'
              }}
            >
              Sign In
            </Button>

            {/* Footer Links */}
            <Stack gap={15} mt={20} align="center">
              <Text size="sm" c="dimmed">
                Don't have an account?{' '}
                <Anchor size="sm" fw={800} component={Link} to="/auth/signup" style={{ color: '#0A4337' }}>
                  Sign Up
                </Anchor>
              </Text>

              <Anchor 
                component="button" 
                type="button" 
                size="sm" 
                c="dimmed"
                fw={600}
                onClick={() => navigate('/map')}
              >
                Continue as a guest
              </Anchor>
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* Bottom Features Row */}
      <Box mt={60} style={{ zIndex: 10, width: '100%', maxWidth: 520 }}>
        <Group gap={40} justify="center" wrap="wrap">
          <Group gap={15}>
            <IconMap size={22} color="#D1D5D1" />
            <Box>
              <Text c="white" fw={800} size="sm">Discover</Text>
              <Text c="rgba(255,255,255,0.6)" size="10px" fw={500}>Hidden Gems</Text>
            </Box>
          </Group>
          <Group gap={15}>
            <IconCamera size={22} color="#D1D5D1" />
            <Box>
              <Text c="white" fw={800} size="sm">Capture</Text>
              <Text c="rgba(255,255,255,0.6)" size="10px" fw={500}>Food Moments</Text>
            </Box>
          </Group>
          <Group gap={15}>
            <IconHeart size={22} color="#D1D5D1" />
            <Box>
              <Text c="white" fw={800} size="sm">Share</Text>
              <Text c="rgba(255,255,255,0.6)" size="10px" fw={500}>Your Stories</Text>
            </Box>
          </Group>
        </Group>
      </Box>

      {/* Copyright — centered */}
      <Box style={{ zIndex: 10, width: '100%', maxWidth: 520, textAlign: 'center', marginTop: 16 }}>
        <Text size="10px" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          © 2026 MakanMate by Ezzat Haziq. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}