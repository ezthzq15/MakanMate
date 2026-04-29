import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../../lib/api';
import { Drawer, TextInput, NumberInput, Switch, Textarea, Stack, Group, Button, Text, Divider, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useEditStalls } from '../../../hooks/admin/StallManagement/useEditStalls';

const EditStalls = ({ stall, onClear, onSuccess }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { editStall, loading } = useEditStalls(() => {
    onSuccess();
    handleClose();
  });

  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/admin/users?role=StallManager`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setManagers(data.users.map(u => ({ value: u.userID, label: u.userName })));
        }
      } catch (err) {
        console.error('Fetch managers error:', err);
      }
    };
    fetchManagers();
  }, []);

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
      open();
    }
  }, [stall]);

  const handleClose = () => {
    close();
    onClear(); // Reset the selectedStall in parent
  };

  const handleSubmit = (values) => {
    editStall(values);
  };

  return (
    <Drawer 
      opened={opened} 
      onClose={handleClose} 
      title="Edit Food Stall" 
      position="right"
      size="md"
      padding="xl"
      styles={{
        title: { fontWeight: 800, fontSize: '18px', color: '#4D6459' },
        body: { overflowY: 'auto', height: 'calc(100vh - 60px)' },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* General Info */}
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">General Information</Text>
          <TextInput
            label="Stall Name"
            required
            {...form.getInputProps('stallName')}
          />

          <TextInput
            label="Cuisine Type"
            required
            {...form.getInputProps('cuisineType')}
          />

          <Select
            label="Assign Stall Manager"
            placeholder="Type to search employee..."
            description="Only users with 'Stall Manager' role are listed"
            data={managers}
            searchable
            clearable
            leftSection={<IconSearch size={14} />}
            nothingFoundMessage="No stall managers found"
            maxDropdownHeight={200}
            {...form.getInputProps('managerID')}
          />

          <Divider />

          {/* Status & Attributes */}
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status & Attributes</Text>
          <Switch
            label="Halal Status"
            labelPosition="left"
            {...form.getInputProps('isHalal', { type: 'checkbox' })}
          />

          <Divider />

          {/* Location */}
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Location & Visuals</Text>

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

          <Button type="submit" fullWidth mt="sm" color="olive" radius="xl" loading={loading}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EditStalls;
