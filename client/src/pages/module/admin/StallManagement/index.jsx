import React, { useState, useRef } from 'react';
import { Box } from '@mantine/core';
import AdminLayout from '../../../../container/AdminLayout';
import StallsAnalytics from '../../../../components/admin/StallManagement/StallsAnalytics';
import StallsTable from '../../../../components/admin/StallManagement/StallsTable';
import EditStalls from '../../../../components/admin/StallManagement/EditStalls';
import { useStallsAnalytics } from '../../../../hooks/admin/StallManagement/useStallsAnalytics';

const StallManagement = () => {
  const [selectedStall, setSelectedStall] = useState(null);
  const tableRef = useRef(null);
  
  // High-level analytics refresh
  const { refresh: refreshAnalytics } = useStallsAnalytics();

  const handleRefresh = () => {
    tableRef.current?.refresh();
    refreshAnalytics();
  };

  const handleEdit = (stall) => {
    setSelectedStall(stall);
  };

  const handleClearEdit = () => {
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
          onClear={handleClearEdit} 
          onSuccess={handleRefresh} 
        />
      </Box>
    </AdminLayout>
  );
};

export default StallManagement;
