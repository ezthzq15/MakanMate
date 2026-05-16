import React, { useState } from 'react';
import { Box, Flex, Drawer } from '@mantine/core';
import AdminNavbar from './Navbar/AdminNavbar';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';

const AdminLayout = ({ children }) => {
  const [drawerOpened, setDrawerOpened] = useState(false);

  return (
    <Flex style={{ minHeight: '100vh', backgroundColor: 'var(--mm-admin-bg)' }}>
      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="280px"
        padding={0}
        withCloseButton={false}
        styles={{
          content: { backgroundColor: 'var(--mm-admin-sidebar-bg)' }
        }}
      >
        <AdminNavbar isDrawer={true} />
      </Drawer>

      {/* Desktop Sidebar */}
      <AdminNavbar />

      {/* Main Content Area */}
      <Box 
        className="admin-content-area"
        style={{ 
          flex: 1, 
          marginLeft: '280px', // Default for desktop
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--mm-admin-bg)'
        }}
      >
        <AdminHeader onMenuClick={() => setDrawerOpened(true)} />
        
        <Box 
          component="main" 
          p="40px" 
          style={{ flex: 1 }}
        >
          {children}
        </Box>
      </Box>

      {/* Local styles for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none !important;
          }
          .admin-content-area {
            margin-left: 0 !important;
          }
          main {
            padding: 20px !important; /* Reduce padding on mobile */
          }
        }
      `}</style>
    </Flex>
  );
};

export default AdminLayout;
