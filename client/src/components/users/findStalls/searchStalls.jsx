import React, { useState } from 'react';
import {
  SimpleGrid, Card, Text, Stack, Box, Group, Badge, Image,
  ActionIcon, Button, useMantineTheme, Skeleton, Center
} from '@mantine/core';
import {
  IconToolsKitchen2, IconSearch, IconMapPin,
  IconStarFilled, IconHeart, IconHeartFilled, IconNavigation
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../../utils/auth';
import apiClient from '../../../lib/apiClient';
import { useNavigate } from 'react-router-dom';
import StallCard from '../shared/StallCard';

/**
 * UI: Result Grid & Stall Cards (Supports Grid/List Toggle)
 * Grid view uses the shared StallCard for consistency.
 */
const SearchStalls = ({ stalls, loading, viewMode = 'grid' }) => {
  const theme = useMantineTheme();

  if (loading) {
    return viewMode === 'grid' ? (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p={0} withBorder style={{ overflow: 'hidden' }}>
            <Skeleton height={200} radius={0} />
            <Stack p="md" gap="xs">
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="40%" />
              <Skeleton height={12} width="55%" />
              <Skeleton height={32} mt={4} />
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    ) : (
      <Stack gap="md">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p="md" withBorder>
            <Group wrap="nowrap">
              <Skeleton height={120} width={180} radius="md" style={{ flexShrink: 0 }} />
              <Stack flex={1} gap="xs">
                <Skeleton height={20} width="40%" />
                <Skeleton height={14} width="20%" />
                <Skeleton height={60} width="100%" />
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    );
  }

  if (stalls.length === 0) {
    return (
      <Center py={100}>
        <Stack align="center" gap="xs">
          <IconToolsKitchen2 size={60} color={theme.colors.gray[3]} />
          <Text fw={800} size="xl" c="dimmed">No stalls found</Text>
          <Text c="dimmed">Try adjusting your filters or search terms.</Text>
        </Stack>
      </Center>
    );
  }

  return viewMode === 'grid' ? (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {stalls.map((stall, idx) => (
        <StallCard key={stall.id || idx} stall={stall} />
      ))}
    </SimpleGrid>
  ) : (
    <Stack gap="md">
      {stalls.map((stall, idx) => (
        <StallListCard key={stall.id || idx} stall={stall} />
      ))}
    </Stack>
  );
};

/**
 * List view card — horizontal layout, used only in Search list mode
 */
const StallListCard = ({ stall }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(stall.isSaved || false);
  const [saving, setSaving] = useState(false);
  const isAuth = isAuthenticated();

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    if (!isAuth) {
      notifications.show({ title: 'Login Required', message: 'Please login to bookmark stalls', color: 'yellow' });
      return;
    }
    setSaving(true);
    try {
      const res = await apiClient.post('/engagement/toggle', { stallId: stall.id });
      setIsSaved(res.data.saved);
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update bookmark', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card radius="lg" withBorder p={0} shadow="sm" style={{ overflow: 'hidden' }}>
      <Group wrap="nowrap" gap={0} align="stretch">
        {/* Fixed-width image */}
        <Box
          style={{ width: 180, minWidth: 180, flexShrink: 0, position: 'relative', cursor: 'pointer' }}
          onClick={() => navigate(`/stall-detail/${stall.id}`)}
        >
          <Image
            src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
            h="100%"
            fit="cover"
            style={{ minHeight: 140, display: 'block' }}
          />
          <ActionIcon
            pos="absolute" top={10} left={10}
            variant="filled" color={isSaved ? 'red' : 'gray'} radius="xl" size="md"
            loading={saving} onClick={handleToggleBookmark}
          >
            {isSaved ? <IconHeartFilled size={15} /> : <IconHeart size={15} />}
          </ActionIcon>
        </Box>

        <Stack p="md" gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box style={{ minWidth: 0 }}>
              <Text fw={900} size="md" lineClamp={1}>{stall.name}</Text>
              <Group gap={4} mt={2}>
                <IconMapPin size={13} color={theme.colors.gray[5]} />
                <Text size="xs" c="dimmed" fw={700}>{stall.distance?.toFixed(1) ?? '—'} km away</Text>
              </Group>
            </Box>
            <Badge variant="light" color="yellow" size="md" leftSection={<IconStarFilled size={12} />} style={{ flexShrink: 0 }}>
              {parseFloat(stall.rating || 0).toFixed(1)}
            </Badge>
          </Group>

          <Group gap="xs" wrap="wrap">
            {stall.cuisine?.map(c => <Badge key={c} variant="light" color="green" size="xs" radius="xs">{c}</Badge>)}
            {stall.halal && <Badge variant="light" color="teal" size="xs" radius="xs">Halal</Badge>}
            <Text size="xs" c="dimmed" fw={700}>• {stall.priceRange || '$$'}</Text>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1 }}>
            {stall.description || 'Discover authentic flavours and amazing local food here.'}
          </Text>

          <Group justify="flex-end" gap="sm" mt="xs" wrap="wrap">
            <Button variant="subtle" color="gray" size="sm" radius="md"
              leftSection={<IconSearch size={14} />} fw={700}
              onClick={() => navigate(`/stall-detail/${stall.id}`)}>
              Details
            </Button>
            <Button variant="filled" color="var(--mm-color-primary)" size="sm" radius="md"
              leftSection={<IconNavigation size={14} />} fw={700}
              onClick={(e) => {
                e.stopPropagation();
                if (stall?.location?.lat && stall?.location?.lng) {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${stall.location.lat},${stall.location.lng}`, '_blank');
                } else {
                  const query = encodeURIComponent(`${stall?.name || 'Food Stall'} Penang`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }
              }}>
              Navigate
            </Button>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};

export default SearchStalls;
