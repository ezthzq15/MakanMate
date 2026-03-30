import React from 'react';
import { Box } from '@mantine/core';
import Header from './Header/UserHeader';
import Footer from './Footer/UserFooter';

const AppLayout = ({ children }) => {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--mm-bg-body)' }}>
      <Header />
      <Box component="main" style={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
