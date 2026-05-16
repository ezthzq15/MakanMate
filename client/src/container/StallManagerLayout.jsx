import React, { useState } from 'react';
import { Box, Flex, Drawer } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import StallManagerNavbar from './Navbar/StallManager';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';
import ForcePasswordChangeModal from '../components/auth/ForcePasswordChangeModal';
import { getAuthUser } from '../utils/auth';

const StallManagerLayout = () => {
  const [user, setUser] = useState(getAuthUser());
  const [showForcePassword, setShowForcePassword] = useState(user?.forcePasswordChange || false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const handlePasswordChanged = () => {
    const updatedUser = { ...user, forcePasswordChange: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowForcePassword(false);
  };

  return (
    <Flex style={{ minHeight: '100vh', backgroundColor: 'var(--mm-admin-bg)' }}>
      {/* Security Check Modal */}
      <ForcePasswordChangeModal 
        opened={showForcePassword} 
        user={user}
        onPasswordChanged={handlePasswordChanged}
      />

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
        <StallManagerNavbar isDrawer={true} />
      </Drawer>

      {/* Desktop Sidebar */}
      <StallManagerNavbar />

      {/* Main Content Area */}
      <Box 
        className="admin-content-area"
        style={{ 
          flex: 1, 
          marginLeft: '280px', 
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
          <Outlet />
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
            padding: 20px !important;
          }
        }
      `}</style>
    </Flex>
  );
};

export default StallManagerLayout;
