import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Paper, Table, Text, Badge, Group, ActionIcon, Avatar, Box,
  Title, Pagination, Loader, Center, Tooltip, TextInput, Select, Menu, Button,
} from '@mantine/core';
import {
  IconPencil, IconTrash, IconCircleCheck, IconBan, IconSearch,
  IconChevronDown, IconFileTypeCsv, IconFileTypePdf,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import useTableUsers from '../../../hooks/admin/UserManagement/useTableUsers';
import AddUsers from './AddUsers';

/**
 * UC010 — Users Table
 * - Inline Add User button in header
 * - Page-size selector: 5, 10, 20, 50, 100
 * - Export: CSV or PDF
 * - Columns: userName, userEmail, userRole, isActive
 */
const UsersTable = forwardRef(({ onEdit, onCreated }, ref) => {
  const { users, loading, fetchUsers, handleToggleActive, handleDelete } = useTableUsers();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useImperativeHandle(ref, () => ({ refresh: fetchUsers }));

  // --- Filtering ---
  const filtered = users.filter(
    (u) =>
      u.userName?.toLowerCase().includes(search.toLowerCase()) ||
      u.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  // --- Export Helpers ---
  const exportCSV = () => {
    const headers = ['userID', 'userName', 'userEmail', 'userPhone', 'userRole', 'isActive', 'preferenceID', 'createdAt'];
    const rows = filtered.map((u) => [
      u.userID, u.userName, u.userEmail, u.userPhone || '',
      u.userRole, u.isActive, u.preferenceID || '', u.createdAt || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notifications.show({ title: 'Export', message: 'CSV downloaded successfully.', color: 'green' });
  };

  const exportPDF = () => {
    const win = window.open('', '_blank');
    const rows = filtered
      .map(
        (u) =>
          `<tr>
            <td>${u.userName || ''}</td>
            <td>${u.userEmail || ''}</td>
            <td>${u.userPhone || '-'}</td>
            <td>${u.userRole || ''}</td>
            <td>${u.isActive ? 'Active' : 'Suspended'}</td>
          </tr>`
      )
      .join('');
    win.document.write(`
      <html><head><title>Users Export</title>
      <style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px 12px;text-align:left}th{background:#4D6459;color:#fff}</style>
      </head><body>
      <h2>System Users — MakanMate Admin</h2>
      <p>Exported: ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody></table>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Paper p="xl">
      {/* ── Table Toolbar ── */}
      <Group justify="space-between" mb="xl" wrap="nowrap" align="center">
        {/* Left: title + badge */}
        <Group gap="sm" align="center" wrap="nowrap">
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800, color: 'var(--mm-admin-sidebar)', whiteSpace: 'nowrap' }}>
            System Users
          </Title>
          <Badge variant="outline" color="olive" size="sm" radius="sm">
            Internal Directory
          </Badge>
        </Group>

        {/* Right: search + page size + export + add */}
        <Group gap="sm" wrap="nowrap">
          <TextInput
            placeholder="Search name or email..."
            leftSection={<IconSearch size={15} />}
            radius="xl"
            size="sm"
            value={search}
            onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
            style={{ width: 220 }}
          />

          {/* Page size */}
          <Select
            size="sm"
            radius="xl"
            value={String(pageSize)}
            onChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            data={['5', '10', '20', '50', '100']}
            style={{ width: 80 }}
            styles={{ input: { textAlign: 'center', fontWeight: 600 } }}
          />

          {/* Export */}
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                radius="xl"
                rightSection={<IconChevronDown size={14} />}
              >
                Export
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconFileTypeCsv size={16} />} onClick={exportCSV}>
                Download CSV
              </Menu.Item>
              <Menu.Item leftSection={<IconFileTypePdf size={16} />} onClick={exportPDF}>
                Print / PDF
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Add User — inline, not floating */}
          <AddUsers onCreated={() => { fetchUsers(); onCreated?.(); }} />
        </Group>
      </Group>

      {/* ── Table Body ── */}
      {loading ? (
        <Center py={60}>
          <Loader color="olive" />
        </Center>
      ) : (
        <>
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>NAME</Table.Th>
                <Table.Th>EMAIL</Table.Th>
                <Table.Th>ROLE</Table.Th>
                <Table.Th>STATUS</Table.Th>
                <Table.Th>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginated.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">No users found.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginated.map((user) => (
                  <Table.Tr key={user.userID}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar
                          radius="xl"
                          size="md"
                          style={{ backgroundColor: 'var(--mm-admin-accent)', color: 'var(--mm-admin-sidebar)', fontWeight: 800 }}
                        >
                          {user.userName?.charAt(0)?.toUpperCase() || '?'}
                        </Avatar>
                        <Box>
                          <Text fw={700} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>
                            {user.userName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {user.createdAt
                              ? `Joined ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                              : ''}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{user.userEmail}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={user.userRole === 'admin' ? 'olive' : 'gray'}
                        radius="sm"
                        size="sm"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {user.userRole}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Box
                          style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: user.isActive
                              ? 'var(--mantine-color-green-6)'
                              : 'var(--mantine-color-red-6)',
                          }}
                        />
                        <Text size="sm" fw={600} style={{
                          color: user.isActive
                            ? 'var(--mantine-color-green-7)'
                            : 'var(--mantine-color-red-7)',
                        }}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Edit User" position="top">
                          <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(user)}>
                            <IconPencil size={17} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={user.isActive ? 'Suspend' : 'Activate'} position="top">
                          <ActionIcon
                            variant="subtle"
                            color={user.isActive ? 'orange' : 'green'}
                            onClick={() => handleToggleActive(user)}
                          >
                            {user.isActive ? <IconBan size={17} /> : <IconCircleCheck size={17} />}
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete User" position="top">
                          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(user)}>
                            <IconTrash size={17} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>

          <Group justify="space-between" mt="xl" align="center">
            <Text size="sm" c="dimmed">
              {filtered.length === 0
                ? 'No users to show'
                : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} users`}
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="olive"
              size="sm"
              radius="xl"
            />
          </Group>
        </>
      )}
    </Paper>
  );
});

UsersTable.displayName = 'UsersTable';
export default UsersTable;
