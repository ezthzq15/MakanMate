import React from 'react';
import { Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Header from './Header/UserHeader';
import Footer from './Footer/UserFooter';

const AppLayout = () => {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--mm-bg-body)' }}>
      <Header />
      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
