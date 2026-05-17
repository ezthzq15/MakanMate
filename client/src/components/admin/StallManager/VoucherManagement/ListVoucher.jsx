import React, { useState, useEffect } from 'react';
import { 
  Table, Group, Text, ActionIcon, Badge, Stack, Box, 
  Center, Button, Paper, Title, TextInput, Select, Pagination,
  Tooltip, Loader, Menu, ThemeIcon, Modal
} from '@mantine/core';
import { 
  IconPencil, IconTrash, IconPlus, IconSearch, IconChevronDown,
  IconFileTypeCsv, IconTicket, IconAlertCircle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';
import AddVoucer from './AddVoucer';
import EditVoucher from './EditVoucher';

const ListVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  // Pagination & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/vouchers/manager');
      setVouchers(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch vouchers', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDeleteClick = (voucher) => {
    setVoucherToDelete(voucher);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!voucherToDelete) return;
    try {
      await apiClient.delete(`/vouchers/${voucherToDelete.id}`);
      notifications.show({ title: 'Success', message: 'Voucher deleted successfully', color: 'green' });
      fetchVouchers(); 
      setDeleteModalOpen(false);
      setVoucherToDelete(null);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to delete voucher', color: 'red' });
    }
  };

  const handleEditClick = (voucher) => {
    setSelectedVoucher(voucher);
    setEditModalOpen(true);
  };

  // --- Filtering ---
  const filtered = vouchers.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'All') return matchesSearch;
    const isActive = statusFilter === 'Active';
    return matchesSearch && v.isActive === isActive;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  const exportCSV = () => {
    const headers = ['Title', 'Discount', 'Min Spend', 'Valid Until', 'Quantity', 'Redeemed', 'Status'];
    const rows = filtered.map((v) => {
      const discount = v.discountType === 'Percentage' ? `${v.discountValue}%` : (v.discountType === 'Fixed Amount' ? `RM ${v.discountValue}` : v.discount);
      return [
        v.title, discount, v.minSpend ? `RM ${v.minSpend}` : '-',
        new Date(v.validUntil).toLocaleDateString(), v.quantity,
        v.redeemedCount || 0, v.isActive ? 'Active' : 'Inactive'
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper p="xl" withBorder radius="md">
      {/* ── Table Toolbar ── */}
      <Group justify="space-between" mb="xl" wrap="wrap" align="center">
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="olive" size="lg" radius="md">
            <IconTicket size={20} />
          </ThemeIcon>
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800, color: 'var(--mm-admin-sidebar)', whiteSpace: 'nowrap' }}>
            Vouchers
          </Title>
          <Badge variant="outline" color="olive" size="sm" radius="sm">
            {vouchers.length} Total
          </Badge>
        </Group>

        <Group gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search vouchers..."
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
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val || 'All'); setPage(1); }}
            data={['All', 'Active', 'Inactive']}
            style={{ width: 120 }}
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

          <Button 
            leftSection={<IconPlus size={16} />} 
            color="olive" 
            size="sm"
            radius="xl"
            onClick={() => setAddModalOpen(true)}
          >
            Add Voucher
          </Button>
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
                <Table.Th>TITLE</Table.Th>
                <Table.Th>DISCOUNT</Table.Th>
                <Table.Th>MIN SPEND</Table.Th>
                <Table.Th>VALID UNTIL</Table.Th>
                <Table.Th>QTY / REDEEMED</Table.Th>
                <Table.Th>STATUS</Table.Th>
                <Table.Th>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginated.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center py={50}>
                      <Stack align="center" gap="xs">
                        <IconTicket size={40} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed">No vouchers found.</Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginated.map((voucher) => {
                  const formatDiscount = (v) => {
                    if (v.discountType === 'Percentage') return `${v.discountValue}%`;
                    if (v.discountType === 'Fixed Amount') return `RM ${v.discountValue}`;
                    return v.discount || '-';
                  };
                  
                  return (
                  <Table.Tr key={voucher.id}>
                    <Table.Td fw={700} style={{ color: 'var(--mm-admin-text-main)' }}>{voucher.title}</Table.Td>
                    <Table.Td>
                      <Text fw={800} size="sm" color="olive">{formatDiscount(voucher)}</Text>
                    </Table.Td>
                    <Table.Td>{voucher.minSpend ? `RM ${voucher.minSpend}` : '-'}</Table.Td>
                    <Table.Td>{new Date(voucher.validUntil).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <Text size="sm"><b>{voucher.quantity}</b> / {voucher.redeemedCount || 0}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Box
                          style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: voucher.isActive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)',
                          }}
                        />
                        <Text size="sm" fw={600} color={voucher.isActive ? 'green.7' : 'gray.6'}>
                          {voucher.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Tooltip label="Edit Voucher" position="top" withArrow>
                          <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(voucher)}>
                            <IconPencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Voucher" position="top" withArrow>
                          <ActionIcon variant="light" color="red" onClick={() => handleDeleteClick(voucher)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )})
              )}
            </Table.Tbody>
          </Table>

          {/* ── Delete Confirmation Modal ── */}
          <Modal 
            opened={deleteModalOpen} 
            onClose={() => setDeleteModalOpen(false)} 
            title="Delete Voucher" 
            centered
          >
            <Stack gap="md">
              <Text>Are you sure you want to delete "{voucherToDelete?.title}"? This action cannot be undone.</Text>
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                <Button color="red" onClick={confirmDelete}>Delete</Button>
              </Group>
            </Stack>
          </Modal>

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

      {/* Add Modal */}
      <AddVoucer 
        opened={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={fetchVouchers} 
      />

      {/* Edit Modal */}
      <EditVoucher 
        opened={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        voucher={selectedVoucher}
        onSuccess={fetchVouchers} 
      />
    </Paper>
  );
};

export default ListVoucher;
