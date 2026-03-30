import React, { useRef, useState } from 'react';
import { Drawer, Button, TextInput, NumberInput, Switch, Textarea, Stack, Group, Title, Divider, Text, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { useAddStalls } from '../../../hooks/admin/StallManagement/useAddStalls';

const AddStalls = ({ onSuccess }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { addStall, loading } = useAddStalls(() => {
    onSuccess();
    close();
    form.reset();
  });

  const form = useForm({
    initialValues: {
      stallName: '',
      cuisineType: '',
      isHalal: false,
      latitude: 1.3521, // default SG lat
      longitude: 103.8198, // default SG long
      description: '',
      operatingHours: '',
      imageURL: '',
    },
    validate: {
      stallName: (value) => (value.length < 2 ? 'Stall name must have at least 2 characters' : null),
      cuisineType: (value) => (value.length < 2 ? 'Cuisine type must have at least 2 characters' : null),
      latitude: (value) => (value < -90 || value > 90 ? 'Latitude must be between -90 and 90' : null),
      longitude: (value) => (value < -180 || value > 180 ? 'Longitude must be between -180 and 180' : null),
    },
  });

  const handleSubmit = (values) => {
    addStall(values);
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
              placeholder="e.g. Spicy Wok Central"
              required
              {...form.getInputProps('stallName')}
            />

            <TextInput
              label="Cuisine Type"
              placeholder="e.g. Thai, Malay, Healthy"
              required
              {...form.getInputProps('cuisineType')}
            />

            <Divider />

            {/* Status & Attributes */}
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status & Attributes</Text>
            <Switch
              label="Halal Certified"
              labelPosition="left"
              {...form.getInputProps('isHalal', { type: 'checkbox' })}
            />

            <Divider />

            {/* Location */}
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Location</Text>

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

            <Textarea
              label="Description"
              placeholder="Enter stall description"
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
};

export default AddStalls;
