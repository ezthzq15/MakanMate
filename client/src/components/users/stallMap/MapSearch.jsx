import React from 'react';
import { 
  Paper, Stack, TextInput, ActionIcon, Group, 
  Text, Title, Divider, Button, ThemeIcon, 
  UnstyledButton, Box, Badge, Grid
} from '@mantine/core';
import { 
  IconSearch, IconCurrentLocation, IconToolsKitchen, 
  IconCoffee, IconBaguette, IconCircleCheck, 
  IconClock, IconChevronRight, IconCloudSearch, IconMapPin,
  IconSun, IconCloud
} from '@tabler/icons-react';
import { useMap } from '../../../context/MapContext';

/**
 * COMPONENT: MapSearch
 * Sidebar controls for location searching and quick filtering.
 */
const MapSearch = () => {
  const { refreshLocation, userLocation } = useMap();

  const quickFilters = [
    { icon: <IconToolsKitchen size={16} />, label: 'Restaurants', color: 'green' },
    { icon: <IconCoffee size={16} />, label: 'Cafes', color: 'blue' },
    { icon: <IconBaguette size={16} />, label: 'Street Food', color: 'orange' },
    { icon: <IconCircleCheck size={16} />, label: 'Halal', color: 'teal' },
    { icon: <IconClock size={16} />, label: 'Open Now', color: 'red' },
  ];

  const popularAreas = ['George Town', 'Bayan Lepas', 'Butterworth', 'Bukit Mertajam'];

  return (
    <Stack gap="xl">
      {/* 1. Search Header */}
      <Paper p="md" radius="xl" withBorder shadow="xs">
        <TextInput
          placeholder="Search places or addresses"
          leftSection={<IconSearch size={18} />}
          rightSection={
            <ActionIcon variant="subtle" color="gray" onClick={refreshLocation}>
              <IconCurrentLocation size={18} />
            </ActionIcon>
          }
          radius="xl"
          variant="unstyled"
          styles={{ input: { paddingLeft: '45px' } }}
        />
      </Paper>

      {/* 2. My Location Card */}
      <Paper p="md" radius="lg" withBorder shadow="sm">
        <Stack gap="sm">
          <Group gap="md">
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              <IconMapPin size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="sm">My Location</Text>
              <Text size="xs" c="dimmed">George Town, Penang</Text>
            </Box>
          </Group>
          <Button 
            variant="light" 
            color="brand" 
            fullWidth 
            radius="md" 
            size="compact-sm" 
            leftSection={<IconCurrentLocation size={14} />}
            onClick={refreshLocation}
          >
            Use current location
          </Button>
        </Stack>
      </Paper>

      {/* 3. Quick Filters Grid */}
      <Box>
        <Title order={6} mb="sm" fw={800}>Quick Filters</Title>
        <Grid gutter="xs">
          {quickFilters.map((filter, i) => (
            <Grid.Col span={6} key={i}>
              <UnstyledButton 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid #e9ecef',
                  backgroundColor: '#fff'
                }}
              >
                <Group gap="xs">
                  {filter.icon}
                  <Text size="xs" fw={700}>{filter.label}</Text>
                </Group>
              </UnstyledButton>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      {/* 4. Popular Areas */}
      <Box>
        <Title order={6} mb="sm" fw={900}>Popular Areas</Title>
        <Stack gap={4}>
          {popularAreas.map((area, i) => (
            <UnstyledButton 
              key={i} 
              p="xs" 
              style={{ borderRadius: '8px', borderBottom: '1px solid #f1f3f5' }} 
              className="hover-bg"
            >
              <Group justify="space-between">
                <Text size="xs" fw={700} c="dark.3">{area}</Text>
                <IconChevronRight size={14} color="gray" />
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Box>

      {/* 5. Weather Widget (NEW) */}
      <Paper p="md" radius="lg" withBorder shadow="sm" style={{ borderLeft: '4px solid #fab005' }}>
        <Group justify="space-between">
          <Group>
            <IconCloud size={32} color="#fab005" />
            <Box>
               <Text fw={900} size="lg">26°C</Text>
               <Text size="xs" c="dimmed">Partly Cloudy</Text>
               <Text size="xs" c="dimmed">Penang, Malaysia</Text>
            </Box>
          </Group>
          <IconChevronRight size={14} color="gray" />
        </Group>
      </Paper>

      {/* 5. Promotion Card */}
      <Paper p="md" radius="lg" bg="var(--mm-bg-card)" withBorder>
        <Group align="center">
           <Box w={40} h={40}>
              <IconCloudSearch size={40} color="var(--mm-brand-olive)" />
           </Box>
           <Box style={{ flex: 1 }}>
              <Text size="xs" fw={800}>Explore more food spots</Text>
              <Text size="xs" c="dimmed">Find hidden gems around you!</Text>
           </Box>
        </Group>
        <Button variant="filled" color="olive" fullWidth radius="md" size="compact-xs" mt="sm">
          Explore Now
        </Button>
      </Paper>
    </Stack>
  );
};

export default MapSearch;
