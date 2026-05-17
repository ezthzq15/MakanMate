import React, { useState, useEffect } from 'react';
import { Paper, Title, Text, TextInput, Button, Group, Box, Modal, Stack } from '@mantine/core';
import { IconQrcode, IconScan, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../../../../lib/apiClient';

const RedeemVoucher = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleRedeem = async (redeemCode) => {
    if (!redeemCode.trim()) {
      return notifications.show({ title: 'Error', message: 'Please enter a voucher code', color: 'red' });
    }

    setLoading(true);
    try {
      await apiClient.post('/vouchers/redeem', { code: redeemCode.trim() });
      notifications.show({ title: 'Success', message: 'Voucher redeemed successfully!', color: 'green' });
      setCode('');
      setScannerOpen(false); // Close scanner if open
    } catch (error) {
      notifications.show({ 
        title: 'Redemption Failed', 
        message: error.response?.data?.error || 'Failed to redeem voucher', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let scanner;
    if (scannerOpen) {
      // Small delay to ensure the modal DOM element is ready
      const timer = setTimeout(() => {
        scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
        
        scanner.render(
          (decodedText) => {
            scanner.clear(); // Stop scanning once successfully decoded
            setCode(decodedText);
            handleRedeem(decodedText);
          },
          (error) => {
            // ignore continuous scan errors
          }
        );
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
          });
        }
      };
    }
  }, [scannerOpen]);

  return (
    <Paper p="xl" withBorder radius="md">
      <Stack align="center" gap="xl" py="xl">
        <IconScan size={64} color="var(--mantine-color-olive-6)" />
        <Title order={2} style={{ color: 'var(--mm-admin-sidebar)' }}>Redeem Voucher</Title>
        <Text c="dimmed" ta="center" maw={400}>
          Enter the customer's voucher code manually or scan the QR code from their MakanMate app.
        </Text>

        <Box w="100%" maw={400} mt="md">
          <TextInput
            placeholder="e.g. 5K9A2X"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            size="md"
            radius="md"
            styles={{ input: { textAlign: 'center', letterSpacing: '2px', fontSize: '18px', fontWeight: 600 } }}
          />
          <Group grow mt="lg">
            <Button 
              size="md" 
              color="olive" 
              onClick={() => handleRedeem(code)} 
              loading={loading}
              leftSection={<IconCheck size={20} />}
            >
              Verify & Redeem
            </Button>
            <Button 
              size="md" 
              variant="outline" 
              color="olive" 
              onClick={() => setScannerOpen(true)}
              leftSection={<IconQrcode size={20} />}
            >
              Scan QR Code
            </Button>
          </Group>
        </Box>
      </Stack>

      <Modal
        opened={scannerOpen}
        onClose={() => setScannerOpen(false)}
        title={<Text fw={700}>Scan QR Code</Text>}
        centered
        size="md"
      >
        <Box id="qr-reader" w="100%" />
      </Modal>
    </Paper>
  );
};

export default RedeemVoucher;
