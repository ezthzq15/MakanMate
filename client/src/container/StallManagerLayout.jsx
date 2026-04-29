import React, { useState } from 'react';
import { Box, Flex } from '@mantine/core';
import StallManagerNavbar from './Navbar/StallManager';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';
import ForcePasswordChangeModal from '../components/auth/ForcePasswordChangeModal';
import { getAuthUser } from '../utils/auth';

const StallManagerLayout = ({ children }) => {
  const [user, setUser] = useState(getAuthUser());
  const [showForcePassword, setShowForcePassword] = useState(user?.forcePasswordChange || false);

  const handlePasswordChanged = () => {
    // Update local user state and clear flag
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

      {/* Fixed Sidebar */}
      <StallManagerNavbar />

      {/* Main Content Area */}
      <Box 
        style={{ 
          flex: 1, 
          marginLeft: '280px', // Matches Navbar width
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--mm-admin-bg)'
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
      </Box>
    </Flex>
  );
};

export default StallManagerLayout;
