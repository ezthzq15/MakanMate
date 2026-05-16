import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Drawer, Button, TextInput, NumberInput, Switch, Textarea, Stack, Group, Divider, Select, Text, Modal, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconSearch, IconMapPin } from '@tabler/icons-react';
import { MarkerF } from '@react-google-maps/api';
import apiClient from '../../../../lib/apiClient';
import { useAddStalls } from '../../../../hooks/admin/SuperAdmin/StallManagement/useAddStalls';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import MapAutocomplete from '../../../common/MapAutocomplete';

const formatTime12 = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
};

const AddStalls = forwardRef(({ onSuccess }, ref) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [mapOpened, { open: openMap, close: closeMap }] = useDisclosure(false);
  
  const { addStall, loading } = useAddStalls(() => {
    onSuccess?.();
    close();
    form.reset();
  });

  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  useImperativeHandle(ref, () => ({
    open
  }));

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true);
        const res = await apiClient.get('/admin/users?role=StallManager');
        const data = res.data;
        if (data && data.users) {
          setManagers(data.users.map(u => ({ value: u.userID, label: u.userName })));
        }
      } catch (err) {
        console.error('Fetch managers error:', err);
      } finally {
        setLoadingManagers(false);
      }
    };
    if (opened) fetchManagers();
  }, [opened]);

  const form = useForm({
    initialValues: {
      stallName: '',
      cuisineType: '',
      isHalal: false,
      latitude: 1.3521, // default SG lat
      longitude: 103.8198, // default SG long
      description: '',
      operatingHours: '',
      openingTime: '',
      closingTime: '',
      is24Hours: false,
      imageURL: '',
      managerID: null,
    },
    validate: {
      stallName: (value) => (value.length < 2 ? 'Stall name must have at least 2 characters' : null),
      cuisineType: (value) => (value.length < 2 ? 'Cuisine type must have at least 2 characters' : null),
      latitude: (value) => (value < -90 || value > 90 ? 'Latitude must be between -90 and 90' : null),
      longitude: (value) => (value < -180 || value > 180 ? 'Longitude must be between -180 and 180' : null),
    },
  });

  const handleSubmit = (values) => {
    let newOperatingHours = values.operatingHours;
    if (values.is24Hours) {
      newOperatingHours = '24 Hours';
    } else if (values.openingTime && values.closingTime) {
      newOperatingHours = `${formatTime12(values.openingTime)} - ${formatTime12(values.closingTime)}`;
    }
    
    // Remove virtual fields before sending to API
    const { openingTime, closingTime, is24Hours, ...submitValues } = values;
    submitValues.operatingHours = newOperatingHours;
    
    addStall(submitValues);
  };

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        color="olive"
        radius="xl"
        size="sm"
        onClick={open}
      >
        Add Stall
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        title="Add New Food Stall"
        position="right"
        size="md"
        padding="xl"
        styles={{
          title: { fontWeight: 800, fontSize: '18px', color: 'var(--mm-admin-sidebar)' },
          body: { overflowY: 'auto', height: 'calc(100vh - 60px)' },
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">General Information</Text>
            <TextInput
              label="Stall Name"
              placeholder="e.g. Spicy Wok Central"
              required
              {...form.getInputProps('stallName')}
            />

            <Select
              label="Cuisine Type"
              placeholder="Select cuisine"
              required
              data={['Malay', 'Western', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Pastries & Cafe']}
              {...form.getInputProps('cuisineType')}
            />

            <Select
              label="Assign Stall Manager"
              placeholder="Type to search employee..."
              description="Only users with 'Stall Manager' role are listed"
              data={managers}
              searchable
              clearable
              leftSection={loadingManagers ? <IconSearch size={14} className="animate-spin" /> : <IconSearch size={14} />}
              nothingFoundMessage="No stall managers found"
              maxDropdownHeight={200}
              {...form.getInputProps('managerID')}
            />

            <Divider />

            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status & Attributes</Text>
            <Switch
              label="Halal Certified"
              labelPosition="left"
              {...form.getInputProps('isHalal', { type: 'checkbox' })}
            />

            <Divider />

            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Location</Text>
              <Button 
                variant="subtle" 
                size="compact-xs" 
                leftSection={<IconMapPin size={14} />}
                onClick={openMap}
              >
                Pick on Map
              </Button>
            </Group>

            <Group grow>
              <NumberInput
                label="Latitude"
                placeholder="1.290270"
                required
                precision={6}
                min={-90}
                max={90}
                {...form.getInputProps('latitude')}
              />
              <NumberInput
                label="Longitude"
                placeholder="103.851959"
                required
                precision={6}
                min={-180}
                max={180}
                {...form.getInputProps('longitude')}
              />
            </Group>

            <Modal 
              opened={mapOpened} 
              onClose={closeMap} 
              title="Pick Stall Location" 
              size="lg"
              radius="lg"
            >
              <Stack gap="md">
                <MapAutocomplete 
                  onPlaceSelected={(place) => {
                    form.setFieldValue('latitude', place.lat);
                    form.setFieldValue('longitude', place.lng);
                  }}
                  label="Search Location"
                  placeholder="Type a building name or address..."
                />
                
                <Box h={400} pos="relative">
                  <GoogleMapWrapper 
                    center={{ lat: form.values.latitude, lng: form.values.longitude }}
                    zoom={15}
                    onClick={(e) => {
                      form.setFieldValue('latitude', e.latLng.lat());
                      form.setFieldValue('longitude', e.latLng.lng());
                    }}
                  >
                    <MarkerF position={{ lat: form.values.latitude, lng: form.values.longitude }} />
                  </GoogleMapWrapper>
                  <Text size="xs" c="dimmed" mt="xs" ta="center">
                    Click on the map to set the stall coordinates
                  </Text>
                </Box>
                <Button fullWidth onClick={closeMap} radius="xl">Confirm Location</Button>
              </Stack>
            </Modal>

            <Textarea
              label="Description"
              placeholder="Enter stall description"
              minRows={3}
              {...form.getInputProps('description')}
            />

            <Switch
              label="Open 24 Hours"
              checked={form.values.is24Hours}
              onChange={(e) => {
                form.setFieldValue('is24Hours', e.currentTarget.checked);
                if (!e.currentTarget.checked) {
                  form.setFieldValue('openingTime', '');
                  form.setFieldValue('closingTime', '');
                }
              }}
              mb="md"
              color="blue"
            />

            {!form.values.is24Hours && (
              <Group grow>
                <TextInput
                  label="Opening Time"
                  type="time"
                  required={!form.values.is24Hours}
                  {...form.getInputProps('openingTime')}
                />
                <TextInput
                  label="Closing Time"
                  type="time"
                  required={!form.values.is24Hours}
                  {...form.getInputProps('closingTime')}
                />
              </Group>
            )}

            <TextInput
              label="Banner Image URL"
              placeholder="https://..."
              {...form.getInputProps('imageURL')}
            />

            <Button type="submit" fullWidth mt="sm" color="olive" radius="xl" loading={loading}>
              Create Stall
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
});

AddStalls.displayName = 'AddStalls';
export default AddStalls;
