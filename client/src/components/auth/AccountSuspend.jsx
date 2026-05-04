import { Modal, Stack, ThemeIcon, Title, Text, Button } from '@mantine/core';
import { IconBan } from '@tabler/icons-react';

export function AccountSuspend({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} centered radius="lg">
      <Stack align="center" gap="md">
        <ThemeIcon color="red" size={60} radius="xl" variant="light">
          <IconBan size={32} />
        </ThemeIcon>
        <Title order={3} ta="center" c="red.7">
          Account Suspended
        </Title>
        <Text ta="center" size="sm" c="dimmed">
          Your account has been suspended. Please contact support for more information.
        </Text>
        <Button 
          fullWidth 
          variant="light" 
          color="red" 
          radius="xl" 
          onClick={() => window.location.reload()}
        >
          Back
        </Button>
      </Stack>
    </Modal>
  );
}
