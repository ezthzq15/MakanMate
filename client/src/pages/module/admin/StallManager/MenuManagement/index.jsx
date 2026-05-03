import React, { useState, useEffect } from 'react';
import { Box, Title, Text, Stack, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import StallManagerLayout from '../../../../../container/StallManagerLayout';
import ListMenu from '../../../../../components/admin/StallManager/MenuManagement/ListMenu';
import EditMenu from '../../../../../components/admin/StallManager/MenuManagement/EditMenu';
import apiClient from '../../../../../lib/apiClient';
import UnassignedStall from '../../../../../pages/UnassignedStall';

const MenuManagementPage = () => {
  const [stallID, setStallID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Controlled Edit Drawer state
  const [selectedItem, setSelectedItem] = useState(null);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const fetchMyStall = async () => {
    try {
      const res = await apiClient.get('/stalls/my-stall');
      setStallID(res.data.stall.stallID);
    } catch (err) {
      console.error('Fetch stall error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStall();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    openEdit();
  };

  const handleCloseEdit = () => {
    closeEdit();
    setSelectedItem(null);
  };

  const handleRefresh = () => {
    // In a real app with proper state management, this might trigger a re-fetch in the hook.
    // For now, we rely on the hook's internal refresh or re-mounting.
    fetchMyStall(); 
  };

  if (loading) return <LoadingOverlay visible />;
  if (error) return <UnassignedStall />;

  return (
    <StallManagerLayout>
      <Box p="md">
        <Stack gap="xl">
          <Box>
            <Title order={1} style={{ color: 'var(--mm-admin-sidebar)', fontWeight: 900 }}>
              Menu Management
            </Title>
            <Text c="dimmed">Add, edit, or remove items from your stall's menu</Text>
          </Box>

          {stallID && (
            <ListMenu 
              stallID={stallID} 
              onEdit={handleEdit} 
              onRefresh={handleRefresh}
            />
          )}
        </Stack>

        {/* Controlled Edit Drawer */}
        <EditMenu 
          item={selectedItem}
          stallID={stallID}
          opened={editOpened}
          onClose={handleCloseEdit}
          onSuccess={handleRefresh}
        />
      </Box>
    </StallManagerLayout>
  );
};

export default MenuManagementPage;
