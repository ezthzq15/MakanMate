import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Paper, Table, Text, Badge, Group, ActionIcon, Avatar, Box,
  Title, Pagination, Loader, Center, Tooltip, TextInput, Select, Menu, Button,
} from '@mantine/core';
import {
  IconPencil, IconTrash, IconSearch, IconChevronDown, 
  IconFileTypeCsv, IconFileTypePdf, IconFilter, IconClock
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useTableStalls } from '../../../hooks/admin/StallManagement/useTableStalls';
import AddStalls from './AddStalls';

/**
 * UC009 — Stalls Table (Visual Refinement)
 * - Integrated Toolbar
 * - Pagination: 5, 10, 20, 50, 100
 * - Export: CSV
 * - Real Filter Logic
 */
const StallsTable = forwardRef(({ onEdit, onCreated }, ref) => {
  const { stalls, loading, refresh: fetchStalls, handleDelete } = useTableStalls();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [halalFilter, setHalalFilter] = useState('all');

  useImperativeHandle(ref, () => ({ refresh: fetchStalls }));

  // --- Filtering ---
  const filtered = stalls.filter((s) => {
    const matchesSearch = s.stallName.toLowerCase().includes(search.toLowerCase()) || 
                         s.cuisineType.toLowerCase().includes(search.toLowerCase());
    const matchesHalal = halalFilter === 'all' || 
                        (halalFilter === 'halal' && s.isHalal === true) || 
                        (halalFilter === 'non-halal' && s.isHalal === false);
    return matchesSearch && matchesHalal;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  // --- Export Helper ---
  const exportCSV = () => {
    const headers = ['stallID', 'stallName', 'cuisineType', 'isHalal', 'latitude', 'longitude', 'operatingHours'];
    const rows = filtered.map((s) => [
      s.stallID, s.stallName, s.cuisineType, s.isHalal, 
      s.latitude, s.longitude, s.operatingHours || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stalls_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notifications.show({ title: 'Export', message: 'CSV downloaded successfully.', color: 'green' });
  };

  return (
    <Paper p="xl" radius="lg" withBorder shadow="sm" mt="xl">
      {/* ── Table Toolbar ── */}
      <Group justify="space-between" mb="xl" wrap="nowrap" align="center">
        <Group gap="sm" align="center" wrap="nowrap">
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800, color: 'var(--mm-admin-sidebar)', whiteSpace: 'nowrap' }}>
            System Stalls
          </Title>
          <Badge variant="outline" color="green" size="sm" radius="sm">
            Admin Directory
          </Badge>
        </Group>

        <Group gap="sm" wrap="nowrap">
          <TextInput
            placeholder="Search stalls..."
            leftSection={<IconSearch size={15} />}
            radius="xl"
            size="sm"
            value={search}
            onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
            style={{ width: 220 }}
          />

          <Select
            size="sm"
            radius="xl"
            value={String(pageSize)}
            onChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            data={['5', '10', '20', '50', '100']}
            style={{ width: 80 }}
            styles={{ input: { textAlign: 'center', fontWeight: 600 } }}
          />

          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                radius="xl"
                rightSection={<IconChevronDown size={14} />}
              >
                Filter
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Halal Status</Menu.Label>
              <Menu.Item onClick={() => setHalalFilter('all')}>All Stalls</Menu.Item>
              <Menu.Item onClick={() => setHalalFilter('halal')}>Halal Only</Menu.Item>
              <Menu.Item onClick={() => setHalalFilter('non-halal')}>Non-Halal Only</Menu.Item>
            </Menu.Dropdown>
          </Menu>

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
            </Menu.Dropdown>
          </Menu>

          <AddStalls onSuccess={() => { fetchStalls(); onCreated?.(); }} />
        </Group>
      </Group>

      {/* ── Table Body ── */}
      {loading ? (
        <Center py={60}>
          <Loader color="green" />
        </Center>
      ) : (
        <>
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>STALL NAME</Table.Th>
                <Table.Th>CUISINE</Table.Th>
                <Table.Th>STATUS</Table.Th>
                <Table.Th>OPERATING</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginated.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">No stalls found matching criteria.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginated.map((stall) => (
                  <Table.Tr key={stall.stallID}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar
                          radius="xl"
                          size="md"
                          src={stall.imageURL}
                          style={{ backgroundColor: 'var(--mm-admin-accent)', color: 'var(--mm-admin-sidebar)', fontWeight: 800 }}
                        >
                          {stall.stallName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Text fw={700} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>{stall.stallName}</Text>
                          <Text size="xs" c="dimmed">ID: {stall.stallID.slice(0, 8)}</Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" radius="sm" size="sm">
                        {stall.cuisineType}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Box
                          style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: stall.isHalal ? '#40c057' : '#fa5252',
                          }}
                        />
                        <Text size="sm" fw={600} style={{ color: stall.isHalal ? '#2f9e44' : '#e03131' }}>
                          {stall.isHalal ? 'Halal' : 'Non-Halal'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconClock size={14} color="gray" />
                        <Text size="sm">{stall.operatingHours || 'N/A'}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap" justify="flex-end">
                        <Tooltip label="Edit Stall">
                          <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(stall)}>
                            <IconPencil size={17} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Stall">
                          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(stall.stallID, stall.stallName)}>
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
                ? 'No items'
                : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} stalls`}
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="green"
              size="sm"
              radius="xl"
            />
          </Group>
        </>
      )}
    </Paper>
  );
});

StallsTable.displayName = 'StallsTable';
export default StallsTable;
