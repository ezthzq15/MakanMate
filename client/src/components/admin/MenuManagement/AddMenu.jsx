import React from 'react';
import { Drawer, Button, TextInput, NumberInput, Switch, Textarea, Stack, Divider, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { useMenu } from '../../../hooks/admin/MenuManagement/useMenu';

const AddMenu = ({ stallID }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { addMenuItem } = useMenu(stallID);

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

  const handleSubmit = async (values) => {
    const success = await addMenuItem(values);
    if (success) {
      form.reset();
      close();
    }
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
        Add Menu Item
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        title="Add New Menu Item"
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
              placeholder="e.g. Nasi Lemak Ayam Goreng"
              required
              {...form.getInputProps('itemName')}
            />

            <NumberInput
              label="Price (RM)"
              placeholder="0.00"
              precision={2}
              min={0}
              required
              {...form.getInputProps('itemPrice')}
            />

            <Textarea
              label="Description"
              placeholder="What makes this dish special?"
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
              placeholder="https://..."
              {...form.getInputProps('itemImage')}
            />

            <Button type="submit" fullWidth mt="xl" color="olive" radius="xl">
              Add to Menu
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
};

export default AddMenu;
