import React, { useState } from 'react';
import {
  Card, Image, Text, Badge, Group, Stack, Box,
  ActionIcon, Button, SimpleGrid, useMantineTheme
} from '@mantine/core';
import {
  IconStarFilled, IconMapPin, IconHeart, IconHeartFilled,
  IconDotsVertical, IconNavigation, IconSearch
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../../utils/auth';
import apiClient from '../../../lib/apiClient';
import { useNavigate } from 'react-router-dom';

const StallCard = ({ stall, onRemove, alwaysSaved = false }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(alwaysSaved || stall?.isSaved || false);
  const [saving, setSaving] = useState(false);
  const isAuth = isAuthenticated();

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    if (!isAuth) {
      notifications.show({ title: 'Login Required', message: 'Please login to bookmark stalls', color: 'yellow' });
      return;
    }
    // If on bookmarks page just call onRemove directly
    if (alwaysSaved && onRemove) {
      onRemove();
      return;
    }
    setSaving(true);
    try {
      const res = await apiClient.post('/engagement/toggle', { stallId: stall.id });
      setIsSaved(res.data.saved);
      notifications.show({
        title: res.data.saved ? 'Stall Bookmarked' : 'Bookmark Removed',
        message: res.data.saved ? 'Added to your favorites' : 'Removed from favorites',
        color: res.data.saved ? 'teal' : 'gray'
      });
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update bookmark', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (stall?.location?.lat && stall?.location?.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${stall.location.lat},${stall.location.lng}`, '_blank');
    } else {
      const query = encodeURIComponent(`${stall?.name || 'Food Stall'} Penang`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  return (
    <Card
      radius="lg"
      withBorder
      p={0}
      shadow="sm"
      style={{
        overflow: 'hidden',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = theme.shadows.md; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadows.sm; }}
      onClick={() => navigate(`/stall-detail/${stall.id}`)}
    >
      {/* ── IMAGE: locked to 200px, portrait photos are cropped not stretched ── */}
      <Box pos="relative" style={{ flexShrink: 0, height: 200, overflow: 'hidden' }}>
        <img
          src={stall?.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600'}
          alt={stall?.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
        {/* Heart / Bookmark */}
        <ActionIcon
          pos="absolute" top={12} right={12}
          variant="filled"
          color={isSaved ? 'red' : 'gray'}
          radius="xl" size="lg"
          loading={saving}
          onClick={handleToggleBookmark}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        >
          {isSaved ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
        </ActionIcon>
      </Box>

      {/* ── CONTENT: grows to fill, buttons pinned at bottom ── */}
      <Stack
        p="md"
        gap={6}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        {/* Top info */}
        <Box>
          <Text fw={900} size="sm" lineClamp={1} mb={4}>{stall?.name}</Text>

          <Group justify="space-between" wrap="nowrap" mb={6}>
            <Group gap={4}>
              <IconStarFilled size={13} color="#fab005" />
              <Text size="xs" fw={800}>{parseFloat(stall?.rating || 0).toFixed(1)}</Text>
            </Group>
            <Group gap={4}>
              <IconMapPin size={13} color={theme.colors.gray[5]} />
              <Text size="xs" c="dimmed" fw={700}>
                {stall?.distance != null ? `${stall.distance.toFixed(1)} km` : '—'}
              </Text>
            </Group>
          </Group>

          <Group gap={4} wrap="wrap" mb={4}>
            {stall?.cuisine?.slice(0, 2).map(c => (
              <Badge key={c} variant="light" color="green" size="xs" radius="xs">{c}</Badge>
            ))}
            {stall?.halal && (
              <Badge variant="light" color="teal" size="xs" radius="xs">Halal</Badge>
            )}
          </Group>

          <Text fw={800} size="xs" c="dimmed">{stall?.priceRange || '$$'}</Text>
        </Box>

        {/* Buttons always at bottom */}
        <SimpleGrid cols={2} spacing="xs" mt={6}>
          <Button
            variant="subtle" color="gray" size="xs" radius="md"
            leftSection={<IconSearch size={13} />}
            fw={700}
            onClick={(e) => { e.stopPropagation(); navigate(`/stall-detail/${stall.id}`); }}
          >
            Details
          </Button>
          <Button
            variant="filled" color="var(--mm-color-primary, #3b5d4f)" size="xs" radius="md"
            leftSection={<IconNavigation size={13} />}
            fw={700}
            onClick={handleNavigate}
          >
            Navigate
          </Button>
        </SimpleGrid>
      </Stack>
    </Card>
  );
};

export default StallCard;
