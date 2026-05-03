import React from 'react';
import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const UnassignedStall = () => {
  return (
    <Container size="md">
      <Center style={{ height: '80vh' }}>
        <Stack align="center" gap="xl">
          <IconAlertCircle size={100} color="#E9ECEF" stroke={1.5} />
          <Title order={2} style={{ color: '#2C3E50', textAlign: 'center' }}>
            Assignment Pending
          </Title>
          <Text size="lg" style={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>
            Admin does not assign to a stall yet or stall has not been created. 
            Please wait until further notice.
          </Text>
          <Button 
            size="lg" 
            variant="filled" 
            color="#4D6459" 
            radius="xl"
            onClick={() => window.location.href = '/auth/login'}
          >
            Back to Login
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default UnassignedStall;
