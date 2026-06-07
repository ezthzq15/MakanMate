import React from 'react';
import {
  Box, Grid, Paper, Text, Title, Group, Stack, Badge,
  Avatar, Table, ActionIcon, Select, SimpleGrid,
  ThemeIcon, Skeleton, Tooltip
} from '@mantine/core';
import {
  IconTrendingUp, IconUsers, IconFlame, IconBuildingStore,
  IconDots, IconSearch, IconFilter, IconRefresh, IconStar, 
  IconChevronRight, IconActivity, IconHeart, IconBookmark
} from '@tabler/icons-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ title, value, sub, icon, accentColor, brandBg }) => (
  <Paper
    p="xl"
    radius="2xl"
    style={{
      background: brandBg || 'var(--mm-bg-surface)',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      style={{
        position: 'absolute', top: -20, right: -20,
        width: 90, height: 90, borderRadius: '50%',
        background: brandBg ? 'rgba(255,255,255,0.08)' : `${accentColor}18`,
      }}
    />
    <Group justify="space-between" align="flex-start">
      <Box>
        <Text size="xs" fw={700} c={brandBg ? 'rgba(255,255,255,0.75)' : 'dimmed'} tt="uppercase" mb={6}>
          {title}
        </Text>
        <Title order={2} fw={900} style={{ fontSize: '32px', color: brandBg ? '#fff' : 'var(--mm-admin-text-main)' }}>
          {value}
        </Title>
      </Box>
      <ThemeIcon
        size={48}
        radius="xl"
        style={{
          background: brandBg ? 'rgba(255,255,255,0.15)' : `${accentColor}22`,
          color: brandBg ? '#fff' : accentColor,
        }}
      >
        {icon}
      </ThemeIcon>
    </Group>
    <Text size="xs" fw={700} mt="md" c={brandBg ? 'rgba(255,255,255,0.8)' : accentColor}>
      {sub}
    </Text>
  </Paper>
);

// ── Professional Chart Component ───────────────────────────
const PerformanceChart = ({ data = [] }) => {
  return (
    <Box style={{ height: 320, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4d6459" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4d6459" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e4a11b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#e4a11b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#adb5bd', fontSize: 12, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#adb5bd', fontSize: 12, fontWeight: 700 }}
          />
          <RechartsTooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
            itemStyle={{ fontWeight: 800, fontSize: '13px' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            align="right"
            iconType="circle"
            wrapperStyle={{ fontWeight: 700, fontSize: '13px', color: '#495057' }}
          />
          <Area 
            name="Reviews"
            type="monotone" 
            dataKey="reviews" 
            stroke="#4d6459" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorReviews)" 
          />
          <Area 
            name="Likes"
            type="monotone" 
            dataKey="likes" 
            stroke="#e4a11b" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLikes)" 
          />
          <Area 
            name="Bookmarks"
            type="monotone" 
            dataKey="bookmarks" 
            stroke="#54b435" 
            strokeWidth={3}
            fillOpacity={0} 
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ── Main Dashboard ─────────────────────────────────────────
const AdminDashboard = () => {
  const { loading, stats, refresh } = useAdminDashboard();

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? '—');

  return (
    <Box>
      <Group justify="space-between" mb={40}>
        <Box>
          <Title order={2} fw={900} style={{ color: 'var(--mm-admin-sidebar)', fontSize: '28px', letterSpacing: '-0.5px' }}>
            System Overview
          </Title>
          <Text size="sm" c="dimmed" fw={600} style={{ wordBreak: 'break-word' }}>Welcome back, Super. Here's what's happening today.</Text>
        </Box>
        <Tooltip label="Refresh data">
          <ActionIcon variant="light" color="sage" size="lg" radius="xl" onClick={refresh} loading={loading}>
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb={40}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={160} radius="xl" />)
        ) : (
          <>
            <StatCard
              title="Total Stalls"
              value={fmt(stats?.totalStalls)}
              sub="↑ Registered on platform"
              icon={<IconBuildingStore size={22} />}
              accentColor="#4d6459"
            />
            <StatCard
              title="Total Users"
              value={fmt(stats?.totalUsers)}
              sub={`${fmt(stats?.activeUsers)} active today`}
              icon={<IconUsers size={22} />}
              accentColor="#e4a11b"
            />
            <StatCard
              title="Active Users"
              value={fmt(stats?.activeUsers)}
              sub="Logged in today"
              icon={<IconActivity size={22} />}
              accentColor="#54b435"
            />
            <StatCard
              title="Top Rated Stall"
              value={stats?.mostPopular?.name || '—'}
              sub={stats?.mostPopular?.rating ? `Rating: ${stats.mostPopular.rating.toFixed(1)} ★` : 'No ratings yet'}
              icon={<IconFlame size={22} />}
              accentColor="#fff"
              brandBg="var(--mm-admin-accent, #4d6459)"
            />

          </>
        )}
      </SimpleGrid>

      <Grid gutter="xl" mb={40}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p={40} radius="2xl" h="100%">
            <Group justify="space-between" mb={32}>
              <Box>
                <Title order={3} fw={900} style={{ fontSize: '20px', color: 'var(--mm-admin-sidebar)' }}>
                  Platform Engagement
                </Title>
                <Text size="xs" c="dimmed" fw={700}>Daily interactions across reviews, likes, and bookmarks</Text>
              </Box>
              <Select
                size="sm"
                radius="xl"
                defaultValue="Last 7 Days"
                data={['Last 7 Days', 'Last 30 Days']}
                variant="filled"
                style={{ width: 150 }}
                styles={{ input: { border: 'none', fontWeight: 700 } }}
              />
            </Group>
            
            {loading ? (
              <Skeleton height={320} radius="md" />
            ) : (
              <PerformanceChart data={stats?.dailyActivity || []} />
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper p={40} radius="2xl" h="100%">
            <Group justify="space-between" mb={28}>
              <Title order={3} fw={900} style={{ fontSize: '20px', color: 'var(--mm-admin-sidebar)' }}>
                Recent Users
              </Title>
            </Group>

            <Stack gap="lg">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={40} radius="xl" />)
                : (stats?.recentUsers || []).map((user, i) => (
                    <Group key={i} wrap="nowrap" gap="md">
                      <Avatar
                        src={user.profileImage}
                        size={40}
                        radius="xl"
                        color="olive"
                        bg="var(--mm-admin-sage)"
                      >
                        {user.userName?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text size="sm" fw={800} lineClamp={1}>{user.userName}</Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>{user.userEmail}</Text>
                        <Text size="10px" c="olive" fw={600} lineClamp={1}>
                          {user.lastLoginAt 
                            ? `Last login: ${new Date(user.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                            : 'Never logged in'}
                        </Text>
                      </Box>

                      <Badge
                        size="sm"
                        radius="sm"
                        variant="light"
                        color={user.accountStatus === 0 ? 'green' : 'red'}
                      >
                        {user.accountStatus === 0 ? 'Active' : 'Inactive'}
                      </Badge>
                    </Group>
                  ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper p={40} radius="2xl">
        <Group justify="space-between" mb={28}>
          <Title order={3} fw={900} style={{ fontSize: '20px', color: 'var(--mm-admin-sidebar)' }}>
            Top Performing Stalls
          </Title>
        </Group>

        <Box className="responsive-table-container">
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>STALL NAME</Table.Th>
                <Table.Th>CATEGORY</Table.Th>
                <Table.Th>REVIEWS</Table.Th>
                <Table.Th>RATING</Table.Th>
                <Table.Th>STATUS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Table.Tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Table.Td key={j}><Skeleton height={20} radius="sm" /></Table.Td>
                      ))}
                    </Table.Tr>
                  ))
                : (stats?.topStalls || []).map((stall, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>
                        <Group gap="md">
                          <Avatar radius="md" size={44} src={stall.imageURL} bg="gray.1" color="olive">
                            {stall.name?.[0]}
                          </Avatar>
                          <Text fw={800} size="sm">{stall.name}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" fw={600}>{stall.category}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={800} size="sm">{stall.reviews}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <IconStar size={14} color="#fab005" fill="#fab005" />
                          <Text size="sm" fw={800}>{stall.rating?.toFixed(1) || '—'}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          radius="sm"
                          color={stall.status === 'ACTIVE' ? 'green' : 'red'}
                        >
                          {stall.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
            </Table.Tbody>
          </Table>
        </Box>

      </Paper>
    </Box>
  );
};

export default AdminDashboard;
