import React, { useState, useEffect } from 'react';
import { 
  Paper, Stack, TextInput, Textarea, Switch, Button, 
  Group, Title, Text, LoadingOverlay, Box, Divider,
  SimpleGrid, Image, ThemeIcon, Select, FileButton, Card,
  Avatar, Grid, Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MarkerF } from '@react-google-maps/api';
import { notifications } from '@mantine/notifications';
import { 
  IconBuildingStore, IconCamera, IconDeviceFloppy, 
  IconAlertCircle, IconClock, IconToolsKitchen, IconMapPin,
  IconPhoto
} from '@tabler/icons-react';
import { useStallInformation } from '../../../../hooks/admin/StallManager/StallInformation/useStallInformtion';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import MapAutocomplete from '../../../common/MapAutocomplete';

const MyStall = () => {
  const { stallData, setStallData, loading, saving, updateMyStall } = useStallInformation();
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStallData({ ...stallData, imageURL: reader.result });
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMyStall(stallData);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <form onSubmit={handleSave}>
        <Stack gap="xl">
          {/* Header Card */}
          <Card p={0} radius="lg" withBorder shadow="sm" style={{ overflow: 'hidden' }}>
            <Box style={{ height: '240px', position: 'relative', backgroundColor: '#f1f3f5' }}>
              <Image
                src={stallData.imageURL}
                h={240}
                fallbackSrc="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                style={{ objectFit: 'cover' }}
              />
              <Box style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
                <FileButton onChange={handleImageChange} accept="image/png,image/jpeg">
                  {(props) => (
                    <Button 
                      {...props} 
                      leftSection={<IconPhoto size={16} />} 
                      color="white" variant="white" radius="xl" shadow="md" size="sm" style={{ color: '#4D6459' }}
                    >
                      Change Header Photo
                    </Button>
                  )}
                </FileButton>
              </Box>
              <Box style={{ position: 'absolute', bottom: -40, left: 40, zIndex: 11 }}>
                <Avatar size={100} radius={100} src={stallData.imageURL} style={{ border: '4px solid white', backgroundColor: 'var(--mm-admin-accent)' }}>
                  <IconBuildingStore size={40} color="var(--mm-admin-sidebar)" />
                </Avatar>
              </Box>
            </Box>

            <Box p="xl" pt={60}>
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Title order={2} style={{ color: 'var(--mm-admin-sidebar)', fontWeight: 900 }}>
                    {stallData.stallName || 'Untilted Stall'}
                  </Title>
                  <Text c="dimmed" size="sm">
                    {stallData.cuisineType || 'Cuisine not set'} • {stallData.isHalal ? 'Halal Certified' : 'Non-Halal'}
                  </Text>
                </Box>
                <Button type="submit" loading={saving} leftSection={<IconDeviceFloppy size={18} />} color="olive" radius="xl" size="md">
                  Save Profile Changes
                </Button>
              </Group>
            </Box>
          </Card>

          {/* Rearranged Grid Layout */}
          <Grid gutter="xl">
            {/* Main Details Section */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="xl">
                <Paper p="xl" withBorder radius="lg" shadow="xs">
                  <Group mb="lg" gap="xs">
                    <ThemeIcon variant="light" color="olive" radius="md">
                      <IconToolsKitchen size={18} />
                    </ThemeIcon>
                    <Title order={4} style={{ color: 'var(--mm-admin-sidebar)' }}>Identity & Cuisine</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <TextInput
                      label="Stall Display Name"
                      placeholder="Enter stall name"
                      required
                      value={stallData.stallName}
                      onChange={(e) => setStallData({ ...stallData, stallName: e.target.value })}
                      radius="md"
                    />
                    
                    <Select
                      label="Cuisine Type"
                      placeholder="Select cuisine"
                      required
                      data={['Malay', 'Western', 'Chinese', 'Japanese', 'Indian', 'Thai']}
                      value={stallData.cuisineType}
                      onChange={(val) => setStallData({ ...stallData, cuisineType: val })}
                      radius="md"
                      searchable
                    />

                    <Paper withBorder p="md" radius="md" style={{ backgroundColor: '#fcfdfc' }}>
                      <Group justify="space-between">
                        <Box>
                          <Text fw={600} size="sm" color="var(--mm-admin-sidebar)">Halal Certification</Text>
                          <Text size="xs" c="dimmed">Verified status for Muslim customers</Text>
                        </Box>
                        <Switch
                          checked={stallData.isHalal}
                          onChange={(e) => setStallData({ ...stallData, isHalal: e.currentTarget.checked })}
                          color="green"
                          size="md"
                        />
                      </Group>
                    </Paper>
                  </Stack>
                </Paper>

                <Paper p="xl" withBorder radius="lg" shadow="xs">
                  <Title order={4} mb="lg" style={{ color: 'var(--mm-admin-sidebar)' }}>About Your Stall</Title>
                  <Textarea
                    label="Description"
                    placeholder="What makes your stall unique? Share your story..."
                    value={stallData.description}
                    onChange={(e) => setStallData({ ...stallData, description: e.target.value })}
                    radius="md"
                    minRows={6}
                  />
                </Paper>
              </Stack>
            </Grid.Col>

            {/* Sidebar Details Section */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="xl">
                <Paper p="xl" withBorder radius="lg" shadow="xs">
                  <Group mb="lg" gap="xs">
                    <ThemeIcon variant="light" color="blue" radius="md">
                      <IconClock size={18} />
                    </ThemeIcon>
                    <Title order={4} style={{ color: 'var(--mm-admin-sidebar)' }}>Operating Hours</Title>
                  </Group>

                  <Select
                    label="Standard Schedule"
                    placeholder="Select typical hours"
                    data={[
                      { value: '07:00 AM - 02:00 PM', label: '07:00 AM - 02:00 PM (Breakfast/Lunch)' },
                      { value: '08:00 AM - 04:00 PM', label: '08:00 AM - 04:00 PM (Standard Cafe)' },
                      { value: '10:00 AM - 10:00 PM', label: '10:00 AM - 10:00 PM (Restaurant/Mall)' },
                      { value: '11:00 AM - 03:00 PM', label: '11:00 AM - 03:00 PM (Lunch Only)' },
                      { value: '05:00 PM - 12:00 AM', label: '05:00 PM - 12:00 AM (Dinner)' },
                      { value: '06:00 PM - 02:00 AM', label: '06:00 PM - 02:00 AM (Night Market/Mamak)' },
                      { value: '24 Hours', label: '24 Hours (Nasi Kandar/Mamak)' },
                    ]}
                    value={stallData.operatingHours}
                    onChange={(val) => setStallData({ ...stallData, operatingHours: val })}
                    radius="md"
                  />
                </Paper>

                <Paper p="xl" withBorder radius="lg" shadow="xs">
                  <Group mb="lg" justify="space-between" align="center">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="red" radius="md">
                        <IconMapPin size={18} />
                      </ThemeIcon>
                      <Title order={4} style={{ color: 'var(--mm-admin-sidebar)' }}>Location Access</Title>
                    </Group>
                    <Button 
                      variant="subtle" 
                      size="compact-xs" 
                      leftSection={<IconMapPin size={14} />}
                      onClick={open}
                    >
                      Pick on Map
                    </Button>
                  </Group>

                  <Stack gap="md">
                    <TextInput
                      label="Latitude"
                      type="number"
                      value={stallData.latitude}
                      onChange={(e) => setStallData({ ...stallData, latitude: e.target.value })}
                      radius="md"
                    />
                    <TextInput
                      label="Longitude"
                      type="number"
                      value={stallData.longitude}
                      onChange={(e) => setStallData({ ...stallData, longitude: e.target.value })}
                      radius="md"
                    />
                  </Stack>

                  <Modal 
                    opened={opened} 
                    onClose={close} 
                    title="Update My Stall Location" 
                    size="lg"
                    radius="lg"
                  >
                    <Stack gap="md">
                      <MapAutocomplete 
                        onPlaceSelected={(place) => {
                          setStallData({ ...stallData, latitude: place.lat, longitude: place.lng });
                        }}
                        label="Search New Location"
                        placeholder="Type building or street name..."
                      />
                      
                      <Box h={400} pos="relative">
                        <GoogleMapWrapper 
                          center={{ lat: parseFloat(stallData.latitude) || 3.1390, lng: parseFloat(stallData.longitude) || 101.6869 }}
                          zoom={15}
                          onClick={(e) => {
                            setStallData({ 
                              ...stallData, 
                              latitude: e.latLng.lat().toFixed(6), 
                              longitude: e.latLng.lng().toFixed(6) 
                            });
                          }}
                        >
                          <MarkerF position={{ lat: parseFloat(stallData.latitude), lng: parseFloat(stallData.longitude) }} />
                        </GoogleMapWrapper>
                        <Text size="xs" c="dimmed" mt="xs" ta="center">
                          Click on the map to pin your exact stall location
                        </Text>
                      </Box>
                      <Button fullWidth onClick={close} radius="xl">Confirm Location</Button>
                    </Stack>
                  </Modal>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </form>
    </Box>
  );
};

export default MyStall;
