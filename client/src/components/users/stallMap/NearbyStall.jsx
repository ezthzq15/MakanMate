import React from 'react';
import { Card, Image, Text, Group, Badge, ActionIcon, Stack, Box, Avatar, Tooltip } from '@mantine/core';
import { IconHeart, IconStarFilled, IconDotsVertical, IconClock } from '@tabler/icons-react';

/**
 * COMPONENT: NearbyStall
 * A premium food card following the design in the provided mockup.
 */
const NearbyStall = ({ stall, onBookmark, onViewDetails }) => {
  const {
    name,
    cuisine,
    rating = 0,
    distance,
    halal,
    imageURL,
  } = stall;

  const displayName = name || stall.stallName || 'Unnamed Stall';
  const displayCuisine = Array.isArray(cuisine) ? cuisine[0] : (cuisine || 'General');
  const displayDistance = typeof distance === 'number' ? `${(distance / 1000).toFixed(1)} km` : (distance || '—');
  const displayReviews = stall.reviewCount || 0; // Use reviewCount if available

  const checkIsOpen = (hours) => {
    if (!hours) return true; // Default to open if not specified
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
        // Overnight case (e.g., 10:00 PM - 02:00 AM)
        return currentTimeInMinutes >= startMinutes || currentTimeInMinutes <= endMinutes;
      }
    } catch (e) {
      console.error('Failed to parse operating hours', e);
      return true; // Fallback to open
    }
  };

  const isOpen = checkIsOpen(stall.operatingHours);

  return (
    <Card radius="xl" withBorder shadow="sm" p={0} style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease', display: 'flex', flexDirection: 'column', height: '100%' }} onClick={onViewDetails}>
      <Box pos="relative" style={{ flexShrink: 0, height: 200, overflow: 'hidden' }}>
        <img
          src={imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
          alt={displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        
        {/* Badges Overlay */}
        <Box pos="absolute" top={12} left={12}>
          <Badge color={isOpen ? "green.7" : "red.7"} variant="filled" size="sm" radius="md" py={12} px={10}>
            {isOpen ? 'Open' : 'Closed'}
          </Badge>
        </Box>

        <ActionIcon 
          pos="absolute" 
          top={12} 
          right={12} 
          variant="white" 
          radius="xl" 
          size="lg"
          color="red.6"
          onClick={(e) => { e.stopPropagation(); onBookmark?.(); }}
          style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        >
          <IconHeart size={18} fill={stall.isSaved ? 'currentColor' : 'none'} />
        </ActionIcon>

        <Badge 
          pos="absolute" 
          bottom={12} 
          right={12} 
          variant="white" 
          c="dark"
          size="sm"
          radius="md"
          py={10}
        >
          {displayDistance}
        </Badge>
      </Box>

      <Stack p="md" gap={6}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={900} size="md" lineClamp={1} style={{ letterSpacing: '-0.5px' }}>{displayName}</Text>
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Group>

        <Group gap={4}>
          <IconStarFilled size={14} color="#fab005" />
          <Text size="sm" fw={800}>{rating}</Text>
          <Text size="xs" c="dimmed">({displayReviews})</Text>
        </Group>

        <Text size="xs" c="dimmed" fw={600}>
          {displayCuisine}
        </Text>

        <Group gap={6} mt={4}>
          {stall.spiceLevel && stall.spiceLevel !== 'None' && (
            <Badge variant="light" color="red" size="xs" radius="sm">Spicy</Badge>
          )}
          {halal && (
            <Badge variant="light" color="green" size="xs" radius="sm">Muslim Friendly</Badge>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default NearbyStall;
