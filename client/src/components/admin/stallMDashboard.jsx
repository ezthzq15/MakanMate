import React, { useEffect, useState } from 'react';
import { Box, Title, Text, SimpleGrid, Paper, Group, ThemeIcon, Stack, Skeleton, Badge } from '@mantine/core';
import { IconBuildingStore, IconToolsKitchen2, IconClock } from '@tabler/icons-react';
import apiClient from '../../lib/apiClient';
import NotFoundPage from '../../pages/404';

const StallMDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyStall = async () => {
      try {
        const res = await apiClient.get('/stalls/my-stall');
        setData(res.data.stall);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stall info');
      } finally {
        setLoading(false);
      }
    };
    fetchMyStall();
  }, []);

  if (loading) return (
    <Stack p="xl">
      <Skeleton height={40} width="30%" radius="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="xl">
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
    </Stack>
  );

  if (error) return <NotFoundPage />;

  return (
    <Box p="xl">
      <Group justify="space-between" mb={40}>
        <Box>
          <Title order={1} style={{ fontSize: '32px', color: '#4D6459' }}>
            Welcome back, Manager
          </Title>
          <Text c="dimmed">Here is an overview of your assigned stall.</Text>
        </Box>
        <Badge size="xl" variant="light" color="olive" radius="md">
          {data?.stallName}
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Cuisine Type</Text>
              <Text size="xl" fw={700} mt={4}>{data?.cuisineType}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="blue" variant="light">
              <IconBuildingStore size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Menu Items</Text>
              <Text size="xl" fw={700} mt={4}>{data?.totalMenuItems}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="orange" variant="light">
              <IconToolsKitchen2 size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Operating Hours</Text>
              <Text size="xl" fw={700} mt={4}>{data?.operatingHours || 'Not Set'}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="teal" variant="light">
              <IconClock size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="xl" radius="md" mt="xl">
        <Title order={3} mb="md" style={{ color: '#4D6459' }}>Quick Actions</Title>
        <Text size="sm" c="dimmed" mb="xl">Use the sidebar to manage your menu or view detailed stall settings.</Text>
        <Group>
          <Badge size="lg" variant="dot" color="green">Active Status</Badge>
          <Badge size="lg" variant="dot" color="blue">Menu Verified</Badge>
        </Group>
      </Paper>
    </Box>
  );
};

export default StallMDashboard;
