import React, { useEffect } from 'react';
import { Drawer, TextInput, NumberInput, Switch, Textarea, Stack, Group, Button, Text, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useEditStalls } from '../../../hooks/admin/StallManagement/useEditStalls';

const EditStalls = ({ stall, onClear, onSuccess }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { editStall, loading } = useEditStalls(() => {
    onSuccess();
    handleClose();
  });

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

          <TextInput
            label="Operating Hours"
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
