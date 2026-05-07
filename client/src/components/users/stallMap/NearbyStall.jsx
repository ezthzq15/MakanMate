import React from 'react';
import { Card, Image, Text, Group, Badge, ActionIcon, Stack, Box, Avatar, Tooltip } from '@mantine/core';
import { IconHeart, IconStarFilled, IconDotsVertical, IconClock } from '@tabler/icons-react';

/**
 * COMPONENT: NearbyStall
 * A premium food card following the design in the provided mockup.
 */
const NearbyStall = ({ stall, onBookmark, onViewDetails }) => {
  const {
    stallName,
    cuisineType,
    rating = 4.5,
    reviews = 120,
    distance = '0.5 km',
    isHalal,
    isOpen = true,
    imageURL,
    tags = ['Spicy', 'Popular']
  } = stall;

  return (
    <Card radius="xl" withBorder shadow="sm" p={0} style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease' }} onClick={onViewDetails}>
      <Box pos="relative">
        <Image
          src={imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
          height={160}
          alt={stallName}
          style={{ transition: 'scale 0.3s ease' }}
        />
        
        {/* Badges Overlay */}
        <Box pos="absolute" top={12} left={12}>
          <Badge color="green.7" variant="filled" size="sm" radius="md" py={12} px={10}>
            Open
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
          <IconHeart size={18} fill={stall.isBookmarked ? 'currentColor' : 'none'} />
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
          {distance}
        </Badge>
      </Box>

      <Stack p="md" gap={6}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={900} size="md" lineClamp={1} style={{ letterSpacing: '-0.5px' }}>{stallName}</Text>
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Group>

        <Group gap={4}>
          <IconStarFilled size={14} color="#fab005" />
          <Text size="sm" fw={800}>{rating}</Text>
          <Text size="xs" c="dimmed">({reviews})</Text>
        </Group>

        <Text size="xs" c="dimmed" fw={600}>
          {cuisineType} • {stall.type || 'Noodles'}
        </Text>

        <Group gap={6} mt={4}>
          <Badge variant="light" color="red" size="xs" radius="sm">Spicy</Badge>
          <Badge variant="light" color="green" size="xs" radius="sm">Muslim Friendly</Badge>
        </Group>
      </Stack>
    </Card>
  );
};

export default NearbyStall;
