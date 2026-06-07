import React from 'react';
import { 
  Paper, Stack, TextInput, ActionIcon, Group, 
  Text, Title, Divider, Button, ThemeIcon, 
  UnstyledButton, Box, Badge, Grid
} from '@mantine/core';
import { 
  IconSearch, IconCurrentLocation, IconToolsKitchen, 
  IconCoffee, IconBaguette, IconCircleCheck, 
  IconClock, IconChevronRight, IconMapPin,
  IconCloud
} from '@tabler/icons-react';
import { useMap } from '../../../context/MapContext';

/**
 * COMPONENT: MapSearch
 * Sidebar controls for location searching and quick filtering.
 */
const MapSearch = ({ halalOnly, setHalalOnly, openNowOnly, setOpenNowOnly, selectedCuisine, setSelectedCuisine, muslimFriendlyOnly, setMuslimFriendlyOnly }) => {
  const { refreshLocation, userLocation, setMapCenter } = useMap();

  const quickFilters = [
    { id: 'Restaurant',      icon: <IconToolsKitchen size={16} />, label: 'Restaurants',      color: 'green'  },
    { id: 'Cafe',            icon: <IconCoffee size={16} />,       label: 'Cafes',            color: 'blue'   },
    { id: 'Street Food',     icon: <IconBaguette size={16} />,     label: 'Street Food',      color: 'orange' },
    { id: 'halal',           icon: <IconCircleCheck size={16} />,  label: 'Halal',            color: 'teal'   },
    { id: 'muslimFriendly',  icon: <IconMapPin size={16} />,        label: 'Muslim Friendly',  color: 'green'  },
    { id: 'openNow',         icon: <IconClock size={16} />,        label: 'Open Now',         color: 'red'    },
  ];

  const popularAreas = ['George Town', 'Bayan Lepas', 'Butterworth', 'Bukit Mertajam'];

  const areaCoords = {
    'George Town': { lat: 5.4141, lng: 100.3288 },
    'Bayan Lepas': { lat: 5.2951, lng: 100.2595 },
    'Butterworth': { lat: 5.3942, lng: 100.3664 },
    'Bukit Mertajam': { lat: 5.3633, lng: 100.4658 }
  };

  const [weather, setWeather] = React.useState({ temp: '26°C', desc: 'Partly Cloudy' });
  const [address, setAddress] = React.useState('George Town, Penang');
  
  React.useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      const getAddress = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}&zoom=14`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address;
            const parts = [];
            if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood);
            if (addr.city || addr.town || addr.municipality) parts.push(addr.city || addr.town || addr.municipality);
            if (addr.state) parts.push(addr.state);
            
            if (parts.length > 0) {
              setAddress(parts.join(', '));
            } else {
              setAddress(data.display_name.split(',').slice(0, 2).join(','));
            }
          } else {
            setAddress(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
          }
        } catch (e) {
          console.error(e);
          setAddress(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
        }
      };
      getAddress();
    }
  }, [userLocation]);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = userLocation?.lat || 5.4141;
        const lng = userLocation?.lng || 100.3288;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await res.json();
        if (data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          let desc = 'Clear';
          if (code === 1 || code === 2 || code === 3) desc = 'Partly Cloudy';
          else if (code >= 51 && code <= 67) desc = 'Raining';
          else if (code >= 80 && code <= 82) desc = 'Showers';
          
          setWeather({ temp: `${temp}°C`, desc });
        }
      } catch (e) {
        console.error('Failed to fetch weather', e);
      }
    };
    fetchWeather();
  }, [userLocation]);

  const isActive = (id) => {
    if (id === 'halal')          return halalOnly;
    if (id === 'openNow')        return openNowOnly;
    if (id === 'muslimFriendly') return muslimFriendlyOnly;
    return selectedCuisine === id;
  };

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
              <Text size="xs" c="dimmed">{address}</Text>
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
                onClick={() => {
                  if (filter.id === 'halal')          setHalalOnly(!halalOnly);
                  else if (filter.id === 'openNow')   setOpenNowOnly(!openNowOnly);
                  else if (filter.id === 'muslimFriendly') setMuslimFriendlyOnly(!muslimFriendlyOnly);
                  else setSelectedCuisine(selectedCuisine === filter.id ? null : filter.id);
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: isActive(filter.id) ? '1px solid var(--mantine-color-brand-filled)' : '1px solid #e9ecef',
                  backgroundColor: isActive(filter.id) ? '#f1f3f5' : '#fff',
                  transition: 'all 0.2s ease'
                }}
              >
                <Group gap="xs">
                  {filter.icon}
                  <Text size="xs" fw={700} c={isActive(filter.id) ? 'brand' : 'dark'}>{filter.label}</Text>
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
              onClick={() => {
                const coords = areaCoords[area];
                if (coords) setMapCenter(coords);
              }}
              style={{ borderRadius: '8px', borderBottom: '1px solid #f1f3f5', width: '100%' }} 
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

      {/* 5. Weather Widget */}
      <Paper p="md" radius="lg" withBorder shadow="sm" style={{ borderLeft: '4px solid #fab005' }}>
        <Group justify="space-between">
          <Group>
            <IconCloud size={32} color="#fab005" />
            <Box>
               <Text fw={900} size="lg">{weather.temp}</Text>
               <Text size="xs" c="dimmed">{weather.desc}</Text>
               <Text size="xs" c="dimmed">{address}</Text>
            </Box>
          </Group>
          <IconChevronRight size={14} color="gray" />
        </Group>
      </Paper>
    </Stack>
  );
};

export default MapSearch;
