import React from 'react';
import { Modal, Text, Button, Stack, Group, Loader, Center, Box, Paper, ThemeIcon, Badge } from '@mantine/core';
import { IconClock, IconTicket, IconCheck, IconAlertCircle, IconChecklist } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';

const VoucherCheckInModal = ({ 
  opened, 
  onClose, 
  voucher,
  checkInState,
  requestCheckIn,
  redemptionData
}) => {

  const getModalContent = () => {
    switch (checkInState) {
      case 'initial':
        return (
          <Stack align="center" ta="center" gap="xl" py="md">
            <ThemeIcon size={80} radius={40} variant="light" color="brand">
              <IconTicket size={40} />
            </ThemeIcon>
            <Box>
              <Text fw={800} size="xl" mb="xs">{voucher?.title}</Text>
              <Text size="sm" c="dimmed" px="md">
                Ready to redeem? Request a check-in to generate your unique QR code. The stall manager will approve your request shortly.
              </Text>
            </Box>
            
            <Paper p="md" radius="md" bg="var(--mantine-color-gray-0)" w="100%" style={{ border: '1px dashed var(--mantine-color-gray-4)' }}>
              <Group justify="center" gap="xs">
                <IconTicket size={18} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={600} c="gray.7">Discount: {voucher?.discount}</Text>
              </Group>
            </Paper>

            <Button 
              fullWidth 
              color="brand" 
              size="lg"
              radius="xl"
              onClick={() => requestCheckIn(voucher?.id)}
              leftSection={<IconChecklist size={20} />}
              style={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}
            >
              Request Check-in
            </Button>
          </Stack>
        );
      
      case 'pending':
        return (
          <Stack align="center" ta="center" gap="xl" py="xl">
            <Box style={{ position: 'relative' }}>
              <Loader color="brand" size={70} type="bars" />
            </Box>
            <Box mt="sm">
              <Text fw={700} size="xl">Awaiting Approval</Text>
              <Text size="sm" c="dimmed" mt="xs" px="xl">
                Please wait while the stall manager processes your check-in request. This usually takes just a moment.
              </Text>
            </Box>
          </Stack>
        );

      case 'approved':
        return (
          <Paper radius="md" p={0} style={{ overflow: 'hidden', border: '1px solid var(--mantine-color-gray-3)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            {/* Top half: Header & QR Code */}
            <Box p="xl" bg="var(--mantine-color-green-0)" style={{ borderBottom: '2px dashed var(--mantine-color-gray-4)', position: 'relative' }}>
              {/* Ticket cutouts */}
              <Box style={{ position: 'absolute', left: -12, bottom: -12, width: 24, height: 24, borderRadius: '50%', backgroundColor: 'white', borderRight: '1px solid var(--mantine-color-gray-3)', zIndex: 2 }} />
              <Box style={{ position: 'absolute', right: -12, bottom: -12, width: 24, height: 24, borderRadius: '50%', backgroundColor: 'white', borderLeft: '1px solid var(--mantine-color-gray-3)', zIndex: 2 }} />
              
              <Stack align="center" gap="sm">
                <Badge size="lg" color="green" variant="light" leftSection={<IconCheck size={14} />}>
                  Check-in Approved
                </Badge>
                <Text fw={700} size="xl" mt="xs">{voucher?.title}</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Present this QR code to the cashier to redeem your voucher.
                </Text>

                <Paper p="md" radius="md" shadow="sm" bg="white" mt="md" style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
                  <QRCodeSVG value={redemptionData?.redemptionCode || 'ERROR'} size={180} />
                </Paper>
              </Stack>
            </Box>

            {/* Bottom half: Code & Timer */}
            <Box p="xl" bg="white" style={{ position: 'relative' }}>
              <Stack align="center" gap="xs">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} letterSpacing={1}>Redemption Code</Text>
                <Text fw={900} size="32px" style={{ letterSpacing: '6px', fontFamily: 'monospace', color: 'var(--mantine-color-dark-8)' }}>
                  {redemptionData?.redemptionCode}
                </Text>

                <Group gap="xs" mt="lg" justify="center" p="xs" px="md" style={{ backgroundColor: 'var(--mantine-color-red-0)', borderRadius: '24px' }}>
                  <IconClock size={16} color="var(--mantine-color-red-6)" />
                  <Text fw={700} c="red.7" size="sm">
                    Expires at: {new Date(redemptionData?.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Group>
              </Stack>
            </Box>
          </Paper>
        );
      
      case 'redeemed':
        return (
          <Stack align="center" ta="center" gap="xl" py="xl">
            <ThemeIcon size={80} radius={40} variant="filled" color="green">
              <IconCheck size={40} stroke={3} />
            </ThemeIcon>
            <Box>
              <Text fw={800} size="xl" c="green.7">Voucher Redeemed!</Text>
              <Text size="sm" c="dimmed" mt="xs">
                Your voucher has been successfully claimed. Enjoy your meal!
              </Text>
            </Box>
            <Button variant="light" color="gray" fullWidth radius="xl" onClick={onClose} mt="md">
              Close Window
            </Button>
          </Stack>
        );

      case 'expired':
        return (
          <Stack align="center" ta="center" gap="xl" py="xl">
            <ThemeIcon size={80} radius={40} variant="light" color="red">
              <IconAlertCircle size={40} />
            </ThemeIcon>
            <Box>
              <Text fw={800} size="xl" c="red.7">Voucher Expired</Text>
              <Text size="sm" c="dimmed" mt="xs">
                The redemption time window has elapsed. This voucher is no longer valid.
              </Text>
            </Box>
            <Button variant="light" color="gray" fullWidth radius="xl" onClick={onClose} mt="md">
              Close Window
            </Button>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Text fw={700} size="lg">Voucher Redemption</Text>}
      centered
      radius="lg"
      padding="xl"
      overlayProps={{ blur: 3, opacity: 0.5 }}
      styles={{
        header: { paddingBottom: 0 },
        body: { paddingTop: '16px' }
      }}
    >
      {getModalContent()}
    </Modal>
  );
};

export default VoucherCheckInModal;
