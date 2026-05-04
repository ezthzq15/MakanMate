import { Link } from 'react-router-dom';
import { Box, Title, Text, Stack, Image, Group, Anchor } from '@mantine/core';
import { IconMapPin, IconToolsKitchen2, IconCamera, IconHeart } from '@tabler/icons-react';
import { Signup } from '../../../components/auth/signup';
import '../../../styles/global.css';

export default function SignupPage() {
  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0A4337',
        background: 'radial-gradient(circle at top right, #1d6e5d 0%, #0A4337 45%, #05261f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px'
      }}
    >
      {/* Brand Identity - Top Left */}
      <Box style={{ position: 'absolute', top: '40px', left: '60px', zIndex: 10 }}>
        <Anchor component={Link} to="/" style={{ textDecoration: 'none' }}>
          <Title 
            order={1} 
            style={{ 
              color: '#FFFFFF', 
              fontFamily: 'Inter, sans-serif', 
              letterSpacing: '2px',
              fontSize: '28px',
              fontWeight: 800,
            }}
          >
            MakanMate
          </Title>
        </Anchor>
      </Box>

      {/* Main Content Layout */}
      <Group justify="space-between" align="center" style={{ width: '100%', maxWidth: '1400px', zIndex: 5 }}>
        
        {/* Left Side: Slogan & Imagery */}
        <Box style={{ flex: 1, position: 'relative', height: '800px' }}>
          {/* Slogan Section */}
          <Box style={{ position: 'absolute', top: '80px', left: '0', zIndex: 10 }}>
            <Text c="white" size="lg" fw={500} mb={10}>Join the journey.</Text>
            <Stack gap={0}>
              <Title 
                order={1} 
                style={{ 
                  color: '#f0c14b', 
                  fontSize: '72px', 
                  fontWeight: 900, 
                  lineHeight: 0.9,
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-2px'
                }}
              >
                EAT WELL,<br />TRAVEL OFTEN.
              </Title>
              <Text 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '48px', 
                  fontFamily: '"Caveat", cursive',
                  marginTop: '10px'
                }}
              >
                Memories forever.
              </Text>
            </Stack>
            
            <Box mt={40} style={{ maxWidth: '400px' }}>
              <Text c="rgba(255,255,255,0.7)" size="md" style={{ lineHeight: 1.6 }}>
                Create your account and explore amazing flavors, hidden gems and unforgettable experiences around the world.
              </Text>
            </Box>

            {/* Feature Icons */}
            <Group mt={60} gap={40}>
               <Stack gap={5} align="center">
                 <IconMapPin size={28} color="#f0c14b" />
                 <Box ta="center">
                   <Text c="white" fw={700} size="sm">Discover</Text>
                   <Text c="rgba(255,255,255,0.5)" size="xs">new places</Text>
                 </Box>
               </Stack>
               <Stack gap={5} align="center">
                 <IconToolsKitchen2 size={28} color="#f0c14b" />
                 <Box ta="center">
                   <Text c="white" fw={700} size="sm">Taste</Text>
                   <Text c="rgba(255,255,255,0.5)" size="xs">local delights</Text>
                 </Box>
               </Stack>
               <Stack gap={5} align="center">
                 <IconCamera size={28} color="#f0c14b" />
                 <Box ta="center">
                   <Text c="white" fw={700} size="sm">Collect</Text>
                   <Text c="rgba(255,255,255,0.5)" size="xs">food memories</Text>
                 </Box>
               </Stack>
            </Group>
          </Box>

          {/* Background Decorations */}
          <Box style={{ position: 'absolute', bottom: '0', left: '-100px', opacity: 0.1, transform: 'rotate(-20deg)' }}>
            <svg width="300" height="300" viewBox="0 0 100 100">
               <path d="M10,90 Q30,10 90,50" stroke="white" strokeWidth="2" fill="none" />
               <path d="M20,100 Q40,20 100,60" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </Box>
          <Box style={{ position: 'absolute', bottom: '20px', left: '150px', opacity: 0.15 }}>
            <Box style={{ border: '2px solid white', borderRadius: '10px', padding: '15px', transform: 'rotate(-10deg)', width: '120px', textAlign: 'center' }}>
               <Text c="white" size="10px" fw={800} style={{ letterSpacing: '1px' }}>PASSPORT</Text>
               <Text c="white" size="8px">TO FLAVOR</Text>
               <Box mt={10}><IconMapPin size={16} color="white" /></Box>
            </Box>
          </Box>
        </Box>

        {/* Center: The Food Cluster */}
        <Box style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-35%, -50%)', width: '700px', height: '700px', zIndex: 1 }}>
          {/* Polaroid 1 */}
          <Box style={{ position: 'absolute', top: '15%', right: '5%', transform: 'rotate(15deg)', padding: '10px 10px 40px 10px', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 1 }}>
             <Image src="/laksa.png" width={180} height={160} />
          </Box>
          {/* Polaroid 2 */}
          <Box style={{ position: 'absolute', bottom: '15%', left: '25%', transform: 'rotate(-10deg)', padding: '10px 10px 40px 10px', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 1 }}>
             <Box style={{ width: '200px', height: '140px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/ceondol-2.png" />
             </Box>
          </Box>

          {/* Main Bowls */}
          <Box style={{ position: 'absolute', top: '10%', left: '15%', zIndex: 5, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }}>
            <Image src="/laksa.png" width={380} style={{ transform: 'rotate(-5deg)' }} />
          </Box>
          <Box style={{ position: 'absolute', top: '35%', left: '35%', zIndex: 10, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
            <Image src="/3gmbrmakanan.png" width={340} style={{ transform: 'rotate(5deg)' }} />
          </Box>
          <Box style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 15, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }}>
            <Image src="/ceondol-2.png" width={320} style={{ transform: 'rotate(-10deg)' }} />
          </Box>

          {/* Decorative SVG Paths */}
          <Box style={{ position: 'absolute', top: '20%', left: '20%', width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.2 }}>
            <svg width="100%" height="100%" viewBox="0 0 600 600">
               <path d="M100,100 Q300,50 500,150 T800,100" stroke="white" strokeWidth="2" strokeDasharray="8 8" fill="none" />
               <path d="M50,400 Q200,500 400,350 T600,450" stroke="white" strokeWidth="2" strokeDasharray="8 8" fill="none" />
            </svg>
          </Box>
        </Box>

        {/* Right Side: Signup Card */}
        <Box style={{ width: '520px', zIndex: 20 }}>
          <Signup />
        </Box>

      </Group>

      {/* Decorative Plane/Hearts */}
      <Box style={{ position: 'absolute', top: '20%', right: '45%', opacity: 0.2 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
           <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
        </svg>
      </Box>
      <Box style={{ position: 'absolute', top: '15%', right: '35%', opacity: 0.15, transform: 'rotate(20deg)' }}>
         <IconHeart size={40} color="white" fill="white" />
      </Box>
    </Box>
  );
}
