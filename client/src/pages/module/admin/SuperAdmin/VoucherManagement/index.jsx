import React, { useState } from 'react';
import { Box, Title, Tabs, Text, Group } from '@mantine/core';
import { IconChartBar, IconTicket } from '@tabler/icons-react';
import AdminLayout from '../../../../../container/AdminLayout';
import VoucherAnalysis from '../../../../../components/admin/SuperAdmin/VoucherManagement/VoucherAnalysis';
import ListVoucher from '../../../../../components/admin/SuperAdmin/VoucherManagement/ListVoucher';

const VoucherManagement = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <AdminLayout>
      <Box p="md">
        <Group justify="space-between" mb={40}>
          <Box>
            <Title order={1} style={{ fontSize: '32px', color: '#4D6459' }}>
              Voucher Management (Admin)
            </Title>
            <Text c="dimmed">Manage all food stall vouchers and generate random promo codes across MakanMate.</Text>
          </Box>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab} color="olive" variant="pills" radius="md">
          <Tabs.List mb="xl">
            <Tabs.Tab value="list" leftSection={<IconTicket size={16} />}>
              Voucher List
            </Tabs.Tab>
            <Tabs.Tab value="analysis" leftSection={<IconChartBar size={16} />}>
              Analysis
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="list">
            <ListVoucher />
          </Tabs.Panel>

          <Tabs.Panel value="analysis">
            <VoucherAnalysis />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </AdminLayout>
  );
};

export default VoucherManagement;
