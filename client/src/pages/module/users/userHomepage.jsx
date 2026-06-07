import React, { useState, useEffect } from 'react';
import { useUserHomeData } from '../../../hooks/users/useUserHomeData';
import HomepageUI from '../../../components/users/homepage/homepage';
import UserDashboardInsights from '../../../components/users/homepage/userDashboardInsights';
import { Modal, Title, Text, Button, ThemeIcon, Group, Stack } from '@mantine/core';
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



  return (
    <>
      {/* 1. Hero + Feature Cards */}
      <HomepageUI data={data} />

      {/* 2. New Insights Dashboard */}
      <UserDashboardInsights data={data} />

      {/* 4. Welcome Back Modal */}
      <Modal
        opened={!!welcomeBack}
        onClose={() => setWelcomeBack(null)}
        centered
        withCloseButton={false}
        radius="xl"
        padding="xl"
      >
        <Stack align="center" gap="lg" py="md">
          <ThemeIcon size={80} radius={100} variant="light" color="yellow">
            <IconSunrise size={42} />
          </ThemeIcon>
          <Title order={3} ta="center" fw={900}>
            Welcome back, {welcomeBack}!
          </Title>
          <Text c="dimmed" ta="center" size="sm">
            We've missed you. Penang's food scene has kept busy while you were away!
          </Text>
          <Group gap="md" w="100%">
            <Button flex={1} radius="xl" color="olive" size="md" onClick={() => setWelcomeBack(null)}>
              Explore Now
            </Button>
            <Button flex={1} radius="xl" variant="default" size="md" onClick={() => setWelcomeBack(null)}>
              Maybe Later
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default UserHomepage;
