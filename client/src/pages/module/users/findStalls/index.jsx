import React from 'react';
import { 
  Container, Title, Text, Group, Stack, Box, 
  Button, Pagination, Select, rem, useMantineTheme, Center
} from '@mantine/core';
import { useFindStalls } from '../../../../hooks/users/useFindStalls';
import FilterStalls from '../../../../components/users/shared/FilterStalls';
import SearchStalls from '../../../../components/users/findStalls/searchStalls';

/**
 * PAGE: UC006 Search Food Stalls
 * Full integration of Search, Filter, and Recommendations (UC005)
 */
const FindStallsPage = () => {
  const theme = useMantineTheme();
  const {
    mode, setMode,
    search, setSearch,
    filters, setFilters,
    sortBy, setSortBy,
    page, setPage,
    results, totalResults,
    loading, resetFilters,
    isAuth
  } = useFindStalls();

  const [viewMode, setViewMode] = React.useState('grid');

  return (
    <Container size="xl" py={{ base: 'md', md: 'xl' }} px={{ base: 'sm', md: 'md' }}>
      <Stack gap={{ base: 24, md: 40 }}>
        {/* Header Section */}
        <Stack gap="md">
          <Box>
            <Title order={1} style={{ fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: 900, color: 'var(--mm-color-primary)' }}>
              {isAuth ? 'Find Your Best Meal' : 'Explore Food Stalls'}
            </Title>
            <Text c="dimmed" size={{ base: 'sm', md: 'lg' }} mt={5}>
              {isAuth
                ? 'Discover personalized recommendations based on your tastes.'
                : 'Browse stalls around you and find your next favorite spot.'}
            </Text>
          </Box>

          {/* Mode Switcher */}
          <Group gap={0} style={{
            backgroundColor: theme.colors.gray[1],
            padding: rem(4),
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.colors.gray[2]}`,
            alignSelf: 'flex-start',
            flexWrap: 'wrap',
          }}>
            <Button
              variant={mode === 'personalized' ? 'filled' : 'subtle'}
              color={mode === 'personalized' ? 'var(--mm-color-primary)' : 'gray'}
              radius="xl"
              size="sm"
              h={{ base: 48, md: 60 }}
              px={{ base: 16, md: 30 }}
              onClick={() => setMode('personalized')}
              style={{
                backgroundColor: mode === 'personalized' ? 'var(--mm-color-primary)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <Stack gap={0} align="center">
                <Text fw={800} size={{ base: 'xs', md: 'sm' }}>{isAuth ? 'Personalized for You' : 'Nearby Food'}</Text>
                <Text size="xs" fw={400} opacity={0.8} visibleFrom="sm">
                  {isAuth ? 'Follow My Preferences' : 'Stalls within 3km'}
                </Text>
              </Stack>
            </Button>
            <Button
              variant={mode === 'explore' ? 'filled' : 'subtle'}
              color={mode === 'explore' ? 'var(--mm-color-primary)' : 'gray'}
              radius="xl"
              size="sm"
              h={{ base: 48, md: 60 }}
              px={{ base: 16, md: 30 }}
              onClick={() => {
                setMode('explore');
                resetFilters();
              }}
              style={{
                backgroundColor: mode === 'explore' ? 'var(--mm-color-primary)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <Stack gap={0} align="center">
                <Text fw={800} size={{ base: 'xs', md: 'sm' }}>Explore All</Text>
                <Text size="xs" fw={400} opacity={0.8} visibleFrom="sm">Show everything</Text>
              </Stack>
            </Button>
          </Group>
        </Stack>

        {/* Search & Filter Header */}
        <FilterStalls 
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          placeholder="Search for stalls, cuisines..."
        />

        {/* Results Metadata & View Toggle */}
        <Group justify="space-between" mt="lg">
          <Text size="sm" c="dimmed" fw={600}>
            Showing <Text span c="dark" fw={800}>{totalResults}</Text> results
          </Text>
          <Group gap={0} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
            <Button 
              variant={viewMode === 'grid' ? 'filled' : 'subtle'} 
              color={viewMode === 'grid' ? 'var(--mm-color-primary)' : 'gray'}
              radius={0}
              size="xs"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'filled' : 'subtle'} 
              color={viewMode === 'list' ? 'var(--mm-color-primary)' : 'gray'}
              radius={0}
              size="xs"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </Group>
        </Group>

        {/* Result Container */}
        <SearchStalls stalls={results} loading={loading} viewMode={viewMode} />

        {/* Pagination */}
        {totalResults > 12 && (
          <Center mt={50}>
            <Pagination 
              total={Math.ceil(totalResults / 12)} 
              value={page} 
              onChange={setPage} 
              color="var(--mm-color-primary)"
              size="md"
              radius="xl"
            />
          </Center>
        )}
      </Stack>
    </Container>
  );
};

export default FindStallsPage;
