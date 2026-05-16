import React, { useState, useEffect } from 'react';
import { Box, Table, Group, Button, Badge, Text, ActionIcon, Loader, Center } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';
import AddVoucer from './AddVoucer';
import EditVoucher from './EditVoucher';

const ListVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/vouchers/manager');
      setVouchers(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch vouchers',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleEditClick = (voucher) => {
    setSelectedVoucher(voucher);
    setEditModalOpen(true);
  };

  if (loading) {
    return <Center h={200}><Loader color="olive" /></Center>;
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text fw={600} size="lg">All Vouchers</Text>
        <Button 
          leftSection={<IconPlus size={16} />} 
          color="olive" 
          onClick={() => setAddModalOpen(true)}
        >
          Add Voucher
        </Button>
      </Group>

      {vouchers.length === 0 ? (
        <Center h={200} bg="var(--mantine-color-gray-0)" style={{ borderRadius: '8px', border: '1px dashed var(--mantine-color-gray-3)' }}>
          <Text c="dimmed">No vouchers found. Create one to get started.</Text>
        </Center>
      ) : (
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Discount</Table.Th>
              <Table.Th>Min Spend</Table.Th>
              <Table.Th>Valid Until</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Redeemed</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {vouchers.map((voucher) => {
              const formatDiscount = (v) => {
                if (v.discountType === 'Percentage') return `${v.discountValue}%`;
                if (v.discountType === 'Fixed Amount') return `RM ${v.discountValue}`;
                return v.discount || '-';
              };
              
              return (
              <Table.Tr key={voucher.id}>
                <Table.Td fw={500}>{voucher.title}</Table.Td>
                <Table.Td fw={600} c="brand.7">{formatDiscount(voucher)}</Table.Td>
                <Table.Td>{voucher.minSpend ? `RM ${voucher.minSpend}` : '-'}</Table.Td>
                <Table.Td>{new Date(voucher.validUntil).toLocaleDateString()}</Table.Td>
                <Table.Td>{voucher.quantity}</Table.Td>
                <Table.Td>{voucher.redeemedCount || 0}</Table.Td>
                <Table.Td>
                  <Badge color={voucher.isActive ? 'green' : 'gray'}>
                    {voucher.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(voucher)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="light" color="red">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
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
    </Box>
  );
};

export default ListVoucher;
