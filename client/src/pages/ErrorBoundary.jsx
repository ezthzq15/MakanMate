import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Center, Stack, Paper, Badge, Group, Code } from '@mantine/core';
import { IconAlertTriangle, IconRefresh, IconHome, IconArrowLeft } from '@tabler/icons-react';

/**
 * COMPONENT: RouteErrorBoundary
 * Shown by React Router whenever a route throws an unhandled error.
 * Replaces React Router's default ugly dev-warning page.
 *
 * Usage: add `errorElement: <RouteErrorBoundary />` to the root route
 * and all child routes inherit it automatically.
 */
const RouteErrorBoundary = () => {
  const error = useRouteError();

  // Classify the error
  let status = null;
  let title  = 'Something went wrong';
  let detail = 'An unexpected error occurred. This is usually temporary.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title  = 'Page not found';
      detail = "The page you're looking for doesn't exist.";
    } else if (status === 401 || status === 403) {
      title  = 'Access denied';
      detail = 'You do not have permission to view this page.';
    } else if (status >= 500) {
      title  = 'Server error';
      detail = 'The server ran into a problem. Please try again in a moment.';
    } else {
      detail = error.data || error.statusText || detail;
    }
  } else if (error instanceof Error) {
    detail = error.message;
  }

  const handleReload = () => window.location.reload();
  const handleHome   = () => { window.location.href = '/'; };
  const handleBack   = () => window.history.back();

  return (
    <Container size="sm" py={80}>
      <Center>
        <Stack align="center" gap="xl" style={{ textAlign: 'center', maxWidth: 520 }}>

          {/* Icon */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: 'linear-gradient(135deg, #fff8f0, #fff)',
              border: '2px solid #fde8cc',
              boxShadow: '0 8px 32px rgba(250, 176, 5, 0.12)',
            }}
          >
            <IconAlertTriangle size={56} color="#fab005" stroke={1.5} />
          </Paper>

          {/* Status badge */}
          {status && (
            <Badge size="lg" color="orange" variant="light" radius="xl">
              Error {status}
            </Badge>
          )}

          {/* Message */}
          <Stack gap="xs">
            <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
              {title}
            </Title>
            <Text c="dimmed" size="md" lh={1.6}>
              {detail}
            </Text>
            <Text c="dimmed" size="sm">
              If this keeps happening, try refreshing the page. Your session and data are safe.
            </Text>
          </Stack>

          {/* Dev-only error details */}
          {import.meta.env.DEV && error instanceof Error && (
            <Paper p="md" radius="lg" withBorder style={{ width: '100%', textAlign: 'left', background: '#1a1a1a' }}>
              <Text size="xs" c="dimmed" mb={6} fw={700}>Stack trace (dev only):</Text>
              <Code block style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'transparent', color: '#f87171' }}>
                {error.stack || error.message}
              </Code>
            </Paper>
          )}

          {/* Actions */}
          <Group gap="md">
            <Button
              variant="light"
              color="gray"
              radius="xl"
              size="md"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBack}
            >
              Go back
            </Button>
            <Button
              variant="light"
              color="orange"
              radius="xl"
              size="md"
              leftSection={<IconRefresh size={16} />}
              onClick={handleReload}
            >
              Reload page
            </Button>
            <Button
              variant="filled"
              color="dark"
              radius="xl"
              size="md"
              leftSection={<IconHome size={16} />}
              onClick={handleHome}
            >
              Home
            </Button>
          </Group>

        </Stack>
      </Center>
    </Container>
  );
};

/**
 * CLASS: AppErrorBoundary
 * Catches synchronous render errors that React Router's errorElement
 * won't catch (e.g., errors during initial render before the router is set up).
 */
export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; replace with a real logger (Sentry etc.) in prod
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      return (
        <Container size="sm" py={80}>
          <Center>
            <Stack align="center" gap="xl" style={{ textAlign: 'center', maxWidth: 520 }}>
              <Paper
                radius="xl"
                p="xl"
                style={{
                  background: 'linear-gradient(135deg, #fff8f0, #fff)',
                  border: '2px solid #fde8cc',
                  boxShadow: '0 8px 32px rgba(250, 176, 5, 0.12)',
                }}
              >
                <IconAlertTriangle size={56} color="#fab005" stroke={1.5} />
              </Paper>

              <Stack gap="xs">
                <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                  Something went wrong
                </Title>
                <Text c="dimmed" size="md" lh={1.6}>
                  {error?.message || 'An unexpected error occurred.'}
                </Text>
                <Text c="dimmed" size="sm">
                  This is usually temporary. Please try refreshing the page.
                </Text>
              </Stack>

              {import.meta.env.DEV && error?.stack && (
                <Paper p="md" radius="lg" withBorder style={{ width: '100%', textAlign: 'left', background: '#1a1a1a' }}>
                  <Text size="xs" c="dimmed" mb={6} fw={700}>Stack trace (dev only):</Text>
                  <Code block style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'transparent', color: '#f87171' }}>
                    {error.stack}
                  </Code>
                </Paper>
              )}

              <Group gap="md">
                <Button
                  variant="light"
                  color="orange"
                  radius="xl"
                  size="md"
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                >
                  Reload page
                </Button>
                <Button
                  variant="filled"
                  color="dark"
                  radius="xl"
                  size="md"
                  leftSection={<IconHome size={16} />}
                  onClick={() => { window.location.href = '/'; }}
                >
                  Home
                </Button>
              </Group>
            </Stack>
          </Center>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
