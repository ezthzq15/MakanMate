import React from 'react';
import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';

const NotFoundPage = () => {
  return (
    <Container size="md">
      <Center style={{ height: '80vh' }}>
        <Stack align="center" gap="xl">
          <Title order={1} style={{ fontSize: '100px', fontWeight: 900, color: '#f0f0f0' }}>404</Title>
          <Title order={2}>Page Not Found</Title>
          <Text size="lg" style={{ color: '#666', textAlign: 'center' }}>
            The page you are looking for does not exist or has been moved.
          </Text>
          <Button 
            size="lg" 
            variant="outline" 
            color="gray" 
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default NotFoundPage;
