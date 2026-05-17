import React, { useState } from 'react';
import { 
  Group, TextInput, Text, Paper, Divider, Select,
  rem, useMantineTheme, Menu, Button, Checkbox, Stack, Badge
} from '@mantine/core';
import { IconSearch, IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react';

/**
 * SHARED COMPONENT: Integrated Search & Filter Bar
 * Used by: FindStallsPage, BookmarksPage
 *
 * Halal dropdown supports multi-select:
 *   'halal'          → isHalal === true
 *   'muslimFriendly' → isMuslimFriendly === true
 *   'nonHalal'       → not halal and not muslim friendly
 *   'all'            → no filter (clear all)
 */
const HALAL_OPTIONS = [
  { value: 'halal',          label: 'Halal',           color: 'teal' },
  { value: 'muslimFriendly', label: 'Muslim Friendly',  color: 'green' },
  { value: 'nonHalal',       label: 'Non-Halal',        color: 'orange' },
  { value: 'all',            label: 'All',              color: 'gray' },
];

const FilterStalls = ({ search, onSearchChange, filters, onFilterChange, sortBy, onSortChange, placeholder }) => {
  const theme = useMantineTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // halalTags: array of active tags e.g. ['halal', 'muslimFriendly']
  const halalTags = filters.halalTags?.length > 0
    ? filters.halalTags
    : filters.halal === 'yes' ? ['halal'] : [];

  const handleToggleTag = (value) => {
    if (value === 'all') {
      // Select All → clear everything
      onFilterChange({ ...filters, halalTags: [], halal: 'all' });
      return;
    }

    const current = halalTags.filter(t => t !== 'all');
    const exists = current.includes(value);
    const next = exists
      ? current.filter(t => t !== value)   // deselect
      : [...current, value];               // select

    const halal = next.includes('halal') ? 'yes' : 'all';
    onFilterChange({ ...filters, halalTags: next, halal });
  };

  // Button label
  const getLabel = () => {
    if (halalTags.length === 0) return 'All';
    if (halalTags.length === 1) return HALAL_OPTIONS.find(o => o.value === halalTags[0])?.label || 'All';
    return `${halalTags.length} selected`;
  };

  const isAllSelected = halalTags.length === 0;
  const isActive = halalTags.length > 0;

  return (
    <Paper p="md" radius="xl" withBorder shadow="sm" style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
      <Group gap="md" wrap="wrap">
        {/* Search Input */}
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

        <Group gap="sm" visibleFrom="sm" wrap="wrap">
          {/* Cuisine Filter */}
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

          {/* Halal Multi-Select Dropdown */}
          <Menu
            opened={dropdownOpen}
            onChange={setDropdownOpen}
            closeOnItemClick={false}
            shadow="md"
            radius="md"
            width={200}
            position="bottom-start"
          >
            <Menu.Target>
              <Button
                variant="unstyled"
                size="md"
                rightSection={dropdownOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                styles={{
                  root: {
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'var(--mm-color-primary)' : 'var(--mm-text-main)',
                    padding: `0 ${rem(4)}`,
                    height: 'auto',
                    background: 'none',
                    border: 'none',
                  },
                  inner: { gap: 6 },
                }}
              >
                {isActive && (
                  <Badge
                    size="xs"
                    color="var(--mm-color-primary)"
                    circle
                    style={{ marginRight: 4 }}
                  >
                    {halalTags.length}
                  </Badge>
                )}
                {getLabel()}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Stack gap={2} p="xs">
                {/* Ordered: Halal, Muslim Friendly, Non-Halal, All */}
                {HALAL_OPTIONS.map((option) => {
                  const isChecked = option.value === 'all'
                    ? isAllSelected
                    : halalTags.includes(option.value);

                  return (
                    <Menu.Item
                      key={option.value}
                      onClick={() => handleToggleTag(option.value)}
                      style={{ borderRadius: 8 }}
                      leftSection={
                        <Checkbox
                          checked={isChecked}
                          readOnly
                          size="sm"
                          color={option.color}
                          radius="sm"
                          styles={{ input: { cursor: 'pointer' } }}
                        />
                      }
                      rightSection={
                        isChecked ? (
                          <IconCheck size={14} color={theme.colors[option.color]?.[6] || theme.colors.gray[6]} />
                        ) : null
                      }
                    >
                      <Text
                        size="sm"
                        fw={isChecked ? 800 : 500}
                        c={isChecked ? option.color : 'var(--mm-text-main)'}
                      >
                        {option.label}
                      </Text>
                    </Menu.Item>
                  );
                })}
              </Stack>
            </Menu.Dropdown>
          </Menu>

          <Divider orientation="vertical" h={24} my="auto" />

          {/* Sort By */}
          <Group gap={5}>
            <Text size="sm" fw={700} c="dimmed">Sort by:</Text>
            <Select
              data={[
                { value: 'recent',       label: 'Recently saved' },
                { value: 'rating',       label: 'Top Rated' },
                { value: 'distance',     label: 'Nearest' },
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
