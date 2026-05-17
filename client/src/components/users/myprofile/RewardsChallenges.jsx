import React, { useState, useEffect } from 'react';
import { Paper, Title, Text, Group, Box, Stack, Center, Loader, ThemeIcon, Badge, Button, Divider, ScrollArea } from '@mantine/core';
import { IconTrophy, IconCoin, IconCheck, IconReceipt, IconUserCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../lib/apiClient';

const RewardsChallenges = ({ profile }) => {
  const [loading, setLoading] = useState(true);
  const [pointsData, setPointsData] = useState({ loyaltyPoints: 0, transactions: [] });
  const [claiming, setClaiming] = useState(false);

  const fetchPointsData = async () => {
    try {
      const response = await apiClient.get('/loyalty/points');
      setPointsData(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load points data', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointsData();
  }, []);

  const claimChallenge = async (challengeId) => {
    setClaiming(true);
    try {
      const response = await apiClient.post('/loyalty/challenge/complete', { challengeId });
      notifications.show({ title: 'Success!', message: `You earned ${response.data.pointsAwarded} points!`, color: 'green' });
      fetchPointsData();
    } catch (error) {
      notifications.show({ title: 'Challenge Failed', message: error.response?.data?.error || 'Could not claim challenge', color: 'red' });
    } finally {
      setClaiming(false);
    }
  };

  const hasClaimedProfile = pointsData.transactions.some(t => t.type === 'challenge' && t.challengeId === 'profile_complete');

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader color="olive" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Points Header */}
      <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: 'var(--mm-color-primary)', color: 'white', borderColor: 'var(--mm-color-primary)' }}>
        <Group justify="space-between" align="center">
          <Box>
            <Text size="sm" tt="uppercase" fw={700} style={{ letterSpacing: '1px' }}>Current Balance</Text>
            <Group align="baseline" gap="xs">
              <Title order={1} style={{ fontSize: '48px', margin: 0 }}>{pointsData.loyaltyPoints}</Title>
              <Text size="xl" fw={600}>Points</Text>
            </Group>
          </Box>
          <ThemeIcon size={80} radius="100%" color="white" variant="light" style={{ opacity: 0.8 }}>
            <IconCoin size={50} color="var(--mm-color-primary)" />
          </ThemeIcon>
        </Group>
      </Paper>

      {/* Challenges Section */}
      <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
        <Group gap="sm" mb="lg">
          <ThemeIcon color="orange" variant="light" size="lg" radius="md">
            <IconTrophy size={20} />
          </ThemeIcon>
          <Title order={3} style={{ color: 'var(--mm-admin-sidebar)' }}>Available Challenges</Title>
        </Group>

        <Stack gap="md">
          {/* Challenge 1: Profile Completion */}
          <Paper withBorder p="md" radius="md" style={{ borderColor: hasClaimedProfile ? 'var(--mantine-color-green-6)' : 'var(--mm-border-color)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Group wrap="nowrap">
                <ThemeIcon color={hasClaimedProfile ? "green" : "blue"} size="xl" radius="md" variant="light">
                  {hasClaimedProfile ? <IconCheck size={24} /> : <IconUserCheck size={24} />}
                </ThemeIcon>
                <Box>
                  <Text fw={700}>Complete Your Profile</Text>
                  <Text size="sm" c="dimmed">Add a profile picture and your address to earn your first reward.</Text>
                </Box>
              </Group>
              <Group wrap="nowrap">
                <Badge size="lg" color="orange" variant="light">+100 Pts</Badge>
                {!hasClaimedProfile ? (
                  <Button
                    variant="light"
                    color="olive"
                    onClick={() => claimChallenge('profile_complete')}
                    loading={claiming}
                  >
                    Claim
                  </Button>
                ) : (
                  <Button variant="subtle" color="green" disabled>Claimed</Button>
                )}
              </Group>
            </Group>
          </Paper>

          {/* Challenge 2: Passive check-in earning (Not clickable) */}
          <Paper withBorder p="md" radius="md" style={{ borderColor: 'var(--mm-border-color)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Group wrap="nowrap">
                <ThemeIcon color="gray" size="xl" radius="md" variant="light">
                  <IconReceipt size={24} />
                </ThemeIcon>
                <Box>
                  <Text fw={700}>Check-in Master</Text>
                  <Text size="sm" c="dimmed">Automatically earn points every time you redeem a voucher at any stall.</Text>
                </Box>
              </Group>
              <Badge size="lg" color="orange" variant="light">+50 Pts / Visit</Badge>
            </Group>
          </Paper>
        </Stack>
      </Paper>

      {/* Transaction History */}
      <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
        <Title order={3} mb="lg" style={{ color: 'var(--mm-admin-sidebar)' }}>History</Title>
        <ScrollArea h={300} offsetScrollbars>
          {pointsData.transactions.length > 0 ? (
            <Stack gap="sm" pr="md">
              {pointsData.transactions.map((tx) => (
                <Box key={tx.id}>
                  <Group justify="space-between" wrap="nowrap">
                    <Box>
                      <Text fw={600} size="sm">{tx.description}</Text>
                      <Text size="xs" c="dimmed">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</Text>
                    </Box>
                    <Text fw={800} color={tx.points > 0 ? "green.6" : "red.6"}>
                      {tx.points > 0 ? "+" : ""}{tx.points}
                    </Text>
                  </Group>
                  <Divider my="sm" />
                </Box>
              ))}
            </Stack>
          ) : (
            <Center h={100}>
              <Text c="dimmed">No transactions yet. Start exploring MakanMate to earn points!</Text>
            </Center>
          )}
        </ScrollArea>
      </Paper>
    </Stack>
  );
};

export default RewardsChallenges;
