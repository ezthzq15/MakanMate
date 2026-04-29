import React, { useState, useEffect } from 'react';
import { Box, Title, Text, Group, Select, Paper, Stack, LoadingOverlay } from '@mantine/core';
import { API_BASE } from '../../../lib/api';
import { getAuthHeaders, getAuthUser } from '../../../utils/auth';
import ListMenu from '../../../components/admin/MenuManagement/ListMenu';

const MenuManagementPage = () => {
  const user = getAuthUser();
  const [stalls, setStalls] = useState([]);
  const [selectedStallID, setSelectedStallID] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      const headers = getAuthHeaders();
      
      if (user.userRole === 'admin') {
        // Fetch all stalls for admin to choose from
        try {
          const res = await fetch(`${API_BASE}/admin/stalls`, { headers });
          const data = await res.json();
          if (res.ok) {
            setStalls(data.stalls.map(s => ({ value: s.stallID, label: s.stallName })));
          }
        } catch (err) {
          console.error('Fetch stalls error:', err);
        }
      } else {
        // Fetch specific stall for manager
        try {
          const res = await fetch(`${API_BASE}/stalls/my`, { headers });
          const data = await res.json();
          if (res.ok) {
            setSelectedStallID(data.stall.stallID);
            setStalls([{ value: data.stall.stallID, label: data.stall.stallName }]);
          }
        } catch (err) {
          console.error('Fetch my stall error:', err);
        }
      }
      setLoading(false);
    };

    initPage();
  }, [user.userRole]);

  return (
    <Box>
      <Stack gap="xl">
        <Group justify="space-between">
          <Box>
            <Title order={1} style={{ color: '#4D6459' }}>Menu Management</Title>
            <Text c="dimmed">Manage food items and pricing for your stall.</Text>
          </Box>
        </Group>

        <Paper withBorder p="xl" radius="md" style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} />
          <Stack gap="md">
            <Select
              label="Active Stall"
              placeholder={user.userRole === 'admin' ? "Select a stall to manage" : "Your assigned stall"}
              data={stalls}
              value={selectedStallID}
              onChange={setSelectedStallID}
              readOnly={user.userRole !== 'admin'}
              disabled={loading}
              style={{ maxWidth: 400 }}
            />

            {selectedStallID ? (
              <ListMenu stallID={selectedStallID} />
            ) : (
              !loading && <Text c="dimmed" ta="center" py={50}>Please select a stall to manage its menu.</Text>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default MenuManagementPage;
