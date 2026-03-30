import { useState, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box } from '@mantine/core';
import AdminLayout from '../../../../container/AdminLayout';
import UserAnalytics from '../../../../components/admin/UserManagement/UserAnalytics';
import UsersTable from '../../../../components/admin/UserManagement/UsersTable';
import UpdateUsers from '../../../../components/admin/UserManagement/UpdateUsers';

/**
 * UC010: Manage User — Page Entry
 * AddUsers is now rendered inside UsersTable header (no more floating button).
 */
const UserManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);
  const tableRef = useRef(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    openUpdate();
  };

  const handleCloseUpdate = () => {
    closeUpdate();
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  return (
    <AdminLayout>
      <Box>
        <UserAnalytics />

        {/* AddUsers is now an inline button inside UsersTable header */}
        <UsersTable ref={tableRef} onEdit={handleEdit} onCreated={handleRefresh} />

        <UpdateUsers
          selectedUser={selectedUser}
          opened={updateOpened}
          onClose={handleCloseUpdate}
          onUpdated={handleRefresh}
        />
      </Box>
    </AdminLayout>
  );
};

export default UserManagementPage;
