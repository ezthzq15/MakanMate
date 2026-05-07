import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Center, Loader, Text, Stack } from '@mantine/core';
import { IconMapOff } from '@tabler/icons-react';
import useGoogleMapsLoader from '../../hooks/map/useGoogleMapsLoader';

/**
 * COMPONENT: GoogleMapWrapper
 * The single source of truth for loading and rendering a Google Map.
 * Wraps the @react-google-maps/api GoogleMap component with a design-system-compliant loader.
 */

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '24px',
};

const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    // Custom "Clean" Map Styles (optional but recommended for premium feel)
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const GoogleMapWrapper = ({ 
  children, 
  center = { lat: 3.1390, lng: 101.6869 }, // Default to KL
  zoom = 13,
  onLoad,
  onUnmount,
  options = {},
  ...props 
}) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();

  if (loadError) {
    return (
      <Center h="100%" style={{ backgroundColor: '#f8f9fa', borderRadius: '24px' }}>
        <Stack align="center" gap="xs">
          <IconMapOff size={48} color="red" />
          <Text fw={700}>Failed to load Google Maps</Text>
          <Text size="sm" c="dimmed">Check your internet connection or API key.</Text>
        </Stack>
      </Center>
    );
  }

  if (!isLoaded) {
    return (
      <Center h="100%" style={{ backgroundColor: '#f8f9fa', borderRadius: '24px' }}>
        <Stack align="center" gap="md">
          <Loader size="xl" color="brand" type="dots" />
          <Text size="sm" fw={600} c="dimmed">Initializing Map...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ ...defaultOptions, ...options }}
      {...props}
    >
      {children}
    </GoogleMap>
  );
};

export default GoogleMapWrapper;
