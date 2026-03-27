import React from 'react';
import { Title, Text, SimpleGrid, Paper, Group, Box } from '@mantine/core';
import AdminLayout from '../../../container/AdminLayout';

const StallManagement = () => {
  return (
    <AdminLayout>
      <Box mb="xl">
        <Title order={2} mb="xs">Stall Management</Title>
        <Text color="dimmed">Manage all food stalls across MakanMate locations.</Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        {/* Placeholder for stall list */}
        <Paper p="xl" radius="md" withBorder>
          <Text fw={700}>Chicken Rice Delight</Text>
          <Text size="sm" color="dimmed">Northpoint City</Text>
        </Paper>
        <Paper p="xl" radius="md" withBorder>
          <Text fw={700}>Laksa Lovers</Text>
          <Text size="sm" color="dimmed">Tampines Hub</Text>
        </Paper>
      </SimpleGrid>
    </AdminLayout>
  );
};

export default StallManagement;
