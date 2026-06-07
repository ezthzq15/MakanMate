import React, { useEffect, useState } from 'react';
import { Drawer, TextInput, NumberInput, Switch, Textarea, Stack, Group, Button, Text, Divider, Select, Modal, Box, MultiSelect } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconMapPin } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { MarkerF } from '@react-google-maps/api';
import apiClient from '../../../../lib/apiClient';
import { useEditStalls } from '../../../../hooks/admin/SuperAdmin/StallManagement/useEditStalls';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import MapAutocomplete from '../../../common/MapAutocomplete';

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

const EditStalls = ({ stall, opened, onClose, onSuccess }) => {
  const [mapOpened, { open: openMap, close: closeMap }] = useDisclosure(false);
  const { editStall, loading: updating } = useEditStalls(() => {
    onSuccess?.();
    onClose?.();
  });

  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    if (opened) {
      const fetchManagersAndStalls = async () => {
        try {
          setLoadingManagers(true);
          const [managersRes, stallsRes] = await Promise.all([
            apiClient.get('/admin/users?role=StallManager'),
            apiClient.get('/admin/stalls'),
          ]);

          const managersData = managersRes.data?.users || [];
          const stallsData = stallsRes.data?.stalls || [];

          const currentStallID = stall?.stallID;
          const assignedOtherManagerIds = new Set(
            stallsData
              .filter(s => s.stallID !== currentStallID)
              .map(s => s.managerID)
              .filter(Boolean)
          );

          const availableManagers = managersData.filter(
            u => !assignedOtherManagerIds.has(u.userID)
          );

          setManagers(availableManagers.map(u => ({ value: u.userID, label: u.userName })));
        } catch (err) {
          console.error('Fetch managers and stalls error:', err);
        } finally {
          setLoadingManagers(false);
        }
      };
      fetchManagersAndStalls();
    }
  }, [opened, stall]);

  const form = useForm({
    initialValues: {
      stallID: '',
      stallName: '',
      cuisineType: '',
      isHalal: false,
      latitude: 0,
      longitude: 0,
      description: '',
      operatingHours: '',
      operatingDays: [],
      specialHours: '',
      openingTime: '',
      closingTime: '',
      is24Hours: false,
      imageURL: '',
      managerID: null,
    },
    validate: {
      stallName: (value) => (value.length < 2 ? 'Stall name is required' : null),
      cuisineType: (value) => (value.length < 2 ? 'Cuisine type is required' : null),
    },
  });

  useEffect(() => {
    if (stall) {
      form.setValues({
        stallID: stall.stallID || '',
        stallName: stall.stallName || '',
        cuisineType: stall.cuisineType || '',
        isHalal: stall.isHalal === true,
        latitude: stall.latitude || 0,
        longitude: stall.longitude || 0,
        description: stall.description || '',
        operatingHours: stall.operatingHours || '',
        operatingDays: stall.operatingDays ? stall.operatingDays.split(', ').filter(Boolean) : [],
        specialHours: stall.specialHours || '',
        imageURL: stall.imageURL || '',
        managerID: stall.managerID || null,
        is24Hours: stall.operatingHours === '24 Hours',
      });
      
      if (stall.operatingHours && stall.operatingHours !== '24 Hours') {
        const parts = stall.operatingHours.split(' - ');
        if (parts.length === 2) {
          form.setFieldValue('openingTime', parseTime24(parts[0]));
          form.setFieldValue('closingTime', parseTime24(parts[1]));
        }
      } else {
        form.setFieldValue('openingTime', '');
        form.setFieldValue('closingTime', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stall]);

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
    submitValues.operatingDays = values.operatingDays.join(', ');
    
    editStall(submitValues);
  };

  return (
    <Drawer 
      opened={opened} 
      onClose={onClose} 
      title="Edit Food Stall" 
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
            label="Halal Status"
            labelPosition="left"
            {...form.getInputProps('isHalal', { type: 'checkbox' })}
          />

          <Divider />

          <Group justify="space-between" align="center">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Location & Visuals</Text>
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
              label="LAT"
              precision={6}
              {...form.getInputProps('latitude')}
            />
            <NumberInput
              label="LONG"
              precision={6}
              {...form.getInputProps('longitude')}
            />
          </Group>

          <Modal 
            opened={mapOpened} 
            onClose={closeMap} 
            title="Update Stall Location" 
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
                  center={{ lat: form.values.latitude || 3.1390, lng: form.values.longitude || 101.6869 }}
                  zoom={15}
                  onClick={(e) => {
                    form.setFieldValue('latitude', e.latLng.lat());
                    form.setFieldValue('longitude', e.latLng.lng());
                  }}
                >
                  <MarkerF position={{ lat: form.values.latitude, lng: form.values.longitude }} />
                </GoogleMapWrapper>
                <Text size="xs" c="dimmed" mt="xs" ta="center">
                  Click on the map to update the stall coordinates
                </Text>
              </Box>
              <Button fullWidth onClick={closeMap} radius="xl">Confirm Update</Button>
            </Stack>
          </Modal>

          <Textarea
            label="Description"
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

          <MultiSelect
            label="Operating Days"
            placeholder="Select days stall is open"
            data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
            required
            clearable
            {...form.getInputProps('operatingDays')}
          />

          <TextInput
            label="Special / Different Hours"
            placeholder="e.g. Weekends: 10:00 AM - 3:00 PM"
            {...form.getInputProps('specialHours')}
          />

          <TextInput
            label="Image URL"
            {...form.getInputProps('imageURL')}
          />

          <Button type="submit" fullWidth mt="sm" color="olive" radius="xl" loading={updating}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EditStalls;
