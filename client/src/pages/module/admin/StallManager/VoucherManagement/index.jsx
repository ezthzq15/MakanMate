import React, { useState } from 'react';
import { Box, Title, Tabs, Text, Group, Badge } from '@mantine/core';
import { IconChartBar, IconTicket, IconChecklist, IconQrcode } from '@tabler/icons-react';
import VoucherAnalysis from '../../../../../components/admin/StallManager/VoucherManagement/VoucherAnalysis';
import ListVoucher from '../../../../../components/admin/StallManager/VoucherManagement/ListVoucher';
import CheckInApproval from '../../../../../components/admin/StallManager/VoucherManagement/CheckInApproval';
import RedeemVoucher from '../../../../../components/admin/StallManager/VoucherManagement/RedeemVoucher';

const VoucherManagement = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <Box p="xl">
      <Group justify="space-between" mb={40}>
        <Box>
          <Title order={1} style={{ fontSize: '32px', color: '#4D6459' }}>
            Voucher Management
          </Title>
          <Text c="dimmed">Manage your stall's vouchers and approve redemptions.</Text>
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
          <Tabs.Tab value="checkins" leftSection={<IconChecklist size={16} />}>
            Live Check-ins
          </Tabs.Tab>
          <Tabs.Tab value="redeem" leftSection={<IconQrcode size={16} />}>
            Redeem Voucher
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list">
          <ListVoucher />
        </Tabs.Panel>

        <Tabs.Panel value="analysis">
          <VoucherAnalysis />
        </Tabs.Panel>

        <Tabs.Panel value="checkins">
          <CheckInApproval />
        </Tabs.Panel>

        <Tabs.Panel value="redeem">
          <RedeemVoucher />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default VoucherManagement;
