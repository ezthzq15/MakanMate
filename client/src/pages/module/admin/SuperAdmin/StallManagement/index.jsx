import React, { useState, useRef } from 'react';
import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdminLayout from '../../../../../container/AdminLayout';
import StallsAnalytics from '../../../../../components/admin/SuperAdmin/StallManagement/StallsAnalytics';
import StallsTable from '../../../../../components/admin/SuperAdmin/StallManagement/StallsTable';
import EditStalls from '../../../../../components/admin/SuperAdmin/StallManagement/EditStalls';
import { useStallsAnalytics } from '../../../../../hooks/admin/SuperAdmin/StallManagement/useStallsAnalytics';

const StallManagement = () => {
  const [selectedStall, setSelectedStall] = useState(null);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const tableRef = useRef(null);
  
  // High-level analytics refresh
  const { refresh: refreshAnalytics } = useStallsAnalytics();

  const handleRefresh = () => {
    tableRef.current?.refresh();
    refreshAnalytics();
  };

  const handleEdit = (stall) => {
    setSelectedStall(stall);
    openEdit();
  };

  const handleCloseEdit = () => {
    closeEdit();
    setSelectedStall(null);
  };

  return (
    <AdminLayout>
      <Box p="md">
        {/* Analytics Section (KPI Cards) */}
        <StallsAnalytics />

        {/* Table Section (Integrated Header + Search + Filter + Pagination) */}
        <StallsTable 
          ref={tableRef}
          onEdit={handleEdit} 
          onCreated={handleRefresh} 
        />

        {/* Edit Drawer */}
        <EditStalls 
          stall={selectedStall} 
          opened={editOpened}
          onClose={handleCloseEdit} 
          onSuccess={handleRefresh} 
        />
      </Box>
    </AdminLayout>
  );
};

export default StallManagement;
