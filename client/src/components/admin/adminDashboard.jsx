import { 
  Box, Grid, Paper, Text, Title, Group, Stack, Badge, 
  Avatar, Table, ActionIcon, Select, UnstyledButton, SimpleGrid
} from '@mantine/core';
import { 
  IconTrendingUp, IconUsers, IconBookmark, IconFlame, 
  IconDots, IconSearch, IconFilter, IconArrowRight, IconBell, IconPlus, IconLogout, IconHelpCircle, IconLayoutDashboard, IconBuildingStore, IconSettings
} from '@tabler/icons-react';

const AdminDashboard = () => {
  // Summary Data from mockup
  const stats = [
    { title: 'Total Stalls', value: '25', sub: '+2 this week', icon: <IconTrendingUp size={16} />, color: 'var(--mm-admin-sidebar)', bg: 'var(--mm-bg-surface)' },
    { title: 'Total Users', value: '1.2k', sub: 'Active now', icon: <IconUsers size={16} />, color: '#E4A11B', bg: 'var(--mm-bg-surface)' },
    { title: 'Bookmarks Today', value: '45', sub: 'High activity', icon: <IconBookmark size={16} />, color: '#54B435', bg: 'var(--mm-bg-surface)' },
    { title: 'Most Popular', value: 'Char Koay Teow', sub: 'Trending', icon: <IconFlame size={16} />, color: '#E4A11B', bg: 'var(--mm-admin-accent)', brandCard: true },
  ];

  // Table Data
  const topStalls = [
    { name: 'Old Town Laksa', category: 'Noodles', bookmarks: '842', rating: '4.9', status: 'ACTIVE', color: 'green', avatar: '/laksa.png' },
    { name: 'Green Harvest', category: 'Healthy', bookmarks: '615', rating: '4.7', status: 'ACTIVE', color: 'green', avatar: '/salad.png' },
    { name: 'Big Bite Burgers', category: 'Western', bookmarks: '528', rating: '4.5', status: 'INACTIVE', color: 'red', avatar: '/burger.png' },
  ];

  // Activities Data
  const activities = [
    { name: 'Sarah J.', action: 'bookmarked', target: 'Old Town Laksa', time: '2 minutes ago', icon: <IconBookmark size={18} /> },
    { name: 'New review for', target: "Auntie's Char Koay Teow", time: '15 minutes ago', icon: <IconTrendingUp size={18} /> },
    { name: '5 new users joined the platform', time: '1 hour ago', icon: <IconUsers size={18} /> },
    { name: 'Hainanese Bliss stall updated menu', time: '3 hours ago', icon: <IconFilter size={18} /> },
  ];

  // Chart data
  const chartBars = [
    { day: 'MON', height: '120px' },
    { day: 'TUE', height: '180px' },
    { day: 'WED', height: '100px' },
    { day: 'THU', height: '150px' },
    { day: 'FRI', height: '210px' },
    { day: 'SAT', height: '130px' },
    { day: 'SUN', height: '90px' },
  ];

  return (
    <Box>
      {/* Top Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb={40}>
        {stats.map((stat, i) => (
          <Paper 
            key={i} 
            p="30px" 
            style={{ 
              backgroundColor: stat.bg,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '180px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Subtle background icon for the non-brand cards */}
            {!stat.brandCard && (
               <Box style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.03 }}>
                  {stat.icon}
               </Box>
            )}

            <Stack gap="xs">
              <Text size="sm" fw={700} style={{ color: 'var(--mm-admin-text-dimmed)' }}>{stat.title}</Text>
              <Title order={2} style={{ fontSize: '36px', fontWeight: 900, color: 'var(--mm-admin-text-main)' }}>
                {stat.value}
              </Title>
            </Stack>

            <Group gap="xs" mt="md">
              <Badge 
                variant="light" 
                color={stat.brandCard ? 'olive' : 'sage'} 
                radius="xl" 
                size="md"
                leftSection={stat.icon}
                style={{ 
                  backgroundColor: stat.brandCard ? 'var(--mm-admin-sidebar)' : 'rgba(155, 176, 165, 0.15)',
                  color: stat.brandCard ? '#fff' : 'var(--mm-admin-sidebar)',
                  padding: '6px 12px',
                  height: 'auto',
                  overflow: 'visible',
                  whiteSpace: 'normal',
                  lineHeight: 1.4,
                }}
              >
                {stat.sub}
              </Badge>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Middle Row: Chart & Activity */}
      <Grid gutter="xl" mb={40}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="40px" radius="32px">
            <Group justify="space-between" mb="40px">
              <Title order={3} style={{ fontSize: '22px', fontWeight: 800, color: 'var(--mm-admin-sidebar)' }}>Stall Performance</Title>
              <Select 
                size="sm" 
                radius="xl" 
                defaultValue="Last 7 Days"
                data={['Last 7 Days', 'Last 30 Days']} 
                variant="filled"
                style={{ width: '150px' }}
                styles={{ input: { border: 'none', fontWeight: 600 } }}
              />
            </Group>
            
            <Box style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '0 10px' }}>
              {chartBars.map((bar, i) => (
                <Stack key={i} flex={1} align="center" gap="md">
                  <Box 
                    style={{ 
                      width: '100%', 
                      height: bar.height, 
                      backgroundColor: i === 4 ? 'var(--mm-admin-sidebar)' : 'var(--mm-admin-sage)',
                      borderRadius: '16px 16px 16px 16px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }} 
                  />
                  <Text size="xs" fw={800} style={{ color: 'var(--mm-admin-text-dimmed)' }}>{bar.day}</Text>
                </Stack>
              ))}
            </Box>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper p="40px" radius="32px">
            <Title order={3} mb="30px" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--mm-admin-sidebar)' }}>Recent Activity</Title>
            <Stack gap="xl">
              {activities.map((act, i) => (
                <Group key={i} align="center" wrap="nowrap">
                  <Box 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--mantine-color-default)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--mm-admin-sidebar)'
                    }}
                  >
                    {act.icon}
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" style={{ lineHeight: 1.4, color: 'var(--mm-admin-text-main)', fontWeight: 500 }}>
                      <Text span fw={800}>{act.name}</Text> {act.action} <Text span fw={800} style={{ color: 'var(--mm-admin-sidebar)' }}>{act.target}</Text>
                    </Text>
                    <Text size="xs" style={{ color: 'var(--mm-admin-text-dimmed)', marginTop: '2px' }}>{act.time}</Text>
                  </Box>
                </Group>
              ))}
            </Stack>
            <UnstyledButton mt={40} style={{ width: '100%' }}>
              <Group justify="center" gap="xs" style={{ color: 'var(--mm-admin-sidebar)', fontWeight: 800, fontSize: '15px' }}>
                View All Activity
              </Group>
            </UnstyledButton>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Bottom Row: Table */}
      <Paper p="40px" radius="32px">
        <Group justify="space-between" mb="30px">
          <Title order={3} style={{ fontSize: '22px', fontWeight: 800, color: 'var(--mm-admin-sidebar)' }}>Top Performing Stalls</Title>
          <Group gap="sm">
            <ActionIcon variant="subtle" size="lg" color="gray"><IconFilter size={20} /></ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="gray"><IconSearch size={20} /></ActionIcon>
          </Group>
        </Group>

        <Table verticalSpacing="md" style={{ backgroundColor: 'transparent' }}>
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: 'transparent' }}>
              <Table.Th>STALL NAME</Table.Th>
              <Table.Th>CATEGORY</Table.Th>
              <Table.Th>BOOKMARKS</Table.Th>
              <Table.Th>RATING</Table.Th>
              <Table.Th>STATUS</Table.Th>
              <Table.Th>ACTIONS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {topStalls.map((stall, i) => (
              <Table.Tr key={i} style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Table.Td style={{ borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                  <Group gap="md">
                    <Avatar radius="md" size="lg" src={stall.avatar} bg="gray.1" />
                    <Text fw={800} size="sm" style={{ color: 'var(--mm-admin-text-main)' }}>{stall.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td><Text size="sm" fw={600} style={{ color: 'var(--mm-admin-text-dimmed)' }}>{stall.category}</Text></Table.Td>
                <Table.Td><Title order={4} size="sm" fw={800}>{stall.bookmarks}</Title></Table.Td>
                <Table.Td>
                  <Text size="sm" fw={800} style={{ color: '#E4A11B' }}>☆ {stall.rating}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    variant="filled" 
                    color={stall.status === 'ACTIVE' ? 'sage' : 'red'} 
                    size="sm" 
                    radius="sm"
                    style={{ backgroundColor: stall.status === 'ACTIVE' ? 'var(--mm-admin-sage)' : '#FF6B6B' }}
                  >
                    {stall.status}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                  <ActionIcon variant="subtle" color="gray"><IconDots size={20} /></ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
