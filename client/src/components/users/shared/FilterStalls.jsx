import React from 'react';
import { 
  Group, TextInput, Button, Menu, Checkbox, 
  Text, Box, Paper, Divider, Select,
  rem, useMantineTheme, Stack
} from '@mantine/core';
import { 
  IconSearch, IconFilter, IconChevronDown, IconRotateClockwise2,
  IconToolsKitchen2, IconCertificate, IconWallet, IconFlame
} from '@tabler/icons-react';

/**
 * SHARED COMPONENT: Integrated Search & Filter Bar
 * Used by: FindStallsPage, BookmarksPage
 */
const FilterStalls = ({ search, onSearchChange, filters, onFilterChange, sortBy, onSortChange, placeholder }) => {
  const theme = useMantineTheme();

  return (
    <Paper p="md" radius="xl" withBorder shadow="sm" style={{ backgroundColor: '#fff' }}>
      <Group gap="md">
        <TextInput
          placeholder={placeholder || "Search saved stalls..."}
          leftSection={<IconSearch size={20} color={theme.colors.gray[5]} />}
          radius="xl"
          size="md"
          variant="unstyled"
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ flex: 1, paddingLeft: rem(10) }}
          styles={{ input: { fontSize: rem(15), fontWeight: 500 } }}
        />
        
        <Divider orientation="vertical" h={24} my="auto" visibleFrom="sm" />

        <Group gap="sm" visibleFrom="sm">
          <Select
            placeholder="Cuisine"
            data={['Malay', 'Chinese', 'Indian', 'Western', 'Japanese', 'Thai', 'Pastries & Cafe']}
            variant="unstyled"
            size="md"
            styles={{ input: { fontWeight: 600, width: 120 } }}
            rightSection={<IconChevronDown size={14} />}
            clearable
            value={filters.cuisines[0] || null}
            onChange={(val) => onFilterChange({ ...filters, cuisines: val ? [val] : [] })}
          />

          <Divider orientation="vertical" h={24} my="auto" />

          <Select
            placeholder="Halal"
            data={[{ label: 'Halal', value: 'yes' }, { label: 'All', value: 'all' }]}
            variant="unstyled"
            size="md"
            styles={{ input: { fontWeight: 600, width: 100 } }}
            rightSection={<IconChevronDown size={14} />}
            value={filters.halal}
            onChange={(val) => onFilterChange({ ...filters, halal: val })}
          />

          <Divider orientation="vertical" h={24} my="auto" />

          <Group gap={5}>
            <Text size="sm" fw={700} c="dimmed">Sort by:</Text>
            <Select
              data={[
                { value: 'recent', label: 'Recently saved' },
                { value: 'rating', label: 'Top Rated' },
                { value: 'distance', label: 'Nearest' },
                { value: 'alphabetical', label: 'Alphabetical' }
              ]}
              variant="unstyled"
              size="md"
              styles={{ input: { fontWeight: 800, color: 'var(--mm-color-primary)', width: 150 } }}
              value={sortBy}
              onChange={onSortChange}
              rightSection={<IconChevronDown size={14} />}
            />
          </Group>
        </Group>
      </Group>
    </Paper>
  );
};

export default FilterStalls;
