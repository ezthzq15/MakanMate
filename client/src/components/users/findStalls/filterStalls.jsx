import React from 'react';
import { 
  Group, TextInput, Button, Menu, Checkbox, 
  ActionIcon, Text, Box, Paper, Divider,
  Badge, rem, useMantineTheme, Stack
} from '@mantine/core';
import { 
  IconSearch, IconFilter, IconChevronDown, IconRotateClockwise2,
  IconToolsKitchen2, IconCertificate, IconWallet, IconFlame
} from '@tabler/icons-react';

/**
 * UI: Integrated Search & Filter Bar
 */
const FilterStalls = ({ search, onSearchChange, filters, onFilterChange, onReset }) => {
  const theme = useMantineTheme();

  const handleCuisineToggle = (cuisine) => {
    const next = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter(c => c !== cuisine)
      : [...filters.cuisines, cuisine];
    onFilterChange({ ...filters, cuisines: next });
  };

  return (
    <Stack gap="md">
      <Paper p="sm" radius="lg" withBorder shadow="sm">
        <Group wrap="nowrap" gap="xs">
          <TextInput
            placeholder="Search for foods, cuisines, or stalls..."
            leftSection={<IconSearch size={20} color={theme.colors.gray[5]} />}
            radius="xl"
            size="lg"
            variant="unstyled"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            style={{ flex: 1, paddingLeft: rem(10) }}
            styles={{ input: { fontSize: rem(16), fontWeight: 500 } }}
          />
          
          <Divider orientation="vertical" h={30} my="auto" />

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button 
                variant="subtle" 
                color="gray" 
                radius="xl" 
                size="md"
                leftSection={<IconFilter size={18} />}
                rightSection={<IconChevronDown size={14} />}
              >
                Filters
              </Button>
            </Menu.Target>
            <Menu.Dropdown p="md">
              <Text fw={800} size="xs" tt="uppercase" mb="xs" c="dimmed">Advanced Filters</Text>
              {/* Halal Quick Filter */}
              <Menu.Label>Preference</Menu.Label>
              <Menu.Item 
                onClick={() => onFilterChange({ ...filters, halal: filters.halal === 'yes' ? 'all' : 'yes' })}
                closeMenuOnClick={false}
              >
                <Checkbox 
                  label="Halal Certified Only" 
                  checked={filters.halal === 'yes'} 
                  readOnly
                  color="olive"
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>

      {/* Filter Chips Bar */}
      <Group gap="sm">
        {/* Cuisine Filter */}
        <Menu shadow="sm" width={220}>
          <Menu.Target>
            <Button 
              variant="default" 
              radius="xl" 
              size="sm" 
              leftSection={<IconToolsKitchen2 size={16} />}
              rightSection={<IconChevronDown size={12} />}
            >
              Cuisine {filters.cuisines.length > 0 && `(${filters.cuisines.length})`}
            </Button>
          </Menu.Target>
          <Menu.Dropdown p="xs">
            {['Malay', 'Chinese', 'Indian', 'Western', 'Japanese', 'Thai'].map((c) => (
              <Menu.Item 
                key={c} 
                onClick={() => handleCuisineToggle(c)}
                closeMenuOnClick={false}
              >
                <Checkbox label={c} checked={filters.cuisines.includes(c)} readOnly color="olive" />
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* Halal Filter Chip */}
        <Button 
          variant={filters.halal === 'yes' ? 'light' : 'default'}
          color={filters.halal === 'yes' ? 'green' : 'gray'}
          radius="xl" 
          size="sm" 
          leftSection={<IconCertificate size={16} />}
          onClick={() => onFilterChange({ ...filters, halal: filters.halal === 'yes' ? 'all' : 'yes' })}
        >
          Halal: {filters.halal === 'yes' ? 'Yes' : 'All'}
        </Button>

        {/* Budget Filter */}
        <Menu shadow="sm" width={180}>
          <Menu.Target>
            <Button 
              variant="default" 
              radius="xl" 
              size="sm" 
              leftSection={<IconWallet size={16} />}
              rightSection={<IconChevronDown size={12} />}
            >
              Budget: {filters.budget === 'all' ? 'Any' : filters.budget}
            </Button>
          </Menu.Target>
          <Menu.Dropdown p="xs">
            {['all', 'RM5–10', 'RM10–20', 'RM20–30', 'RM30+'].map((b) => (
              <Menu.Item key={b} onClick={() => onFilterChange({ ...filters, budget: b })}>
                <Text size="sm" fw={filters.budget === b ? 700 : 400}>
                  {b === 'all' ? 'Any Budget' : b}
                </Text>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* Spice Filter */}
        <Menu shadow="sm" width={180}>
          <Menu.Target>
            <Button 
              variant="default" 
              radius="xl" 
              size="sm" 
              leftSection={<IconFlame size={16} />}
              rightSection={<IconChevronDown size={12} />}
            >
              Spice: {filters.spice === 'all' ? 'Any' : filters.spice}
            </Button>
          </Menu.Target>
          <Menu.Dropdown p="xs">
            {['all', 'LOW', 'MEDIUM', 'HIGH'].map((s) => (
              <Menu.Item key={s} onClick={() => onFilterChange({ ...filters, spice: s })}>
                <Text size="sm" fw={filters.spice === s ? 700 : 400}>
                  {s === 'all' ? 'Any Spice' : s}
                </Text>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <Button 
          variant="subtle" 
          color="red" 
          radius="xl" 
          size="sm" 
          leftSection={<IconRotateClockwise2 size={16} />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Group>
    </Stack>
  );
};


export default FilterStalls;
