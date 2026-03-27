import React from 'react';
import { Box } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <Header />
      <Box component="main" style={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
