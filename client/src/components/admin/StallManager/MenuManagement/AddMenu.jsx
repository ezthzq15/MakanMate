import React from 'react';
import { 
  Drawer, Button, TextInput, NumberInput, Switch, 
  Textarea, Stack, Divider, Text, Group, Select, ThemeIcon, Box, Autocomplete
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconToolsKitchen2 } from '@tabler/icons-react';
import { useMenu } from '../../../../hooks/admin/StallManager/MenuManagement/useMenu';

const AddMenu = ({ stallID, onSuccess }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { addMenuItem, categories } = useMenu(stallID);

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

  const handleSubmit = async (values) => {
    const success = await addMenuItem(values);
    if (success) {
      form.reset();
      close();
      onSuccess?.();
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
        title={
          <Group gap="sm">
            <ThemeIcon variant="light" color="olive" radius="md">
              <IconToolsKitchen2 size={18} />
            </ThemeIcon>
            <Text fw={800} size="lg">Add New Menu Item</Text>
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

            <Autocomplete
              label="Category"
              placeholder="Select or type new category"
              data={categories.length > 0 ? categories : ['Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Snacks']}
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
              Add to Menu
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
};

export default AddMenu;
