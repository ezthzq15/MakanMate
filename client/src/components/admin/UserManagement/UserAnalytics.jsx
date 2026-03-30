import { SimpleGrid, Paper, Text, Title, Group, Box, ThemeIcon, Skeleton } from '@mantine/core';
import { IconUsers, IconActivity, IconUserPlus } from '@tabler/icons-react';
import useAnalyticUsers from '../../../hooks/admin/UserManagement/useAnalyticUsers';

const UserAnalytics = () => {
  const { stats, loading } = useAnalyticUsers();

  const cards = [
    {
      label: 'Total Users',
      value: stats.total,
      sub: '+12% this month',
      icon: IconUsers,
      accent: false,
    },
    {
      label: 'Active Today',
      value: stats.activeToday,
      sub: 'Live traffic spiking',
      icon: IconActivity,
      accent: false,
    },
    {
      label: 'New Signups',
      value: stats.newSignups,
      sub: 'Last 24 hours',
      icon: IconUserPlus,
      accent: true,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb="xl">
      {cards.map((card) => (
        <Paper
          key={card.label}
          p={32}
          radius="var(--mm-admin-radius)"
          style={{
            backgroundColor: card.accent
              ? 'var(--mm-admin-sidebar)'
              : 'var(--mm-bg-surface)',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box style={{ flex: 1 }}>
              <Text
                size="sm"
                fw={600}
                mb={8}
                style={{
                  color: card.accent
                    ? 'rgba(255,255,255,0.65)'
                    : 'var(--mm-admin-text-dimmed)',
                  letterSpacing: '0.3px',
                }}
              >
                {card.label}
              </Text>

              {loading ? (
                <Skeleton height={52} width={100} radius="sm" mb={12} />
              ) : (
                <Title
                  order={1}
                  style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: card.accent ? '#ffffff' : 'var(--mm-admin-text-main)',
                    marginBottom: '12px',
                  }}
                >
                  {card.value.toLocaleString()}
                </Title>
              )}

              <Text
                size="xs"
                fw={500}
                style={{
                  color: card.accent
                    ? 'rgba(255,255,255,0.55)'
                    : 'var(--mm-admin-sage)',
                }}
              >
                {card.sub}
              </Text>
            </Box>

            <ThemeIcon
              size={52}
              radius="xl"
              style={{
                backgroundColor: card.accent
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(77,100,89,0.07)',
                color: card.accent ? '#fff' : 'var(--mm-admin-sidebar)',
                flexShrink: 0,
              }}
            >
              <card.icon size={24} stroke={1.5} />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default UserAnalytics;
