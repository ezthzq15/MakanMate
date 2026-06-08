import React, { useState } from 'react';
import { Card, Text, Group, Badge, ActionIcon, Stack, Box } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconStarFilled, IconDotsVertical } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../lib/apiClient';
import { isAuthenticated } from '../../../utils/auth';

/**
 * COMPONENT: NearbyStall
 * Premium food card for the map page.
 * Self-manages bookmark state — no onBookmark prop required from parent.
 */
const NearbyStall = ({ stall, onViewDetails }) => {
  const {
    name,
    cuisine,
    rating = 0,
    distance,
    halal,
    imageURL,
  } = stall;

  const [isSaved, setIsSaved] = useState(stall.isSaved || false);
  const [saving, setSaving]   = useState(false);
  const isAuth                = isAuthenticated();

  const displayName     = name || stall.stallName || 'Unnamed Stall';
  const displayCuisine  = Array.isArray(cuisine) ? cuisine[0] : (cuisine || 'General');
  const displayDistance = typeof distance === 'number' ? `${distance.toFixed(1)} km` : (distance || '—');
  const displayReviews  = stall.reviewCount || 0;

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!isAuth) {
      notifications.show({
        title: 'Login Required',
        message: 'Please login to bookmark stalls',
        color: 'yellow',
      });
      return;
    }
    setSaving(true);
    try {
      const res = await apiClient.post('/engagement/toggle', { stallId: stall.id });
      setIsSaved(res.data.saved);
      notifications.show({
        title: res.data.saved ? 'Stall Bookmarked ❤️' : 'Bookmark Removed',
        message: res.data.saved
          ? `${displayName} added to your favorites`
          : `${displayName} removed from favorites`,
        color: res.data.saved ? 'teal' : 'gray',
      });
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update bookmark', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const checkIsOpen = (hours) => {
    if (!hours) return true;
    if (hours === '24 Hours') return true;
    try {
      const parts = hours.split(' - ');
      if (parts.length !== 2) return true;
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const toMins = (t) => {
        const m = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!m) return 0;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ap = m[3];
        if (ap) {
          if (ap.toUpperCase() === 'PM' && h !== 12) h += 12;
          if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
        }
        return h * 60 + min;
      };
      const start = toMins(parts[0]);
      const end   = toMins(parts[1]);
      return start <= end
        ? currentMins >= start && currentMins <= end
        : currentMins >= start || currentMins <= end;
    } catch {
      return true;
    }
  };

  const isOpen = checkIsOpen(stall.operatingHours);

  return (
    <Card
      radius="xl"
      withBorder
      shadow="sm"
      p={0}
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onClick={onViewDetails}
    >
      {/* Image */}
      <Box pos="relative" style={{ flexShrink: 0, height: 200, overflow: 'hidden' }}>
        <img
          src={imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
          alt={displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />

        {/* Open / Closed */}
        <Box pos="absolute" top={12} left={12}>
          <Badge color={isOpen ? 'green.7' : 'red.7'} variant="filled" size="sm" radius="md" py={12} px={10}>
            {isOpen ? 'Open' : 'Closed'}
          </Badge>
        </Box>

        {/* Bookmark button */}
        <ActionIcon
          pos="absolute"
          top={12}
          right={12}
          variant="white"
          radius="xl"
          size="lg"
          color="red.6"
          loading={saving}
          onClick={handleBookmark}
          style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        >
          {isSaved ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
        </ActionIcon>

        {/* Distance badge */}
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

      {/* Content */}
      <Stack p="md" gap={6}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={900} size="md" lineClamp={1} style={{ letterSpacing: '-0.5px' }}>
            {displayName}
          </Text>
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Group>

        <Group gap={4}>
          <IconStarFilled size={14} color="#fab005" />
          <Text size="sm" fw={800}>{rating}</Text>
          <Text size="xs" c="dimmed">({displayReviews})</Text>
        </Group>

        <Text size="xs" c="dimmed" fw={600}>{displayCuisine}</Text>

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
