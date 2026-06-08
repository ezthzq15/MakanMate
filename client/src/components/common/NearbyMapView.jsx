import React, { useEffect, useState } from 'react';
import { Box, Paper, Group, ActionIcon, Title, Text, Stack, Button, Badge } from '@mantine/core';
import { 
  IconCurrentLocation, IconSearch, IconX, IconAlertCircle, 
  IconToolsKitchen, IconCoffee, IconBaguette, IconCircleCheck, 
  IconClock, IconMaximize, IconMinus, IconPlus
} from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import { CircleF, PolygonF, MarkerF } from '@react-google-maps/api';
import GoogleMapWrapper from './GoogleMapWrapper';
import UserLocationMarker from './UserLocationMarker';
import StallMarker from './StallMarker';
import { useMap } from '../../context/MapContext';
import { useMapMarkers } from '../../hooks/map/useMapMarkers';

/**
 * HELPER: Generate circular path points for polygon holes (counter-clockwise)
 */
const getCirclePath = (center, radiusMeters) => {
  const points = 72;
  const coords = [];
  const R = 6378137; // Earth's radius in meters
  const centerLatRad = (center.lat * Math.PI) / 180;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    const lat = center.lat + (radiusMeters * Math.cos(theta)) / R * (180 / Math.PI);
    const lng = center.lng + (radiusMeters * Math.sin(theta)) / (R * Math.cos(centerLatRad)) * (180 / Math.PI);
    coords.push({ lat, lng });
  }
  // Reverse coordinates to wind counter-clockwise (hole rule)
  return coords.reverse();
};

/**
 * COMPONENT: NearbyMapView
 * Optimized for the premium food hunting UI.
 */
const NearbyMapView = ({ 
  stalls = [],
  halalOnly, 
  setHalalOnly, 
  openNowOnly, 
  setOpenNowOnly, 
  selectedCuisine, 
  setSelectedCuisine,
  radius,
  isAuthenticated,
  userLocation,
  loading
}) => {
  const { 
    mapCenter, 
    setMapCenter, 
    zoom, 
    setZoom,
    selectedStall,
    setSelectedStall,
    refreshLocation,
    geoError,
    searchedPlace,
    setSearchedPlace,
  } = useMap();

  const [mapInstance, setMapInstance] = useState(null);
  const [draggedCenter, setDraggedCenter] = useState(null);
  const markers = useMapMarkers(stalls);

  // The radius circle must ALWAYS follow the user's real GPS location,
  // not the map view centre (which changes when the user searches a place).
  const circleCenter = (userLocation?.lat && userLocation?.lng)
    ? userLocation
    : mapCenter;

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleDragEnd = () => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      setDraggedCenter({ lat: center.lat(), lng: center.lng() });
    }
  };

  return (
    <Box h="100%" w="100%" pos="relative" style={{ overflow: 'hidden', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <GoogleMapWrapper
        center={mapCenter}
        zoom={zoom}
        onLoad={handleMapLoad}
        onDragEnd={handleDragEnd}
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

        {/* 1. Map Circle or Masked Polygon for Unauthenticated */}
        {circleCenter && circleCenter.lat && circleCenter.lng && (
          isAuthenticated ? (
            <CircleF
              center={circleCenter}
              radius={parseFloat(radius || '5') * 1000}
              options={{
                strokeColor: '#4D6459',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#4D6459',
                fillOpacity: 0.15,
                clickable: false,
                editable: false,
                visible: true,
              }}
            />
          ) : (
            <PolygonF
              paths={[
                [
                  { lat: circleCenter.lat + 2.0, lng: circleCenter.lng - 2.0 },
                  { lat: circleCenter.lat + 2.0, lng: circleCenter.lng + 2.0 },
                  { lat: circleCenter.lat - 2.0, lng: circleCenter.lng + 2.0 },
                  { lat: circleCenter.lat - 2.0, lng: circleCenter.lng - 2.0 },
                  { lat: circleCenter.lat + 2.0, lng: circleCenter.lng - 2.0 }
                ],
                getCirclePath(circleCenter, 1000)
              ]}
              options={{
                fillColor: '#000000',
                fillOpacity: 0.45,
                strokeColor: '#4D6459',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                clickable: false,
                zIndex: 1
              }}
            />
          )
        )}

        {/* 2. Map Markers — stalls */}
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

        {/* 3. Search result pin — shown when the user picks a place from autocomplete */}
        {searchedPlace?.lat && searchedPlace?.lng && (
          <MarkerF
            position={{ lat: searchedPlace.lat, lng: searchedPlace.lng }}
            title={searchedPlace.name || searchedPlace.address || 'Searched location'}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
            onClick={() => setSearchedPlace(null)}
          />
        )}
      </GoogleMapWrapper>

      {/* 2. Floating Header Filters */}
      <Box pos="absolute" top={20} left={20} right={20} style={{ zIndex: 10 }}>
        <Paper p="xs" radius="xl" withBorder shadow="md">
          <Group gap="xs" justify="center">
            <Button variant={selectedCuisine === 'Restaurant' ? "light" : "subtle"} color={selectedCuisine === 'Restaurant' ? "green" : "gray"} radius="xl" size="xs" leftSection={<IconToolsKitchen size={14} />} onClick={() => setSelectedCuisine(selectedCuisine === 'Restaurant' ? null : 'Restaurant')}>Restaurants</Button>
            <Button variant={selectedCuisine === 'Cafe' ? "light" : "subtle"} color={selectedCuisine === 'Cafe' ? "blue" : "gray"} radius="xl" size="xs" leftSection={<IconCoffee size={14} />} onClick={() => setSelectedCuisine(selectedCuisine === 'Cafe' ? null : 'Cafe')}>Cafes</Button>
            <Button variant={selectedCuisine === 'Street Food' ? "light" : "subtle"} color={selectedCuisine === 'Street Food' ? "orange" : "gray"} radius="xl" size="xs" leftSection={<IconBaguette size={14} />} onClick={() => setSelectedCuisine(selectedCuisine === 'Street Food' ? null : 'Street Food')}>Street Food</Button>
            <Button variant={halalOnly ? "light" : "subtle"} color={halalOnly ? "teal" : "gray"} radius="xl" size="xs" leftSection={<IconCircleCheck size={14} />} onClick={() => setHalalOnly(!halalOnly)}>Halal</Button>
            <Button variant={openNowOnly ? "light" : "subtle"} color={openNowOnly ? "red" : "gray"} radius="xl" size="xs" leftSection={<IconClock size={14} />} onClick={() => setOpenNowOnly(!openNowOnly)}>Open Now</Button>
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
      {draggedCenter && (
        <Box pos="absolute" bottom={40} left="50%" style={{ zIndex: 10, transform: 'translateX(-50%)' }}>
          <Button 
            variant="filled" 
            color="white" 
            c="dark" 
            radius="xl" 
            shadow="xl" 
            size="md"
            leftSection={<IconSearch size={18} />}
            onClick={() => {
              setMapCenter(draggedCenter);
              setDraggedCenter(null);
            }}
            loading={loading}
            style={{ border: '1px solid #e9ecef' }}
          >
            Search this area
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NearbyMapView;
