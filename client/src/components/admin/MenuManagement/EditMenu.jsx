import React, { useEffect } from 'react';
import { Drawer, Button, TextInput, NumberInput, Switch, Textarea, Stack, Divider, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMenu } from '../../../hooks/admin/MenuManagement/useMenu';

const EditMenu = ({ item, stallID, onClose }) => {
  const { updateMenuItem } = useMenu(stallID);

  const form = useForm({
    initialValues: {
      itemName: '',
      itemPrice: 0,
      itemDescription: '',
      itemImage: '',
      isAvailable: true,
    },
    validate: {
      itemName: (value) => (value.length < 2 ? 'Item name is required' : null),
      itemPrice: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        itemName: item.itemName || '',
        itemPrice: Number(item.itemPrice) || 0,
        itemDescription: item.itemDescription || '',
        itemImage: item.itemImage || '',
        isAvailable: item.isAvailable === true,
      });
    }
  }, [item]);

  const handleSubmit = async (values) => {
    const success = await updateMenuItem(item.menuID, values);
    if (success) {
      onClose();
    }
  };

  return (
    <Drawer
      opened={!!item}
      onClose={onClose}
      title="Edit Menu Item"
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
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Item Information</Text>
          <TextInput
            label="Item Name"
            required
            {...form.getInputProps('itemName')}
          />

          <NumberInput
            label="Price (RM)"
            precision={2}
            min={0}
            required
            {...form.getInputProps('itemPrice')}
          />

          <Textarea
            label="Description"
            minRows={3}
            {...form.getInputProps('itemDescription')}
          />

          <Divider />

          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status & Visuals</Text>
          <Switch
            label="Available for Order"
            labelPosition="left"
            {...form.getInputProps('isAvailable', { type: 'checkbox' })}
          />

          <TextInput
            label="Image URL"
            {...form.getInputProps('itemImage')}
          />

          <Button type="submit" fullWidth mt="xl" color="olive" radius="xl">
            Save Changes
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EditMenu;
