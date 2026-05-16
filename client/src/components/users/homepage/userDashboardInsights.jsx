import React from 'react';
import { 
  Box, Grid, Title, Group, Button, Card, Image, Text, Badge, 
  Stack, Progress, ThemeIcon, Avatar, Paper 
} from '@mantine/core';
import { 
  IconMapPin, IconArrowRight, IconMap, IconToolsKitchen2, 
  IconCoffee, IconBread 
} from '@tabler/icons-react';

const UserDashboardInsights = ({ data }) => {
  // Fallback to mock if real data is missing
  const nearby = data?.nearbyRestaurants || [];
  const trending = data?.trendingFoods || [];

  const visited = nearby.length >= 2 ? nearby.slice(0, 2).map(item => ({
    id: item.id,
    name: item.name,
    location: item.cuisine + ' cuisine',
    date: 'Recently added',
    image: item.image
  })) : [
    {
      id: 1,
      name: 'Ah Fatt Charcoal Char Kway Teow',
      location: 'Georgetown, Penang',
      date: 'Dec 14, 2023',
      image: 'https://images.unsplash.com/photo-1626804475297-4160bbcebb1b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      name: 'Ayer Itam Laksa',
      location: 'Air Itam, Penang',
      date: 'Dec 10, 2023',
      image: 'https://images.unsplash.com/photo-1596450514735-3b9eafb1db84?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const savedStalls = data?.savedStalls || [];
  const displaySaved = savedStalls.length > 0 ? savedStalls.slice(0, 3).map((item, index) => ({
    id: item.id,
    name: item.name,
    visits: `${item.reviews || 0} reviews`,
    icon: index === 0 ? IconToolsKitchen2 : index === 1 ? IconCoffee : IconBread,
    frequent: index === 0
  })) : [
    { id: 1, name: 'Nasi Kandar Deen', visits: '8 visits this month', icon: IconToolsKitchen2, frequent: true },
    { id: 2, name: 'Toh Soon Cafe', visits: '5 visits this month', icon: IconCoffee, frequent: false },
    { id: 3, name: 'Maliia Bakery', visits: '4 visits this month', icon: IconBread, frequent: false },
  ];

  // Derive Taste Profile from available data
  const allStalls = [...nearby, ...trending];
  const cuisineCounts = {};
  allStalls.forEach(s => {
    if (s.cuisine) {
      cuisineCounts[s.cuisine] = (cuisineCounts[s.cuisine] || 0) + 1;
    }
  });
  
  const totalCuisines = Object.values(cuisineCounts).reduce((a, b) => a + b, 0);
  const tasteProfile = Object.entries(cuisineCounts)
    .map(([cuisine, count]) => ({
      cuisine,
      percent: Math.round((count / totalCuisines) * 100)
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  // Fallback if no cuisines found
  const finalTasteProfile = tasteProfile.length > 0 ? tasteProfile : [
    { cuisine: 'Malay Cuisine', percent: 60 },
    { cuisine: 'Thai', percent: 20 },
    { cuisine: 'Western', percent: 20 }
  ];

  return (
    <Box py={40} px={{ base: 'md', md: 'xl' }} maw={1400} mx="auto">
      <Grid gutter={40}>
        
        {/* LEFT COLUMN: Recently Visited & Heatmap */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap={40}>
            
            {/* Recently Visited */}
            <Box>
              <Group justify="space-between" mb="lg">
                <Title order={2} size="h3" fw={800}>Recently Visited</Title>
                <Button 
                  variant="subtle" 
                  color="gray" 
                  radius="xl" 
                  size="xs"
                  bg="gray.1"
                  c="dimmed"
                  rightSection={<IconArrowRight size={14} />}
                >
                  View All History
                </Button>
              </Group>

              <Grid>
                {visited.map((item) => (
                  <Grid.Col span={{ base: 12, sm: 6 }} key={item.id}>
                    <Box style={{ position: 'relative' }}>
                      <Card p={0} radius="xl" style={{ overflow: 'hidden' }}>
                        <Image 
                          src={item.image} 
                          h={200}
                          style={{ objectFit: 'cover' }}
                        />
                      </Card>
                      <Badge 
                        size="lg" 
                        radius="xl" 
                        color="gray.0" 
                        c="dark" 
                        fw={700}
                        style={{ position: 'absolute', top: 15, left: 15, textTransform: 'none' }}
                      >
                        {item.date}
                      </Badge>
                      {/* Fake yellow dots top right */}
                      <Group gap={6} style={{ position: 'absolute', top: 15, right: 15 }}>
                        <Box w={12} h={12} bg="yellow" style={{ borderRadius: '50%' }} />
                        <Box w={12} h={12} bg="yellow" style={{ borderRadius: '50%' }} />
                      </Group>
                    </Box>
                    <Box mt="md">
                      <Title order={4} fw={800}>{item.name}</Title>
                      <Group gap="xs" mt={4}>
                        <IconMapPin size={16} color="var(--mantine-color-olive-7)" />
                        <Text size="sm" c="dimmed" fw={600}>{item.location}</Text>
                      </Group>
                    </Box>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>

            {/* Seasonal Culinary Heatmap */}
            <Paper radius="xl" p={40} bg="#F7F8F4" style={{ position: 'relative', overflow: 'hidden' }}>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 7 }} style={{ zIndex: 1 }}>
                  <Text size="xs" fw={800} c="yellow.7" tt="uppercase" letterSpacing={1} mb={8}>
                    Region Statistics
                  </Text>
                  <Title order={2} style={{ color: '#3A5A4A' }} mb="md" fw={800} lh={1.2}>
                    Seasonal Culinary<br/>Heatmap
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.6} mb={30} pr={{ base: 0, sm: 'xl' }}>
                    You've explored 65% of the island's culinary hotspots this season. Georgetown remains your most visited district with 14 unique stops.
                  </Text>

                  <Group gap="md" mb={30}>
                    <Paper radius="md" p="md" bg="white" style={{ flex: 1 }}>
                      <Text size="xs" fw={800} c="dimmed" tt="uppercase">George Town</Text>
                      <Text fw={800} style={{ color: '#3A5A4A' }} size="lg">Heavy Activity</Text>
                    </Paper>
                    <Paper radius="md" p="md" bg="white" style={{ flex: 1 }}>
                      <Text size="xs" fw={800} c="dimmed" tt="uppercase">Bayan Lepas</Text>
                      <Text fw={800} style={{ color: '#3A5A4A' }} size="lg">Growing Interest</Text>
                    </Paper>
                  </Group>

                  <Button radius="xl" size="md" color="#4D6459" fw={600}>
                    Explore District Guides
                  </Button>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 5 }} style={{ position: 'relative' }}>
                  {/* Decorative Map Illustration */}
                  <Box style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box style={{
                      width: 280, height: 280, borderRadius: '50%',
                      background: 'rgba(215, 222, 208, 0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Box style={{
                        width: 200, height: 200, borderRadius: '50%',
                        background: '#D7DED0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <IconMap size={60} color="#889D8C" stroke={1.5} />
                        {/* decorative dots */}
                        <Box w={10} h={10} bg="olive.8" style={{ borderRadius: '50%', position: 'absolute', top: 40, right: 40 }} />
                        <Box w={8} h={8} bg="olive.5" style={{ borderRadius: '50%', position: 'absolute', bottom: 60, left: 30 }} />
                      </Box>
                    </Box>
                  </Box>
                </Grid.Col>
              </Grid>
            </Paper>

          </Stack>
        </Grid.Col>


        {/* RIGHT COLUMN: Taste Profile & Top Spots */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper radius="xl" p={30} bg="#F5F5F5" h="100%">
            <Stack gap={40}>
              
              {/* Taste Profile */}
              <Box>
                <Title order={3} fw={800} mb={30}>Taste Profile</Title>
                <Stack gap="xl">
                  {finalTasteProfile.map((item, index) => (
                    <Box key={item.cuisine}>
                      <Group justify="space-between" mb={8}>
                        <Text size="xs" fw={800} c="dimmed" tt="uppercase" letterSpacing={1}>{item.cuisine}</Text>
                        <Text size="sm" fw={800} c="dark">{item.percent}%</Text>
                      </Group>
                      <Progress 
                        value={item.percent} 
                        size="md" 
                        color={index === 0 ? "#526E5D" : index === 1 ? "#90B29D" : "#B5A93D"} 
                        radius="xl" 
                        bg="gray.3" 
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Saved Stalls */}
              <Box>
                <Title order={3} fw={800} mb="lg">Saved Stalls</Title>
                <Stack gap="sm">
                  {displaySaved.map((spot) => (
                    <Paper key={spot.id} p="md" radius="lg" bg="white" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar color="teal" radius="xl" size="lg" bg="#80A18E" c="white">
                        <spot.icon size={20} />
                      </Avatar>
                      <Box style={{ flex: 1 }}>
                        <Text fw={800} size="sm">{spot.name}</Text>
                        <Text size="xs" c="dimmed" fw={600}>{spot.visits}</Text>
                      </Box>
                      {spot.frequent && (
                        <Badge size="xs" color="yellow.1" c="yellow.9" radius="sm" fw={800}>
                          FREQUENT
                        </Badge>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </Box>

            </Stack>
          </Paper>
        </Grid.Col>

      </Grid>
    </Box>
  );
};

export default UserDashboardInsights;
