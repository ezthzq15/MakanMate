import React from 'react';
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

const HomepageUI = ({ data }) => {
  if (!data) return null;

  return (
    <Box>
      {/* 1. Hero Section */}
      <Box 
        style={{ 
          position: 'relative', 
          height: '500px', 
          backgroundImage: `url(${data.hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.3)' 
          }} 
        />
        <Container size="xl" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Title order={1} style={{ color: '#fff', fontSize: '56px', maxWidth: '600px', fontWeight: 900, lineHeight: 1.1 }}>
            {data.hero.title}
          </Title>
        </Container>
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

      {/* 3. Featured Item (Chendul) */}
      <Container size="xl" my={80}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} align="center">
          <Box style={{ position: 'relative' }}>
             <Image 
              src={data.featuredItem.mainImage} 
              radius="lg" 
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            />
            <Group gap="xs" style={{ position: 'absolute', top: 20, right: 20 }}>
              <Badge color="yellow" size="lg" radius="sm" fw={700}>
                Muslim Friendly
              </Badge>
              <Badge color="blue" size="lg" radius="sm" fw={700} leftSection={<IconStar size={14} fill="currentColor" />}>
                {data.featuredItem.rating}
              </Badge>
            </Group>
          </Box>
          
          <Stack gap="xl">
            <Box>
              <Title order={2} style={{ fontSize: '42px', fontWeight: 800 }}>
                {data.featuredItem.title}
              </Title>
              <Text mt="md" size="lg" style={{ color: '#666', lineHeight: 1.6 }}>
                {data.featuredItem.description}
              </Text>
            </Box>

            <Box>
              <Text fw={700} size="xl" mb="md">Top Picked</Text>
              <Group gap="xl">
                {data.featuredItem.topPicked.map((pick, i) => (
                  <Stack key={i} align="center" gap="xs">
                    <Image src={pick.image} h={80} w={80} radius="100%" />
                    <Text size="xs" fw={500} style={{ color: '#0066cc', borderBottom: '1px solid #0066cc' }}>
                      {pick.label}
                    </Text>
                  </Stack>
                ))}
              </Group>
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* 4. Similar Restaurants */}
      <Container size="xl" mb={80}>
        <Group justify="space-between" mb="xl">
          <Title order={2} style={{ fontSize: '28px', fontWeight: 700 }}>Similar Restaurants Near You</Title>
          <ActionIcon variant="outline" color="gray" radius="xl" size="lg">
            <IconChevronRight size={20} />
          </ActionIcon>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {data.nearbyRestaurants.map((res) => (
            <Card key={res.id} padding={0} radius="lg" style={{ border: 'none', background: 'none' }}>
              <Image src={res.image} radius="lg" h={200} mb="md" />
              <Stack gap={4}>
                <Text fw={700} size="md">{res.name}</Text>
                <Text size="xs" style={{ color: '#888' }} lineClamp={2}>{res.description}</Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* 5. Trending Foods */}
      <Container size="xl" mb={100}>
        <Group justify="space-between" mb="xl">
          <Title order={2} style={{ fontSize: '28px', fontWeight: 700 }}>Trending Foods</Title>
          <ActionIcon variant="outline" color="gray" radius="xl" size="lg">
            <IconChevronRight size={20} />
          </ActionIcon>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {data.trendingFoods.map((food, i) => (
            <Card key={food.id} padding={0} radius="lg" style={{ border: 'none', background: 'none', position: 'relative' }}>
               <Box style={{ 
                position: 'absolute', 
                top: 10, 
                left: 10, 
                zIndex: 2,
                backgroundColor: '#104e5d', 
                color: 'white', 
                width: 24, 
                height: 24, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {i + 1}
              </Box>
              <Image src={food.image} radius="lg" h={200} mb="md" />
              <Stack gap={4}>
                <Text fw={700} size="md">{food.name}</Text>
                <Text size="xs" style={{ color: '#888' }} lineClamp={2}>{food.description}</Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HomepageUI;
