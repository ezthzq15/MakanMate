import React, { useEffect, useState } from 'react';
import { Drawer, TextInput, NumberInput, Switch, Textarea, Stack, Group, Button, Text, Divider, Select, Modal, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconMapPin } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { MarkerF } from '@react-google-maps/api';
import apiClient from '../../../../lib/apiClient';
import { useEditStalls } from '../../../../hooks/admin/SuperAdmin/StallManagement/useEditStalls';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import MapAutocomplete from '../../../common/MapAutocomplete';

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
      const fetchManagers = async () => {
        try {
          setLoadingManagers(true);
          const res = await apiClient.get('/admin/users?role=StallManager');
          const users = res.data.users || [];
          setManagers(users.map(u => ({ value: u.userID, label: u.userName })));
        } catch (err) {
          console.error('Fetch managers error:', err);
        } finally {
          setLoadingManagers(false);
        }
      };
      fetchManagers();
    }
  }, [opened]);

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
        imageURL: stall.imageURL || '',
        managerID: stall.managerID || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stall]);

  const handleSubmit = (values) => {
    editStall(values);
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

          <Select
            label="Operating Hours"
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
            searchable
            clearable
            {...form.getInputProps('operatingHours')}
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
