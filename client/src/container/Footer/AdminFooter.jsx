import React from 'react';
import { Box, Text, Container, Center } from '@mantine/core';

const AdminFooter = () => {
  return (
    <Box 
      component="footer" 
      style={{ 
        padding: '24px 0', 
        backgroundColor: 'transparent',
        borderTop: '1px solid #f1f3f5',
        marginTop: 'auto'
      }}
    >
      <Container size="xl">
        <Center>
          <Text size="xs" style={{ color: '#adb5bd', fontWeight: 600, letterSpacing: '0.5px' }}>
            Developed by MakanMateDev 2026
          </Text>
        </Center>
      </Container>
    </Box>
  );
};

export default AdminFooter;
