import React, { useState } from 'react';
import { 
  SimpleGrid, Card, Image, Text, Badge, Group, 
  Stack, Box, ActionIcon, rem, useMantineTheme,
  Skeleton, Center, Transition, Tooltip
} from '@mantine/core';
import { 
  IconStarFilled, IconMapPin, IconHeart, IconHeartFilled, IconCertificate,
  IconFlame, IconWallet, IconToolsKitchen2
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../../utils/auth';
import apiClient from '../../../lib/apiClient';
import { useNavigate } from 'react-router-dom';

/**
 * UI: Result Grid & Stall Cards
 */
const SearchStalls = ({ stalls, loading }) => {
  const theme = useMantineTheme();

  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p="md" withBorder>
            <Skeleton height={180} radius="md" mb="md" />
            <Skeleton height={20} width="70%" mb="sm" />
            <Skeleton height={15} width="40%" />
          </Card>
        ))}
      </SimpleGrid>
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

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
      {stalls.map((stall, idx) => (
        <StallCard key={stall.id || idx} stall={stall} />
      ))}
    </SimpleGrid>
  );
};

const StallCard = ({ stall }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(stall.isSaved || false);
  const [saving, setSaving] = useState(false);
  
  // Logic for badges
  const isTopPick = (stall.rating || 0) >= 4.5;
  const isAuth = isAuthenticated();

  const handleToggleBookmark = async (e) => {
    e.stopPropagation(); // Prevent card navigation
    if (!isAuth) {
      notifications.show({
        title: 'Login Required',
        message: 'Please login to bookmark stalls',
        color: 'yellow'
      });
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
      notifications.show({
        title: 'Error',
        message: 'Failed to update bookmark',
        color: 'red'
      });
    } finally {
      setSaving(false);
    }
  };

  const displayRating = (parseFloat(stall.rating) || 0).toFixed(1);

  return (
    <Transition mounted={true} transition="fade" duration={400}>
      {(styles) => (
        <Card 
          radius="lg" 
          p={0} 
          withBorder 
          shadow="sm" 
          onClick={() => navigate(`/stall-detail/${stall.id}`)}
          style={{ 
            ...styles, 
            overflow: 'hidden', 
            border: 'none', 
            backgroundColor: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Image Section */}
          <Box style={{ position: 'relative' }}>
            <Image
              src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
              height={180}
              alt={stall.name}
              fallbackSrc="https://placehold.co/400x200?text=No+Image"
            />
            
            {/* Top Pick Badge */}
            {isTopPick && (
              <Badge 
                color="yellow" 
                variant="filled" 
                size="sm" 
                leftSection={<IconStarFilled size={10} />}
                style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}
              >
                TOP PICK
              </Badge>
            )}

            {/* Favorite Icon */}
            <Tooltip label={isSaved ? "Remove from Favorites" : "Add to Favorites"}>
              <ActionIcon 
                variant="transparent" 
                color={isSaved ? "red" : "white"} 
                loading={saving}
                style={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  zIndex: 2,
                  filter: isSaved ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
                onClick={handleToggleBookmark}
              >
                {isSaved ? <IconHeartFilled size={22} /> : <IconHeart size={22} stroke={2.5} />}
              </ActionIcon>
            </Tooltip>
          </Box>

          {/* Content Section */}
          <Stack p="md" gap="xs">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Text fw={800} size="md" lineClamp={1} style={{ color: 'var(--mm-color-primary)' }}>
                {stall.name}
              </Text>
              <Badge 
                variant="light" 
                color={parseFloat(displayRating) > 0 ? "yellow" : "gray"} 
                size="sm" 
                radius="sm" 
                leftSection={<IconStarFilled size={10} />}
              >
                {displayRating}
              </Badge>
            </Group>

            <Group gap="xs">
              <Badge 
                variant="light" 
                color={stall.halal ? 'green' : 'red'} 
                size="xs" 
                radius="xs"
              >
                {stall.halal ? 'Halal' : 'Non-Halal'}
              </Badge>
            </Group>

            <Group justify="space-between" mt={5}>
              <Group gap={4}>
                <IconMapPin size={14} color={theme.colors.gray[5]} />
                <Text size="xs" c="dimmed" fw={600}>{stall.distance ? `${stall.distance.toFixed(1)}km` : '1.2km'} away</Text>
              </Group>
              <Text size="xs" fw={800} color="gray.6">{stall.priceRange || '$$'}</Text>
            </Group>

            <Text size="xs" c="dimmed" fw={600} mt={2} truncate>
              {Array.isArray(stall.cuisine) ? stall.cuisine.join(', ') : stall.cuisine} • {stall.category || 'Street Food'}
            </Text>
          </Stack>
        </Card>
      )}
    </Transition>
  );
};

export default SearchStalls;
