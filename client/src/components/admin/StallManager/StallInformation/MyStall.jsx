import React, { useState, useEffect } from 'react';
import { 
  Paper, Stack, TextInput, Textarea, Switch, Button, 
  Group, Title, Text, LoadingOverlay, Box, Divider,
  SimpleGrid, Image, ThemeIcon, Select, FileButton, Card,
  Avatar, Grid, Modal, MultiSelect
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MarkerF } from '@react-google-maps/api';
import { notifications } from '@mantine/notifications';
import { 
  IconBuildingStore, IconCamera, IconDeviceFloppy, 
  IconAlertCircle, IconClock, IconToolsKitchen, IconMapPin,
  IconPhoto, IconUpload, IconCertificate
} from '@tabler/icons-react';
import { useStallInformation } from '../../../../hooks/admin/StallManager/StallInformation/useStallInformtion';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import MapAutocomplete from '../../../common/MapAutocomplete';
import apiClient from '../../../../lib/apiClient';

const parseTime24 = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return '';
  let [ , hours, minutes, modifier ] = match;
  hours = parseInt(hours, 10);
  if (hours === 12 && modifier.toUpperCase() === 'AM') hours = 0;
  else if (hours < 12 && modifier.toUpperCase() === 'PM') hours += 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const formatTime12 = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
};

