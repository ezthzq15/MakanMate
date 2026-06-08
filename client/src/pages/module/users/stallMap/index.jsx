import React, { useState, useEffect } from 'react';
import { 
  Container, Title, Text, Stack, Box, Grid, Paper, 
  Group, Badge, ActionIcon, SimpleGrid, Button,
  Divider, Loader, Center, Slider, Tooltip
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
  const { mapCenter, userLocation } = useMap();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem('token');
  const [radius, setRadius] = useState(isAuthenticated ? '5' : '2');
  
  // Filter States
  const [halalOnly, setHalalOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [muslimFriendlyOnly, setMuslimFriendlyOnly] = useState(false);

  const fetchStalls = async () => {
    setLoading(true);
    try {
      // Use mapCenter as search center to support searching other areas, falling back to user location
      const searchCenter = mapCenter || userLocation;
      
      const params = { 
        lat: searchCenter.lat, 
        lng: searchCenter.lng, 
        radius: (isAuthenticated ? parseFloat(radius) : 2) * 1000 
      };
      
      if (halalOnly)          params.halal = 'yes';
      if (muslimFriendlyOnly) params.halalTags = 'muslimFriendly';
      if (selectedCuisine)    params.cuisines = selectedCuisine;

      const res = await apiClient.get('/stalls/search', { params });
      setStalls(res.data.stalls || []);
    } catch (err) {
      console.error('Failed to fetch stalls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mapCenter) fetchStalls();
  }, [mapCenter, userLocation, radius, halalOnly, openNowOnly, muslimFriendlyOnly, selectedCuisine]);

  // Helper to check if open (replicated from NearbyStall)
  const checkIsOpen = (hours) => {
    if (!hours) return true;
    if (hours === '24 Hours') return true;
    try {
      const parts = hours.split(' - ');
      if (parts.length !== 2) return true;
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      const parseTimeToMinutes = (timeStr) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
        return hours * 60 + minutes;
      };
      
      const startMinutes = parseTimeToMinutes(parts[0]);
      const endMinutes = parseTimeToMinutes(parts[1]);
      
      if (startMinutes <= endMinutes) {
        return currentTimeInMinutes >= startMinutes && currentTimeInMinutes <= endMinutes;
      } else {
        return currentTimeInMinutes >= startMinutes || currentTimeInMinutes <= endMinutes;
      }
    } catch (e) {
      return true;
    }
  };

  const mapStalls = React.useMemo(() => {
    let result = stalls;
    if (openNowOnly) {
      result = result.filter(s => checkIsOpen(s.operatingHours));
    }
    const maxDistance = isAuthenticated ? parseFloat(radius) : 2;
    result = result.filter(s => s.distance === null || s.distance === undefined || s.distance <= maxDistance);
    return result;
  }, [stalls, openNowOnly, isAuthenticated, radius]);

  const listStalls = React.useMemo(() => {
    return mapStalls;
  }, [mapStalls]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* TOP SECTION: SIDEBAR + MAP */}
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MapSearch 
              halalOnly={halalOnly} 
              setHalalOnly={setHalalOnly}
              openNowOnly={openNowOnly}
              setOpenNowOnly={setOpenNowOnly}
              selectedCuisine={selectedCuisine}
              setSelectedCuisine={setSelectedCuisine}
              muslimFriendlyOnly={muslimFriendlyOnly}
              setMuslimFriendlyOnly={setMuslimFriendlyOnly}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <Box h={{ base: 350, sm: 500, md: 700, lg: 800 }}>
              <NearbyMapView 
                stalls={mapStalls} 
                halalOnly={halalOnly} 
                setHalalOnly={setHalalOnly}
                openNowOnly={openNowOnly}
                setOpenNowOnly={setOpenNowOnly}
                selectedCuisine={selectedCuisine}
                setSelectedCuisine={setSelectedCuisine}
                radius={radius}
                isAuthenticated={isAuthenticated}
                userLocation={userLocation}
              />
            </Box>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        {/* BOTTOM SECTION: LIST VIEW */}
        <Box mt={40}>
          <Group justify="space-between" mb="xl">
            <Group gap="xl" align="center" style={{ flex: 1 }}>
               <Title order={2} fw={900} style={{ fontSize: '32px', letterSpacing: '-1px' }}>
                 Restaurants near you
               </Title>

               {/* Radius Slider — snaps to 1km, 5km, 10km, Whole Penang (50km) */}
               <Box style={{ width: 300 }}>
                 <Group justify="space-between" mb={6}>
                   <Group gap={4}>
                     <IconMapPin size={14} color="gray" />
                     <Text size="xs" fw={700} c="dimmed">Search radius</Text>
                   </Group>
                   <Text size="xs" fw={900} c="var(--mm-color-primary)">
                     {radius === '50' ? 'Whole Penang (50 km)' : `${radius} km`}
                   </Text>
                 </Group>
                 <Slider
                   min={0}
                   max={3}
                   step={1}
                    value={(isAuthenticated ? ['1','5','10','50'] : ['2','5','10','50']).indexOf(radius) !== -1 ? (isAuthenticated ? ['1','5','10','50'] : ['2','5','10','50']).indexOf(radius) : 0}
                    onChange={(idx) => {
                      const km = (isAuthenticated ? ['1','5','10','50'] : ['2','5','10','50'])[idx];
                      if (!isAuthenticated && km !== '2') return; // guests locked to 2km
                      setRadius(km);
                    }}
                    color="var(--mm-color-primary)"
                    size="md"
                    radius="xl"
                    marks={[
                      { value: 0, label: isAuthenticated ? '1 km' : '2 km' },
                      { value: 1, label: isAuthenticated ? '5 km' : '5 km 🔒' },
                      { value: 2, label: isAuthenticated ? '10 km' : '10 km 🔒' },
                      { value: 3, label: isAuthenticated ? 'Whole Penang' : 'Whole Penang 🔒' },
                    ]}
                   styles={{
                     markLabel: { fontSize: 11, fontWeight: 700, marginTop: 6 },
                     thumb: { borderColor: 'var(--mm-color-primary)' },
                   }}
                 />
               </Box>

               {!isAuthenticated && (
                 <Text size="xs" c="dimmed" fw={700}>
                   Sign up to unlock Whole Penang (50 km)!
                 </Text>
               )}
            </Group>
            <Button variant="subtle" color="gray" rightSection={<IconArrowRight size={16} />} fw={800}>
              View all
            </Button>
          </Group>

          {loading ? (
            <Center py={100}><Loader color="brand" type="dots" /></Center>
          ) : listStalls.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={30}>
              {listStalls.map((stall) => (
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