import { 
  Box, Grid, Paper, Text, Title, Group, Stack, Badge, 
  Avatar, Table, ActionIcon, Select, UnstyledButton, SimpleGrid
} from '@mantine/core';
import { 
  IconTrendingUp, IconUsers, IconBookmark, IconFlame, 
  IconDots, IconSearch, IconFilter, IconArrowRight
} from '@tabler/icons-react';

const AdminDashboard = () => {
  // Summary Data
  const stats = [
    { title: 'Total Stalls', value: '25', sub: '+2 this week', icon: <IconTrendingUp size={20} />, badge: 'green' },
    { title: 'Total Users', value: '1.2k', sub: 'Active now', icon: <IconUsers size={20} />, badge: 'yellow' },
    { title: 'Bookmarks Today', value: '45', sub: 'High activity', icon: <IconBookmark size={20} />, badge: 'blue' },
    { title: 'Most Popular', value: 'Char Koay Teow', sub: 'Trending', icon: <IconFlame size={20} />, brandCard: true },
  ];

  // Table Data
  const topStalls = [
    { name: 'Old Town Laksa', category: 'Noodles', bookmarks: '842', rating: '4.9', status: 'ACTIVE', color: 'green' },
    { name: 'Green Harvest', category: 'Healthy', bookmarks: '615', rating: '4.7', status: 'ACTIVE', color: 'green' },
    { name: 'Big Bite Burgers', category: 'Western', bookmarks: '528', rating: '4.5', status: 'INACTIVE', color: 'red' },
  ];

  // Activities Data
  const activities = [
    { name: 'Sarah J.', action: 'bookmarked', target: 'Old Town Laksa', time: '2 minutes ago', icon: <IconBookmark size={16} /> },
    { name: 'New review', action: 'for', target: "Auntie's Char Koay Teow", time: '15 minutes ago', icon: <IconTrendingUp size={16} /> },
    { name: '5 new users', action: 'joined the', target: 'platform', time: '1 hour ago', icon: <IconUsers size={16} /> },
    { name: 'Hainanese Bliss', action: 'stall', target: 'updated menu', time: '3 hours ago', icon: <IconFilter size={16} /> },
  ];

  // Mock-chart data
  const chartBars = [
    { day: 'MON', height: '40%' },
    { day: 'TUE', height: '70' },
    { day: 'WED', height: '50%' },
    { day: 'THU', height: '65%' },
    { day: 'FRI', height: '90%' },
    { day: 'SAT', height: '55%' },
    { day: 'SUN', height: '45%' },
  ];

  return (
    <Box>
      {/* Top Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb={40}>
        {stats.map((stat, i) => (
          <Paper 
            key={i} 
            p="30px" 
            radius="32px" 
            style={{ 
              backgroundColor: stat.brandCard ? '#E9E2D0' : '#fff',
              border: '1px solid #f1f3f5'
            }}
          >
            <Stack gap="xs">
              <Text size="sm" fw={600} style={{ color: stat.brandCard ? '#4D6459' : '#868e96' }}>{stat.title}</Text>
              <Title order={2} style={{ fontSize: '32px', fontWeight: 900, color: stat.brandCard ? '#4D6459' : '#212529' }}>
                {stat.value}
              </Title>
              <Group gap="xs">
                {stat.brandCard ? (
                  <Badge variant="filled" color="#4D6459" radius="sm" size="sm">Trending</Badge>
                ) : (
                  <Badge 
                    variant="light" 
                    color={stat.badge} 
                    radius="sm" 
                    size="sm"
                    leftSection={stat.icon}
                  >
                    {stat.sub}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Middle Row: Chart & Activity */}
      <Grid gutter="xl" mb={40}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="40px" radius="32px" withBorder>
            <Group justify="space-between" mb="30px">
              <Title order={3} style={{ fontSize: '20px', fontWeight: 800 }}>Stall Performance</Title>
              <Select 
                size="xs" 
                radius="xl" 
                placeholder="Last 7 Days" 
                data={['Last 7 Days', 'Last 30 Days']} 
                defaultValue="Last 7 Days"
                style={{ width: '130px' }}
              />
            </Group>
            
            {/* Custom Bar Chart placeholder */}
            <Box style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px' }}>
              {chartBars.map((bar, i) => (
                <Stack key={i} flex={1} align="center" gap="xs">
                  <Box 
                    style={{ 
                      width: '100%', 
                      height: bar.height === '70' ? '180px' : bar.height, 
                      backgroundColor: i === 4 ? '#4D6459' : '#9bb0a5',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                  <Text size="xs" fw={700} color="dimmed" mt={10}>{bar.day}</Text>
                </Stack>
              ))}
            </Box>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper p="40px" radius="32px" withBorder style={{ height: '100%' }}>
            <Title order={3} mb="xl" style={{ fontSize: '20px', fontWeight: 800 }}>Recent Activity</Title>
            <Stack gap="xl">
              {activities.map((act, i) => (
                <Group key={i} align="flex-start" wrap="nowrap">
                  <Avatar radius="md" size={32} style={{ backgroundColor: '#f1f3f5' }}>
                    {act.icon}
                  </Avatar>
                  <Box>
                    <Text size="sm" style={{ lineHeight: 1.4 }}>
                      <Text span fw={700}>{act.name}</Text> {act.action} <Text span fw={700} color="#4D6459">{act.target}</Text>
                    </Text>
                    <Text size="xs" color="dimmed">{act.time}</Text>
                  </Box>
                </Group>
              ))}
            </Stack>
            <UnstyledButton mt={40} style={{ width: '100%' }}>
              <Group justify="center" gap="xs" style={{ color: '#4D6459', fontWeight: 700, fontSize: '14px' }}>
                View All Activity <IconArrowRight size={14} />
              </Group>
            </UnstyledButton>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Bottom Row: Table */}
      <Paper p="40px" radius="32px" withBorder>
        <Group justify="space-between" mb="30px">
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800 }}>Top Performing Stalls</Title>
          <Group gap="sm">
            <ActionIcon variant="light" color="gray" radius="md"><IconFilter size={18} /></ActionIcon>
            <ActionIcon variant="light" color="gray" radius="md"><IconSearch size={18} /></ActionIcon>
          </Group>
        </Group>

        <Table verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>STALL NAME</Table.Th>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>CATEGORY</Table.Th>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>BOOKMARKS</Table.Th>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>RATING</Table.Th>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>STATUS</Table.Th>
              <Table.Th style={{ color: '#868e96', fontSize: '11px', letterSpacing: '1px' }}>ACTIONS</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {topStalls.map((stall, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar radius="md" size="md" src={null}>S</Avatar>
                    <Text fw={700} size="sm">{stall.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td><Text size="sm">{stall.category}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={700}>{stall.bookmarks}</Text></Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Text size="sm" fw={700} color="yellow.8">★ {stall.rating}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color={stall.color} size="sm" radius="sm">
                    {stall.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <ActionIcon variant="subtle" color="gray"><IconDots size={18} /></ActionIcon>
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