const MyStall = () => {
  const { stallData, setStallData, loading, saving, updateMyStall } = useStallInformation();
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);

  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [is24Hours, setIs24Hours] = useState(false);

  const getSelectedDays = () => {
    if (!stallData.operatingDays) return [];
    if (Array.isArray(stallData.operatingDays)) return stallData.operatingDays;
    return stallData.operatingDays.split(', ').filter(Boolean);
  };

  useEffect(() => {
    if (stallData?.operatingHours) {
      if (stallData.operatingHours === '24 Hours') {
        setIs24Hours(true);
      } else {
        setIs24Hours(false);
        const parts = stallData.operatingHours.split(' - ');
        if (parts.length === 2) {
          setOpeningTime(parseTime24(parts[0]));
          setClosingTime(parseTime24(parts[1]));
        }
      }
    }
  }, [stallData?.operatingHours]);

  const handleImageChange = async (imgFile) => {
    if (!imgFile) return;
    setUploadingHeader(true);
    
    try {
      const formData = new FormData();
      formData.append('image', imgFile);
      
      const res = await apiClient.post('/stalls/my-stall/header-image', formData, {
        timeout: 60000
      });
      
      setStallData({ ...stallData, imageURL: res.data.imageURL });
      notifications.show({
        title: 'Success',
        message: 'Header image uploaded successfully!',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Upload Failed',
        message: err.response?.data?.error || err.message || 'Could not upload header image',
        color: 'red'
      });
    } finally {
      setUploadingHeader(false);
    }
  };

  const handleCertUpload = async (certFile) => {
    if (!certFile) return;
    setUploadingCert(true);
    
    try {
      const formData = new FormData();
      formData.append('certificate', certFile);
      
      const res = await apiClient.post('/stalls/my-stall/halal-cert', formData, {
        timeout: 60000 // 60 seconds to allow for Firebase upload
      });
      
      setStallData({ ...stallData, halalCertURL: res.data.halalCertURL });
      notifications.show({
        title: 'Success',
        message: 'Halal Certificate uploaded successfully!',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Upload Failed',
        message: err.response?.data?.error || err.message || 'Could not upload certificate',
        color: 'red'
      });
    } finally {
      setUploadingCert(false);
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();
    let newOperatingHours = stallData.operatingHours;
    if (is24Hours) {
      newOperatingHours = '24 Hours';
    } else if (openingTime && closingTime) {
      newOperatingHours = `${formatTime12(openingTime)} - ${formatTime12(closingTime)}`;
    }
    await updateMyStall({ ...stallData, operatingHours: newOperatingHours });
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
                      loading={uploadingHeader}
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
                      data={['Malay', 'Western', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Pastries & Cafe']}
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
                      
                      {stallData.isHalal && (
                        <>
                          <Divider my="sm" />
                          <Box>
                            <Text fw={600} size="sm" mb="xs">Halal Certificate Document</Text>
                            <Group align="center">
                              <FileButton onChange={handleCertUpload} accept="application/pdf, image/png, image/jpeg, .pdf, .png, .jpg, .jpeg">
                                {(props) => (
                                  <Button 
                                    {...props} 
                                    loading={uploadingCert}
                                    variant="light" 
                                    color="olive" 
                                    leftSection={<IconUpload size={16} />}
                                    size="sm"
                                  >
                                    Upload Certificate
                                  </Button>
                                )}
                              </FileButton>
                              
                              {stallData.halalCertURL && (
                                <Button 
                                  component="a" 
                                  href={stallData.halalCertURL} 
                                  target="_blank" 
                                  variant="subtle" 
                                  color="blue"
                                  leftSection={<IconCertificate size={16} />}
                                >
                                  Open in New Tab
                                </Button>
                              )}
                            </Group>
                            <Text size="xs" c="dimmed" mt="xs" mb="md">Upload PDF or high-quality image (Max 10MB). Stored securely in Firebase.</Text>
                            
                            {stallData.halalCertURL && (
                              <Box mt="md" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: '8px', overflow: 'hidden', height: '250px' }}>
                                {stallData.halalCertURL.toLowerCase().includes('.pdf') ? (
                                  <iframe 
                                    src={stallData.halalCertURL} 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 'none' }} 
                                    title="Certificate Preview"
                                  />
                                ) : (
                                  <Image 
                                    src={stallData.halalCertURL} 
                                    alt="Halal Certificate" 
                                    height={250} 
                                    fit="contain" 
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        </>
                      )}
                    </Paper>

                    {/* Muslim Friendly Toggle */}
                    <Paper withBorder p="md" radius="md" style={{ backgroundColor: '#fcfdfc' }}>
                      <Group justify="space-between">
                        <Box>
                          <Text fw={600} size="sm" color="var(--mm-admin-sidebar)">Muslim Friendly</Text>
                          <Text size="xs" c="dimmed">
                            Stall is suitable for Muslim customers (no pork / no lard).
                            Separate from Halal certification — stall manager must verify.
                          </Text>
                        </Box>
                        <Switch
                          checked={stallData.isMuslimFriendly ?? false}
                          onChange={(e) => setStallData({ ...stallData, isMuslimFriendly: e.currentTarget.checked })}
                          color="teal"
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
                    <Title order={4} style={{ color: 'var(--mm-admin-sidebar)' }}>Operating Hours & Days</Title>
                  </Group>

                  <Switch
                    label="Open 24 Hours"
                    checked={is24Hours}
                    onChange={(e) => {
                      setIs24Hours(e.currentTarget.checked);
                      if (!e.currentTarget.checked) {
                        setOpeningTime('');
                        setClosingTime('');
                      }
                    }}
                    mb="md"
                    color="blue"
                  />

                  {!is24Hours && (
                    <Group grow mb="md">
                      <TextInput
                        label="Opening Time"
                        type="time"
                        required={!is24Hours}
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        radius="md"
                      />
                      <TextInput
                        label="Closing Time"
                        type="time"
                        required={!is24Hours}
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        radius="md"
                      />
                    </Group>
                  )}

                  <MultiSelect
                    label="Days Operating"
                    placeholder="Select operating days"
                    data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                    value={getSelectedDays()}
                    onChange={(val) => setStallData({ ...stallData, operatingDays: val.join(', ') })}
                    radius="md"
                    mb="md"
                  />

                  <TextInput
                    label="Special / Custom Hours"
                    placeholder="e.g. Weekends: 10:00 AM - 3:00 PM"
                    value={stallData.specialHours || ''}
                    onChange={(e) => setStallData({ ...stallData, specialHours: e.target.value })}
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
