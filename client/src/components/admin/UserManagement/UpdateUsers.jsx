import {
  Drawer, Button, TextInput, Select, Switch, Stack,
  Group, Text, Divider, Badge,
} from '@mantine/core';
import useUpdateUsers from '../../../hooks/admin/UserManagement/useUpdateUsers';

/**
 * UC010 — Update User Drawer (opens from the RIGHT)
 * Read-only: userID, userEmail
 * Editable: userName, userPhone, userRole, isActive, preferenceID
 * NOT editable: userPassword
 */
const UpdateUsers = ({ selectedUser, opened, onClose, onUpdated }) => {
  const { form, handleSubmit } = useUpdateUsers({ selectedUser, onUpdated, onClose });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Update User"
      position="right"
      size="md"
      padding="xl"
      styles={{
        title: { fontWeight: 800, fontSize: '18px', color: 'var(--mm-admin-sidebar)' },
      }}
    >
      {selectedUser ? (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Read-only: userID + userEmail */}
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Account Info (Read Only)</Text>
            <TextInput
              label="User ID"
              value={selectedUser.userID || ''}
              disabled
              rightSection={<Badge size="xs" color="gray" variant="light">ID</Badge>}
              styles={{ input: { cursor: 'not-allowed', opacity: 0.55, fontSize: '12px' } }}
            />
            <TextInput
              label="Email"
              value={selectedUser.userEmail || ''}
              disabled
              styles={{ input: { cursor: 'not-allowed', opacity: 0.6 } }}
            />

            <Divider />

            {/* Editable fields */}
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Editable Fields</Text>
            <TextInput
              label="User Name"
              placeholder="Enter full name"
              withAsterisk
              {...form.getInputProps('userName')}
            />
            <TextInput
              label="Phone Number"
              placeholder="+60123456789"
              {...form.getInputProps('userPhone')}
            />

            <Divider />

            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Role & Status</Text>
            <Select
              label="Role"
              withAsterisk
              data={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              {...form.getInputProps('userRole')}
            />
            <Group justify="space-between" align="center">
              <Text size="sm" fw={600}>Account Status</Text>
              <Switch
                checked={form.values.isActive}
                onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
                label={form.values.isActive ? 'Active' : 'Suspended'}
                color="olive"
              />
            </Group>

            <Divider />

            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Optional</Text>
            <TextInput
              label="Preference ID"
              placeholder="Assigned preference ID"
              {...form.getInputProps('preferenceID')}
            />

            <Button type="submit" fullWidth mt="sm" color="olive" radius="xl">
              Save Changes
            </Button>
          </Stack>
        </form>
      ) : (
        <Text c="dimmed">No user selected.</Text>
      )}
    </Drawer>
  );
};

export default UpdateUsers;
