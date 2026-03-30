import {
  Drawer, Button, TextInput, Select, Stack,
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
        body: { overflowY: 'auto', height: 'calc(100vh - 60px)' },
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
            <Select
              label="Account Status"
              withAsterisk
              data={[
                { value: '0', label: '🟢 Active' },
                { value: '1', label: '🟡 Not Active' },
                { value: '2', label: '🔴 Suspended' },
              ]}
              value={String(form.values.accountStatus)}
              onChange={(val) => form.setFieldValue('accountStatus', Number(val))}
            />

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
