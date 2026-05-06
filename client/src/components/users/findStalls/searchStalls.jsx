import React, { useState } from 'react';
import { 
  SimpleGrid, Card, Image, Text, Badge, Group, 
  Stack, Box, ActionIcon, rem, useMantineTheme,
  Skeleton, Center, Transition, Tooltip, Button
} from '@mantine/core';
import { 
  IconStarFilled, IconMapPin, IconHeart, IconHeartFilled, IconCertificate,
  IconFlame, IconWallet, IconToolsKitchen2, IconDotsVertical, IconNavigation,
  IconSearch
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../../utils/auth';
import apiClient from '../../../lib/apiClient';
import { useNavigate } from 'react-router-dom';

/**
 * UI: Result Grid & Stall Cards (Supports Grid/List Toggle)
 */
const SearchStalls = ({ stalls, loading, viewMode = 'grid' }) => {
  const theme = useMantineTheme();

  if (loading) {
    return viewMode === 'grid' ? (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p="md" withBorder>
            <Skeleton height={180} radius="md" mb="md" />
            <Skeleton height={20} width="70%" mb="sm" />
            <Skeleton height={15} width="40%" />
          </Card>
        ))}
      </SimpleGrid>
    ) : (
      <Stack gap="md">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p="md" withBorder>
             <Group wrap="nowrap">
                <Skeleton height={160} width={240} radius="md" />
                <Stack flex={1}>
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={15} width="20%" />
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
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
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

const StallCard = ({ stall }) => {
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
      notifications.show({
        title: res.data.saved ? 'Stall Bookmarked' : 'Bookmark Removed',
        message: res.data.saved ? 'Added to your favorites' : 'Removed from favorites',
        color: res.data.saved ? 'teal' : 'gray'
      });
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to update bookmark', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card radius="lg" withBorder p={0} shadow="sm" style={{ overflow: 'hidden', backgroundColor: '#fff' }}>
      <Box pos="relative" onClick={() => navigate(`/stall-detail/${stall.id}`)} style={{ cursor: 'pointer' }}>
        <Image src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'} height={180} />
        <ActionIcon 
          pos="absolute" top={12} right={12} 
          variant="filled" color={isSaved ? "red" : "gray"} radius="xl" size="lg"
          loading={saving}
          onClick={handleToggleBookmark}
        >
          {isSaved ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
        </ActionIcon>
        <ActionIcon pos="absolute" bottom={12} right={12} variant="white" color="gray" radius="md" size="md">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Box>

      <Stack p="md" gap="xs">
        <Text fw={900} size="md" lineClamp={1}>{stall.name}</Text>
        <Group justify="space-between" wrap="nowrap">
           <Group gap={4}>
              <IconStarFilled size={14} color="orange" />
              <Text size="xs" fw={800}>{parseFloat(stall.rating).toFixed(1)}</Text>
           </Group>
           <Group gap={4}>
              <IconMapPin size={14} color={theme.colors.gray[5]} />
              <Text size="xs" c="dimmed" fw={700}>{stall.distance?.toFixed(1) || '1.2'} km</Text>
           </Group>
        </Group>

        <Group gap="xs" my={2}>
          {stall.cuisine && stall.cuisine.slice(0, 2).map(c => (
            <Badge key={c} variant="light" color="green" size="xs" radius="xs">{c}</Badge>
          ))}
          {stall.halal && <Badge variant="light" color="green" size="xs" radius="xs">Halal</Badge>}
        </Group>

        <Text fw={800} size="xs" color="gray.7" mb="xs">{stall.priceRange || '$$'}</Text>

        <SimpleGrid cols={2} spacing="xs">
           <Button 
             variant="subtle" color="gray" size="xs" radius="md"
             leftSection={<IconSearch size={14} />}
             onClick={() => navigate(`/stall-detail/${stall.id}`)}
             styles={{ label: { fontWeight: 700 } }}
           >
             Details
           </Button>
           <Button 
             variant="filled" color="var(--mm-color-primary)" size="xs" radius="md"
             leftSection={<IconNavigation size={14} />}
             styles={{ label: { fontWeight: 700 } }}
           >
             Navigate
           </Button>
        </SimpleGrid>
      </Stack>
    </Card>
  );
};

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
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to update bookmark', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card radius="lg" withBorder p={0} shadow="sm" style={{ overflow: 'hidden' }}>
      <Group wrap="nowrap" gap={0} align="stretch">
        <Box w={240} pos="relative" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate(`/stall-detail/${stall.id}`)}>
          <Image src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'} height="100%" minHeight={160} />
          <ActionIcon 
            pos="absolute" top={10} left={10} 
            variant="filled" color={isSaved ? "red" : "gray"} radius="xl" size="md"
            loading={saving}
            onClick={handleToggleBookmark}
          >
            {isSaved ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
          </ActionIcon>
        </Box>

        <Stack p="md" gap="xs" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box>
              <Text fw={900} size="lg">{stall.name}</Text>
              <Group gap={4} mt={2}>
                <IconMapPin size={14} color={theme.colors.gray[5]} />
                <Text size="xs" c="dimmed" fw={700}>{stall.distance?.toFixed(1) || '1.2'} km away</Text>
              </Group>
            </Box>
            <Badge variant="light" color="yellow" size="md" leftSection={<IconStarFilled size={12} />}>
              {parseFloat(stall.rating).toFixed(1)}
            </Badge>
          </Group>

          <Group gap="xs">
            {stall.cuisine && stall.cuisine.map(c => <Badge key={c} variant="light" color="green" size="xs" radius="xs">{c}</Badge>)}
            {stall.halal && <Badge variant="light" color="green" size="xs" radius="xs">Halal</Badge>}
            <Text size="xs" c="dimmed" fw={700}>• {stall.priceRange || '$$'}</Text>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1 }}>
            {stall.description || "Discover authentic flavours and amazing local food here."}
          </Text>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button 
              variant="subtle" color="gray" size="sm" radius="md"
              leftSection={<IconSearch size={14} />}
              onClick={() => navigate(`/stall-detail/${stall.id}`)}
              styles={{ label: { fontWeight: 700 } }}
            >
              Details
            </Button>
            <Button 
              variant="filled" color="var(--mm-color-primary)" size="sm" radius="md"
              leftSection={<IconNavigation size={14} />}
              styles={{ label: { fontWeight: 700 } }}
            >
              Navigate
            </Button>
            <ActionIcon variant="subtle" color="gray" radius="md" size="lg">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};

export default SearchStalls;
