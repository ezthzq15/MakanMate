import React, { useState, useEffect } from 'react';
import { Box, Table, Button, Badge, Group, Text, Loader, Center, ActionIcon } from '@mantine/core';
import { IconCheck, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

const CheckInApproval = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/vouchers/checkins/pending');
      setCheckIns(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch pending check-ins',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
    
    // Poll every 10 seconds for new check-ins
    const intervalId = setInterval(fetchCheckIns, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleApprove = async (checkInId) => {
    try {
      await apiClient.post(`/vouchers/checkins/${checkInId}/approve`);
      notifications.show({
        title: 'Success',
        message: 'Check-in approved successfully.',
        color: 'green'
      });
      // Remove the approved check-in from the list
      setCheckIns(checkIns.filter(c => c.id !== checkInId));
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to approve check-in',
        color: 'red'
      });
    }
  };

  if (loading && checkIns.length === 0) {
    return <Center h={200}><Loader color="olive" /></Center>;
  }

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Pending Check-ins</Text>
        <ActionIcon variant="light" color="olive" onClick={fetchCheckIns}>
          <IconRefresh size={18} />
        </ActionIcon>
      </Group>

      {checkIns.length === 0 ? (
        <Center h={200} bg="var(--mantine-color-gray-0)" style={{ borderRadius: '8px', border: '1px dashed var(--mantine-color-gray-3)' }}>
          <Text c="dimmed">No pending check-ins at the moment.</Text>
        </Center>
      ) : (
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User ID</Table.Th>
              <Table.Th>Time Requested</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {checkIns.map((checkIn) => (
              <Table.Tr key={checkIn.id}>
                <Table.Td>
                  <Text fw={500}>{checkIn.userId}</Text>
                </Table.Td>
                <Table.Td>
                  {new Date(checkIn.createdAt?._seconds * 1000 || Date.now()).toLocaleTimeString()}
                </Table.Td>
                <Table.Td>
                  <Badge color="yellow" variant="light">Pending</Badge>
                </Table.Td>
                <Table.Td>
                  <Button 
                    size="xs" 
                    color="teal" 
                    leftSection={<IconCheck size={14} />}
                    onClick={() => handleApprove(checkIn.id)}
                  >
                    Approve
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Box>
  );
};

export default CheckInApproval;
