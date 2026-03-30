import React from 'react';
import { Paper, Text, Group, SimpleGrid, ThemeIcon, Skeleton, Box, Title } from '@mantine/core';
import { IconCheck, IconX, IconToolsKitchen } from '@tabler/icons-react';
import { useStallsAnalytics } from '../../../hooks/admin/StallManagement/useStallsAnalytics';

const StallsAnalytics = () => {
  const { totalStalls, halalCount, nonHalalCount, loading } = useStallsAnalytics();

  const cards = [
    {
      label: 'Total Stalls',
      value: totalStalls,
      sub: 'Active food vendors',
      icon: IconToolsKitchen,
      accent: false,
    },
    {
      label: 'Halal Certified',
      value: halalCount,
      sub: 'Verified compliance',
      icon: IconCheck,
      accent: false,
    },
    {
      label: 'Non-Halal',
      value: nonHalalCount,
      sub: 'Other food outlets',
      icon: IconX,
      accent: true,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb="xl">
      {cards.map((card) => (
        <Paper
          key={card.label}
          p={32}
          radius="lg"
          style={{
            backgroundColor: card.accent
              ? 'var(--mm-admin-sidebar, #4D6459)'
              : 'var(--mm-bg-surface, #ffffff)',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: card.accent ? 'none' : '1px solid #eee',
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
                    : 'var(--mm-admin-text-dimmed, #868e96)',
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
                    color: card.accent ? '#ffffff' : 'var(--mm-admin-text-main, #2C3E50)',
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
                    : 'var(--mm-admin-sage, #4D6459)',
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
                color: card.accent ? '#fff' : 'var(--mm-admin-sidebar, #4D6459)',
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

export default StallsAnalytics;
