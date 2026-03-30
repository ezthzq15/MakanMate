import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import { isAuthenticated, getUserRole } from '../utils/auth';

const UnauthorizedPage = () => {
  const isAuth = isAuthenticated();
  const role = getUserRole();
  const homePath = role === 'admin' ? '/admin' : '/';

  return (
    <Container size="md">
      <Center style={{ height: '80vh' }}>
        <Stack align="center" gap="xl">
          <Title order={1} style={{ fontSize: '100px', fontWeight: 900, color: '#f0f0f0' }}>401</Title>
          <Title order={2}>Unauthorized Access</Title>
          <Text size="lg" style={{ color: '#666', textAlign: 'center' }}>
            {isAuth 
              ? "You do not have permission to view this page." 
              : "Please log in with an authorized account to access this page."}
          </Text>
          <Button 
            size="lg" 
            variant="filled" 
            color="#4D6459" 
            onClick={() => window.location.href = isAuth ? homePath : '/auth/login'}
          >
            {isAuth ? (role === 'admin' ? 'Back to Admin Console' : 'Back to Homepage') : 'Go to Login'}
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default UnauthorizedPage;
