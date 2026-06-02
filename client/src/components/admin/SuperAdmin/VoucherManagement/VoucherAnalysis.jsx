import React, { useState, useEffect } from 'react';
import { SimpleGrid, Paper, Group, Box, Text, ThemeIcon, Loader, Center } from '@mantine/core';
import { IconTicket, IconCheck, IconUsers } from '@tabler/icons-react';
import apiClient from '../../../../lib/apiClient';

const VoucherAnalysis = () => {
  const [stats, setStats] = useState({ totalVouchers: 0, totalRedeemed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/vouchers');
        const vouchers = response.data;
        const totalVouchers = vouchers.length;
        const totalRedeemed = vouchers.reduce((acc, v) => acc + (v.redeemedCount || 0), 0);
        setStats({ totalVouchers, totalRedeemed });
      } catch (error) {
        console.error('Failed to fetch voucher stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Center h={200}><Loader color="olive" /></Center>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
      <Paper withBorder p="xl" radius="md">
        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Vouchers</Text>
            <Text size="xl" fw={700} mt={4}>{stats.totalVouchers}</Text>
          </Box>
          <ThemeIcon size="xl" radius="md" color="blue" variant="light">
            <IconTicket size={24} />
          </ThemeIcon>
        </Group>
      </Paper>

      <Paper withBorder p="xl" radius="md">
        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Redeemed</Text>
            <Text size="xl" fw={700} mt={4}>{stats.totalRedeemed}</Text>
          </Box>
          <ThemeIcon size="xl" radius="md" color="green" variant="light">
            <IconCheck size={24} />
          </ThemeIcon>
        </Group>
      </Paper>
      
      <Paper withBorder p="xl" radius="md">
        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Redemption Rate</Text>
            <Text size="xl" fw={700} mt={4}>
              {stats.totalVouchers > 0 ? Math.round((stats.totalRedeemed / (stats.totalVouchers * 100)) * 100) : 0}%
            </Text>
          </Box>
          <ThemeIcon size="xl" radius="md" color="orange" variant="light">
            <IconUsers size={24} />
          </ThemeIcon>
        </Group>
      </Paper>
    </SimpleGrid>
  );
};

export default VoucherAnalysis;
