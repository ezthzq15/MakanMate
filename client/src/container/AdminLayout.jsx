import React from 'react';
import { Box, Flex } from '@mantine/core';
import AdminNavbar from './Navbar/AdminNavbar';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';

const AdminLayout = ({ children }) => {
  return (
    <Flex style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Fixed Sidebar */}
      <AdminNavbar />

      {/* Main Content Area */}
      <Box 
        style={{ 
          flex: 1, 
          marginLeft: '280px', // Matches AdminNavbar width
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa'
        }}
      >
        <AdminHeader />
        
        <Box 
          component="main" 
          p="40px" 
          style={{ flex: 1 }}
        >
          {children}
        </Box>

        <AdminFooter />
      </Box>
    </Flex>
  );
};

export default AdminLayout;
