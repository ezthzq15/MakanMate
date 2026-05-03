import React, { useEffect } from 'react';
import { 
  Drawer, Button, TextInput, NumberInput, Switch, 
  Textarea, Stack, Divider, Text, Group, Select, ThemeIcon, Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPencil, IconToolsKitchen2 } from '@tabler/icons-react';
import { useMenu } from '../../../../hooks/admin/StallManager/MenuManagement/useMenu';

const EditMenu = ({ item, stallID, opened, onClose, onSuccess }) => {
  const { updateMenuItem } = useMenu(stallID);

  const form = useForm({
    initialValues: {
      menuName: '',
      menuPrice: 0,
      itemDescription: '',
      menuPic: '',
      isAvailable: true,
      category: 'Main Course'
    },
    validate: {
      menuName: (value) => (value.length < 2 ? 'Item name is required' : null),
      menuPrice: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        menuName: item.menuName || '',
        menuPrice: item.menuPrice || 0,
        itemDescription: item.itemDescription || '',
        menuPic: item.menuPic || '',
        isAvailable: item.isAvailable !== false,
        category: item.category || 'Main Course'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const handleSubmit = async (values) => {
    const success = await updateMenuItem(item.menuID, values);
    if (success) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon variant="light" color="blue" radius="md">
            <IconPencil size={18} />
          </ThemeIcon>
          <Text fw={800} size="lg">Edit Menu Item</Text>
        </Group>
      }
      position="right"
      size="md"
      padding="xl"
      styles={{
        title: { color: 'var(--mm-admin-sidebar)' },
        body: { overflowY: 'auto', height: 'calc(100vh - 60px)' },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Basic Information</Text>
          
          <TextInput
            label="Item Name"
            placeholder="e.g. Nasi Lemak"
            required
            radius="md"
            {...form.getInputProps('menuName')}
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={['Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Snacks', 'Others']}
            radius="md"
            {...form.getInputProps('category')}
          />

          <NumberInput
            label="Price (RM)"
            placeholder="0.00"
            decimalScale={2}
            fixedDecimalScale
            min={0}
            required
            radius="md"
            {...form.getInputProps('menuPrice')}
          />

          <Textarea
            label="Description"
            placeholder="What makes this dish special?"
            minRows={3}
            radius="md"
            {...form.getInputProps('itemDescription')}
          />

          <Divider my="sm" />

          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status & Visuals</Text>
          
          <TextInput
            label="Image URL"
            placeholder="https://..."
            radius="md"
            {...form.getInputProps('menuPic')}
          />

          <Group justify="space-between" mt="sm">
            <Box>
              <Text fw={500} size="sm">Available for Order</Text>
              <Text size="xs" c="dimmed">Show this item in the menu for customers</Text>
            </Box>
            <Switch
              checked={form.values.isAvailable}
              onChange={(e) => form.setFieldValue('isAvailable', e.currentTarget.checked)}
              color="olive"
              size="lg"
            />
          </Group>

          <Button type="submit" fullWidth mt="xl" color="olive" radius="md" size="md">
            Save Changes
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EditMenu;
