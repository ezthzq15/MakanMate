import React from 'react';
import { 
  Container, Title, Text, Group, Stack, Box, 
  Paper, SimpleGrid, Card, Image, Badge, 
  ActionIcon, Button, rem, useMantineTheme, 
  ScrollArea, Avatar, Center, Menu, Tooltip
} from '@mantine/core';
import { 
  IconHeartFilled, IconMapPin, IconStarFilled, 
  IconDotsVertical, IconChevronRight, IconSearch,
  IconToolsKitchen2, IconNavigation, IconBookmark,
  IconArrowRight, IconChevronDown
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import FilterStalls from '../shared/FilterStalls';
import { useStallsBookmarks } from '../../../hooks/users/useStallsBookmarks';
import StallCard from '../shared/StallCard';

/**
 * COMPONENT: UC007 Bookmarks Module
 * Full implementation of Saved Stalls with filtering and proximity grouping.
 */
export const StallsBookmark = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const {
    bookmarks,
    totalCount,
    loading,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    removeBookmark,
    resetFilters
  } = useStallsBookmarks();

  const [viewMode, setViewMode] = React.useState('grid');

  // "Near You" Logic (stalls within 2km)
  const nearbyBookmarks = bookmarks.filter(b => b.distance && b.distance <= 2);

  return (
    <Container size="xl" py="xl">
      <Stack gap={40}>
        {/* 1. HERO HEADER SECTION */}
        <Group justify="space-between" align="center">
          <Box>
            <Group gap="xs" mb={5} wrap="nowrap">
              <Box style={{ backgroundColor: '#F9E44B', padding: '8px', borderRadius: '8px' }}>
                <IconBookmark size={28} color="white" fill="white" />
              </Box>
              <Title order={1} style={{ fontSize: rem(40), fontWeight: 900 }}>
                Your Saved Food Spots
              </Title>
            </Group>
            <Text c="dimmed" size="lg" ml={55}>
              Revisit your favorites or plan your next meal.
            </Text>
          </Box>

          <Paper p="lg" radius="xl" withBorder shadow="sm" style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)', minWidth: 260 }}>
            <Group wrap="nowrap" justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Bookmarks</Text>
                <Text size="32px" fw={900}>{totalCount}</Text>
                <Text size="xs" c="dimmed">stalls saved</Text>
              </Box>
              <Box p="md" style={{ backgroundColor: 'var(--mm-bg-body)', borderRadius: '50%' }}>
                <IconBookmark size={32} color="#F9E44B" fill="#F9E44B" opacity={0.2} />
              </Box>
            </Group>
          </Paper>
        </Group>

        {/* 2. FILTER + SEARCH SECTION */}
        <FilterStalls 
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          placeholder="Search saved stalls..."
        />

        {/* 3. NEAR YOU RIGHT NOW SECTION */}
        {nearbyBookmarks.length > 0 && (
          <Box>
            <Group justify="space-between" mb="md">
              <Group gap="xs">
                <IconMapPin size={22} color="green" />
                <Title order={3} fw={800}>Near You Right Now</Title>
                <Text size="sm" c="dimmed">Your saved spots within 2km</Text>
              </Group>
              <Button variant="subtle" color="gray" rightSection={<IconArrowRight size={14} />}>
                View all
              </Button>
            </Group>
            
            <ScrollArea scrollbars="x" type="never">
              <Group wrap="nowrap" pb="sm">
                {nearbyBookmarks.map(stall => (
                  <NearbyCard key={stall.id} stall={stall} />
                ))}
              </Group>
            </ScrollArea>
          </Box>
        )}

        {/* 4. MAIN BOOKMARK GRID SECTION */}
        <Box>
          <Group justify="space-between" mb="xl">
            <Title order={2} fw={900}>All Bookmarks ({bookmarks.length})</Title>
            <Group gap={0} style={{ border: '1px solid var(--mm-border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <Button 
                variant={viewMode === 'grid' ? 'filled' : 'subtle'} 
                color={viewMode === 'grid' ? 'var(--mm-color-primary)' : 'gray'}
                radius={0}
                size="sm"
                leftSection={<IconToolsKitchen2 size={16} />}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'filled' : 'subtle'} 
                color={viewMode === 'list' ? 'var(--mm-color-primary)' : 'gray'}
                radius={0}
                size="sm"
                leftSection={<IconDotsVertical size={16} rotate={90} />}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </Group>
          </Group>

          {bookmarks.length > 0 ? (
            viewMode === 'grid' ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {bookmarks.map(stall => (
                  <StallCard key={stall.id} stall={stall} alwaysSaved onRemove={() => removeBookmark(stall.id)} />
                ))}
              </SimpleGrid>
            ) : (
              <Stack gap="md">
                {bookmarks.map(stall => (
                  <BookmarkListCard key={stall.id} stall={stall} onRemove={() => removeBookmark(stall.id)} />
                ))}
              </Stack>
            )
          ) : (
            /* 5. EMPTY STATE SECTION */
            <Paper p="xl" radius="20px" style={{ backgroundColor: 'var(--mm-bg-body)' }}>
               <Group justify="space-between" align="center" wrap="nowrap">
                 <Group gap="xl">
                    <Box p="md" style={{ backgroundColor: 'var(--mm-bg-surface)', borderRadius: '50%', boxShadow: theme.shadows.xs }}>
                       <IconToolsKitchen2 size={50} color="#F9E44B" />
                    </Box>
                    <Box>
                      <Title order={2} fw={900}>No more bookmarks to show</Title>
                      <Text c="dimmed" size="md">Keep exploring and bookmark more food spots you love!</Text>
                    </Box>
                 </Group>
                 <Button 
                    size="lg" 
                    radius="xl" 
                    color="var(--mm-color-primary)"
                    leftSection={<IconSearch size={20} />}
                    onClick={() => navigate('/search')}
                  >
                    Explore Food Spots
                  </Button>
               </Group>
            </Paper>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

/**
 * Compact Card for "Near You" section
 */
const NearbyCard = ({ stall }) => {
  const navigate = useNavigate();
  return (
    <Card 
      radius="lg" 
      withBorder 
      p={0} 
      w={260} 
      shadow="sm"
      style={{ cursor: 'pointer', flexShrink: 0 }}
      onClick={() => navigate(`/stall-detail/${stall.id}`)}
    >
      <Box pos="relative" style={{ height: 160, overflow: 'hidden' }}>
        <img
          src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
          alt={stall.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        <Badge 
          pos="absolute" top={10} left={10} 
          variant="filled" color="dark" opacity={0.7}
          leftSection={<IconMapPin size={10} />}
          radius="sm"
        >
          {stall.distance?.toFixed(1) || '0.6'} km
        </Badge>
        <ActionIcon 
          pos="absolute" top={10} right={10} 
          variant="filled" color="red" radius="xl" size="sm"
        >
          <IconHeartFilled size={14} />
        </ActionIcon>
      </Box>
      <Box p="sm">
        <Text fw={800} size="sm" lineClamp={1}>{stall.name}</Text>
        <Group justify="space-between" mt={4}>
          <Group gap={4}>
            <IconStarFilled size={12} color="orange" />
            <Text size="xs" fw={700}>{stall.rating}</Text>
          </Group>
          <Text size="xs" c="dimmed" fw={600}>{stall.priceRange}</Text>
        </Group>
      </Box>
    </Card>
  );
};

/**
 * List View Card for Bookmarks
 */
const BookmarkListCard = ({ stall, onRemove }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  return (
    <Card radius="lg" withBorder p={0} shadow="sm" style={{ overflow: 'hidden' }}>
      <Group wrap="nowrap" gap={0} align="stretch">
        <Box w={240} pos="relative" style={{ flexShrink: 0 }}>
          <Image src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'} height="100%" minHeight={160} />
          <ActionIcon 
            pos="absolute" top={10} left={10} 
            variant="filled" color="red" radius="xl" size="md"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <IconHeartFilled size={16} />
          </ActionIcon>
        </Box>

        <Stack p="md" gap="xs" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box>
              <Text fw={900} size="lg">{stall.name}</Text>
              <Group gap={4} mt={2}>
                <IconMapPin size={14} color={theme.colors.gray[5]} />
                <Text size="xs" c="dimmed" fw={700}>{stall.distance?.toFixed(1) || '0.6'} km away</Text>
              </Group>
            </Box>
            <Badge variant="light" color="yellow" size="md" leftSection={<IconStarFilled size={12} />}>
              {stall.rating}
            </Badge>
          </Group>

          <Group gap="xs">
            <Badge variant="light" color="green" size="xs" radius="xs">Malay</Badge>
            <Badge variant="light" color="green" size="xs" radius="xs">Muslim Friendly</Badge>
            <Text size="xs" c="dimmed" fw={700}>• {stall.priceRange}</Text>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1 }}>
            {stall.description || "Fresh and authentic local food experience in the heart of Penang."}
          </Text>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button 
              variant="subtle" 
              color="gray" 
              size="sm" 
              radius="md"
              leftSection={<IconSearch size={14} />}
              onClick={() => navigate(`/stall-detail/${stall.id}`)}
              styles={{ label: { fontWeight: 700 } }}
            >
              View Details
            </Button>
            <Button 
              variant="filled" 
              color="var(--mm-color-primary)" 
              size="sm" 
              radius="md"
              leftSection={<IconNavigation size={14} />}
              styles={{ label: { fontWeight: 700 } }}
              onClick={(e) => {
                e.stopPropagation();
                if (stall?.location?.lat && stall?.location?.lng) {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${stall.location.lat},${stall.location.lng}`, '_blank');
                } else {
                  const query = encodeURIComponent(`${stall?.name || 'Food Stall'} Penang`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }
              }}
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
