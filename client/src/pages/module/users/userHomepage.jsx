import React, { useState, useEffect } from 'react';
import { useUserHomeData } from '../../../hooks/users/useUserHomeData';
import HomepageUI from '../../../components/users/homepage/homepage';
import TopPicked from '../../../components/users/homepage/topPicked';
import TrendingDeals from '../../../components/users/homepage/trendingDeals';
import { Loader, Center, Stack, Modal, Title, Text, Button, ThemeIcon, Group } from '@mantine/core';
import { IconSunrise } from '@tabler/icons-react';

const UserHomepage = () => {
  const { data, loading } = useUserHomeData({
    onSuccess: (data) => console.log('Successfully loaded homepage data', data),
    onError: (err) => console.error('Error loading homepage data', err)
  });

  // Welcome Back modal state — fired once for returning inactive users
  const [welcomeBack, setWelcomeBack] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('wasInactive');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.flag) {
          setWelcomeBack(parsed.userName || 'there');
          localStorage.removeItem('wasInactive');
        }
      } catch {
        localStorage.removeItem('wasInactive');
      }
    }
  }, []);

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader color="brand" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Stack gap={0}>
      {/* Welcome Back modal for returning inactive users */}
      <Modal
        opened={!!welcomeBack}
        onClose={() => setWelcomeBack(null)}
        centered
        radius="lg"
        padding="xl"
        withCloseButton={false}
        overlayProps={{ blur: 3, opacity: 0.5 }}
      >
        <Stack align="center" gap="md">
          <ThemeIcon color="yellow" size={60} radius="xl" variant="light">
            <IconSunrise size={32} />
          </ThemeIcon>
          <Title order={3} ta="center">Welcome Back, {welcomeBack}! 👋</Title>
          <Text ta="center" size="sm" c="dimmed">
            We missed you! It&apos;s been a while since your last visit.
            Your account has been re-activated. Enjoy exploring MakanMate!
          </Text>
          <Group w="100%">
            <Button
              fullWidth
              color="olive"
              radius="xl"
              onClick={() => setWelcomeBack(null)}
            >
              Let&apos;s Go!
            </Button>
          </Group>
        </Stack>
      </Modal>

      <HomepageUI data={data} />
      <TopPicked />
      <TrendingDeals data={data} />
    </Stack>
  );
};

export default UserHomepage;
