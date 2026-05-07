import React, { useState, useEffect } from 'react';
import { 
  Container, Title, Text, Stack, Box, Grid, Paper, 
  Group, Badge, ActionIcon, Select, SimpleGrid, Button,
  Divider, Loader, Center
} from '@mantine/core';
import { IconMapPin, IconChevronRight, IconAdjustmentsHorizontal, IconArrowRight } from '@tabler/icons-react';
import NearbyMapView from '../../../../components/common/NearbyMapView';
import MapSearch from '../../../../components/users/stallMap/MapSearch';
import NearbyStall from '../../../../components/users/stallMap/NearbyStall';
import { MapProvider, useMap } from '../../../../context/MapContext';
import apiClient from '../../../../lib/apiClient';

/**
 * COMPONENT: StallMapContent
 * The actual content of the map page, wrapped inside MapProvider.
 */
const StallMapContent = () => {
  const { mapCenter } = useMap();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem('token');
  const [radius, setRadius] = useState(isAuthenticated ? '5' : '2');

  const fetchStalls = async () => {
    setLoading(true);
    try {
      // Mocking or fetching real stalls based on location
      const res = await apiClient.get('/stalls/search', {
        params: { lat: mapCenter.lat, lng: mapCenter.lng, radius: radius * 1000 }
      });
      setStalls(res.data.stalls || []);
    } catch (err) {
      console.error('Failed to fetch stalls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mapCenter) fetchStalls();
  }, [mapCenter, radius]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* TOP SECTION: SIDEBAR + MAP */}
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MapSearch />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <Box h={850}>
              <NearbyMapView stalls={stalls} />
            </Box>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        {/* BOTTOM SECTION: LIST VIEW */}
        <Box mt={40}>
          <Group justify="space-between" mb="xl">
            <Group gap="md">
               <Title order={2} fw={900} style={{ fontSize: '32px', letterSpacing: '-1px' }}>
                 Restaurants near you
               </Title>
               <Select
                variant="filled"
                radius="xl"
                size="xs"
                data={[
                  { value: '1', label: 'Within 1 km' },
                  { value: '2', label: 'Within 2 km' },
                  { value: '5', label: 'Within 5 km (Member Only)', disabled: !isAuthenticated },
                  { value: '10', label: 'Within 10 km (Member Only)', disabled: !isAuthenticated },
                ]}
                value={radius}
                onChange={setRadius}
                styles={{ input: { backgroundColor: '#f8f9fa', border: 'none', fontWeight: 800 } }}
                leftSection={<IconMapPin size={14} color="gray" />}
               />
               {!isAuthenticated && (
                 <Text size="xs" c="dimmed" fw={700}>
                   Sign up to unlock 10km range!
                 </Text>
               )}
            </Group>
            <Button variant="subtle" color="gray" rightSection={<IconArrowRight size={16} />} fw={800}>
              View all
            </Button>
          </Group>

          {loading ? (
            <Center py={100}><Loader color="brand" type="dots" /></Center>
          ) : stalls.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={30}>
              {stalls.map((stall) => (
                <NearbyStall 
                  key={stall.id} 
                  stall={stall} 
                  onViewDetails={() => window.location.href = `/stall-detail/${stall.id}`}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Paper p={100} radius="24px" withBorder style={{ textAlign: 'center', borderStyle: 'dashed', backgroundColor: '#fcfcfc' }}>
              <Text c="dimmed" fw={700}>No stalls found in this area. Try moving the map!</Text>
            </Paper>
          )}
        </Box>

        {/* FOOTER CALL TO ACTION */}
        <Paper p={40} radius="32px" bg="#0a3d2e" mt={60} style={{ color: 'white' }}>
          <Grid align="center" gutter={40}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group gap="xl">
                 <Box w={80} h={80}>
                    <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" style={{ width: '100%', filter: 'brightness(0) invert(1)' }} alt="map" />
                 </Box>
                 <Box>
                    <Title order={2} fw={900}>Discover more around Penang!</Title>
                    <Text size="sm" style={{ opacity: 0.8 }}>Use the map to find the best food spots near you.</Text>
                 </Box>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }} style={{ textAlign: 'right' }}>
              <Button size="lg" radius="xl" color="white" c="dark" leftSection={<IconMapPin size={18} />} fw={900}>
                Explore on Map
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
};

const StallMapPage = () => {
  return (
    <MapProvider>
      <StallMapContent />
    </MapProvider>
  );
};

export default StallMapPage;