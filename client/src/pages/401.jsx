import React from 'react';
import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';

const UnauthorizedPage = () => {
  return (
    <Container size="md">
      <Center style={{ height: '80vh' }}>
        <Stack align="center" gap="xl">
          <Title order={1} style={{ fontSize: '100px', fontWeight: 900, color: '#f0f0f0' }}>401</Title>
          <Title order={2}>Unauthorized Access</Title>
          <Text size="lg" style={{ color: '#666', textAlign: 'center' }}>
            You do not have permission to view this page. Please log in with an authorized account.
          </Text>
          <Button 
            size="lg" 
            variant="filled" 
            color="brand" 
            onClick={() => window.location.href = '/auth/login'}
          >
            Go to Login
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default UnauthorizedPage;
