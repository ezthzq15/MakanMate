import React from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Text, Group, Badge, Stack, Box, Image, Button } from '@mantine/core';
import { IconStarFilled, IconChevronRight } from '@tabler/icons-react';

/**
 * COMPONENT: StallMarker
 * Renders a specific food stall on the map.
 * Supports "Active" state for showing InfoWindows.
 */
const StallMarker = ({ 
  stall, 
  isActive, 
  onClick, 
  onClose,
  onViewDetails 
}) => {
  const position = stall.position;

  if (!position) return null;

  return (
    <MarkerF
      position={position}
      onClick={() => onClick?.(stall)}
      icon={{
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Default icon, can be customized
        scaledSize: new window.google.maps.Size(40, 40),
      }}
    >
      {isActive && (
        <InfoWindowF position={position} onCloseClick={onClose}>
          <Box p={5} style={{ maxWidth: 220 }}>
            <Stack gap="xs">
              <Image 
                src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200'} 
                height={100} 
                radius="md" 
              />
              <Box>
                <Text fw={800} size="sm" lineClamp={1}>{stall.stallName || stall.name}</Text>
                <Group gap={4} mt={2}>
                  <IconStarFilled size={12} color="#fab005" />
                  <Text size="xs" fw={700}>{stall.rating || '0.0'}</Text>
                  <Text size="xs" c="dimmed">•</Text>
                  <Text size="xs" c="dimmed" truncate>{stall.cuisineType || stall.cuisine?.join(', ')}</Text>
                </Group>
              </Box>
              
              <Button 
                variant="light" 
                size="compact-xs" 
                fullWidth 
                radius="md"
                rightSection={<IconChevronRight size={12} />}
                onClick={() => onViewDetails?.(stall.id)}
              >
                View Stall
              </Button>
            </Stack>
          </Box>
        </InfoWindowF>
      )}
    </MarkerF>
  );
};

export default StallMarker;
