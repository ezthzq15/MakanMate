import React, { useEffect, useState } from 'react';
import { Box, Paper, Group, ActionIcon, Title, Text, Stack, Button, Badge } from '@mantine/core';
import { 
  IconCurrentLocation, IconSearch, IconX, IconAlertCircle, 
  IconToolsKitchen, IconCoffee, IconBaguette, IconCircleCheck, 
  IconClock, IconMaximize, IconMinus, IconPlus
} from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import GoogleMapWrapper from './GoogleMapWrapper';
import UserLocationMarker from './UserLocationMarker';
import StallMarker from './StallMarker';
import { useMap } from '../../context/MapContext';
import { useMapMarkers } from '../../hooks/map/useMapMarkers';
import apiClient from '../../lib/apiClient';

/**
 * COMPONENT: NearbyMapView
 * Optimized for the premium food hunting UI.
 */
const NearbyMapView = ({ stalls: initialStalls = [] }) => {
  const { 
    userLocation, 
    mapCenter, 
    setMapCenter, 
    zoom, 
    setZoom,
    selectedStall,
    setSelectedStall,
    refreshLocation,
    geoError
  } = useMap();

  const [stalls, setStalls] = useState(initialStalls);
  const [loading, setLoading] = useState(false);
  const markers = useMapMarkers(stalls);

  const fetchNearby = async (coords) => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stalls/search', {
        params: { lat: coords.lat, lng: coords.lng, limit: 30 }
      });
      setStalls(res.data.stalls || []);
    } catch (err) {
      console.error('Failed to fetch nearby stalls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialStalls.length === 0 && mapCenter) {
      fetchNearby(mapCenter);
    }
  }, [mapCenter, initialStalls.length]);

  return (
    <Box h="100%" w="100%" pos="relative" style={{ overflow: 'hidden', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <GoogleMapWrapper
        center={mapCenter}
        zoom={zoom}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        {/* 0. GPS Error/Permission Fallback */}
        {geoError && (
          <Box pos="absolute" top={20} left={20} style={{ zIndex: 100, maxWidth: 300 }}>
            <Alert variant="filled" color="yellow" title="Location Required" icon={<IconAlertCircle size={16} />} radius="md">
              GPS denied. Showing default area.
            </Alert>
          </Box>
        )}

        {/* 1. Map Markers */}
        <UserLocationMarker position={userLocation} accuracy={userLocation.accuracy} />
        {markers.map((stall) => (
          <StallMarker
            key={stall.id}
            stall={stall}
            isActive={selectedStall?.id === stall.id}
            onClick={(s) => { setSelectedStall(s); setMapCenter(s.position); }}
            onClose={() => setSelectedStall(null)}
            onViewDetails={(id) => window.location.href = `/stall-detail/${id}`}
          />
        ))}
      </GoogleMapWrapper>

      {/* 2. Floating Header Filters */}
      <Box pos="absolute" top={20} left={20} right={20} style={{ zIndex: 10 }}>
        <Paper p="xs" radius="xl" withBorder shadow="md">
          <Group gap="xs" justify="center">
            <Button variant="light" color="green" radius="xl" size="xs" leftSection={<IconToolsKitchen size={14} />}>Restaurants</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs" leftSection={<IconCoffee size={14} />}>Cafes</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs" leftSection={<IconBaguette size={14} />}>Street Food</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs" leftSection={<IconCircleCheck size={14} />}>Halal</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs" leftSection={<IconClock size={14} />}>Open Now</Button>
          </Group>
        </Paper>
      </Box>

      {/* 3. Map Controls (Right) */}
      <Stack pos="absolute" top={20} right={20} gap="xs" style={{ zIndex: 10 }}>
        <ActionIcon size="xl" variant="white" color="gray" radius="md" shadow="md"><IconMaximize size={20} /></ActionIcon>
      </Stack>

      <Stack pos="absolute" bottom={100} right={20} gap="xs" style={{ zIndex: 10 }}>
        <Paper shadow="md" radius="md" p={4} withBorder>
          <Stack gap={4}>
             <ActionIcon size="lg" variant="white" color="gray" onClick={() => setZoom(z => z + 1)}><IconPlus size={20} /></ActionIcon>
             <ActionIcon size="lg" variant="white" color="gray" onClick={() => setZoom(z => z - 1)}><IconMinus size={20} /></ActionIcon>
          </Stack>
        </Paper>
        <ActionIcon size="xl" variant="white" color="brand" radius="md" shadow="md" onClick={refreshLocation}><IconCurrentLocation size={20} /></ActionIcon>
      </Stack>

      {/* 4. Search This Area Button */}
      <Box pos="absolute" bottom={40} left="50%" style={{ zIndex: 10, transform: 'translateX(-50%)' }}>
        <Button 
          variant="filled" 
          color="white" 
          c="dark" 
          radius="xl" 
          shadow="xl" 
          size="md"
          leftSection={<IconSearch size={18} />}
          onClick={() => fetchNearby(mapCenter)}
          loading={loading}
          style={{ border: '1px solid #e9ecef' }}
        >
          Search this area
        </Button>
      </Box>
    </Box>
  );
};

export default NearbyMapView;
