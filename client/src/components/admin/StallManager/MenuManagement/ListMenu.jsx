import React, { useState } from 'react';
import { 
  Table, Group, Text, ActionIcon, Badge, Image, Stack, Box, 
  Center, Button, Paper, Title, TextInput, Select, Pagination,
  Tooltip, Loader, Menu, ThemeIcon
} from '@mantine/core';
import { 
  IconPencil, IconTrash, IconPlus, IconSearch, IconChevronDown,
  IconFileTypeCsv, IconFileTypePdf, IconToolsKitchen2, IconAlertCircle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useMenu } from '../../../../hooks/admin/StallManager/MenuManagement/useMenu';
import AddMenu from './AddMenu';

/**
 * UC011 — Stall Menu Table
 * Follows the SuperAdmin User Management UI pattern.
 */
const ListMenu = ({ stallID, onEdit, onRefresh }) => {
  const { menuItems, loading, deleteMenuItem } = useMenu(stallID);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Filtering ---
  const filtered = menuItems.filter(
    (item) =>
      item.menuName?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.menuName}"?`)) {
      await deleteMenuItem(item.menuID);
      onRefresh?.();
    }
  };

  const exportCSV = () => {
    const headers = ['menuName', 'menuPrice', 'category', 'isAvailable', 'itemDescription'];
    const rows = filtered.map((item) => [
      item.menuName, item.menuPrice, item.category || 'Others',
      item.isAvailable ? 'Yes' : 'No', item.itemDescription || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper p="xl" withBorder radius="md">
      {/* ── Table Toolbar ── */}
      <Group justify="space-between" mb="xl" wrap="nowrap" align="center">
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="olive" size="lg" radius="md">
            <IconToolsKitchen2 size={20} />
          </ThemeIcon>
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800, color: 'var(--mm-admin-sidebar)', whiteSpace: 'nowrap' }}>
            Menu Items
          </Title>
          <Badge variant="outline" color="olive" size="sm" radius="sm">
            {menuItems.length} Total
          </Badge>
        </Group>

        <Group gap="sm" wrap="nowrap">
          <TextInput
            placeholder="Search items..."
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
            data={['5', '10', '20', '50']}
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
                Export
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconFileTypeCsv size={16} />} onClick={exportCSV}>
                Download CSV
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <AddMenu stallID={stallID} onSuccess={onRefresh} />
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
                <Table.Th>ITEM</Table.Th>
                <Table.Th>CATEGORY</Table.Th>
                <Table.Th>PRICE</Table.Th>
                <Table.Th>STATUS</Table.Th>
                <Table.Th>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginated.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Center py={50}>
                      <Stack align="center" gap="xs">
                        <IconToolsKitchen2 size={40} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed">No menu items found.</Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginated.map((item) => (
                  <Table.Tr key={item.menuID}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Image
                          radius="md"
                          src={item.menuPic}
                          w={45}
                          h={45}
                          fallbackSrc="https://placehold.co/100x100?text=Food"
                        />
                        <Box>
                          <Text fw={700} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>
                            {item.menuName}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {item.itemDescription || 'No description'}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" radius="sm">
                        {item.category || 'Others'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={800} size="sm" color="olive">
                        RM {Number(item.menuPrice).toFixed(2)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Box
                          style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: item.isAvailable ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
                          }}
                        />
                        <Text size="sm" fw={600} color={item.isAvailable ? 'green.7' : 'red.7'}>
                          {item.isAvailable ? 'Available' : 'Sold Out'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Edit Item" position="top">
                          <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(item)}>
                            <IconPencil size={17} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Item" position="top">
                          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item)}>
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
                ? 'No items to show'
                : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} items`}
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
};

export default ListMenu;
