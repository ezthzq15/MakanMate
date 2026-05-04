import React, { useState } from 'react';
import { 
  Container, Grid, Image, Title, Text, 
  Group, Badge, Stack, Box, Button, 
  ActionIcon, rem, useMantineTheme, Tabs,
  Divider, Paper, Skeleton, Center
} from '@mantine/core';
import { 
  IconHeart, IconHeartFilled, IconShare, 
  IconStarFilled, IconMapPin, IconClock, 
  IconToolsKitchen2, IconInfoCircle, IconCircleCheck
} from '@tabler/icons-react';
import { useViewStalls } from '../../../../hooks/users/useViewStalls';
import StallMenu from './stallMenu';
import RateAndReviewStalls from './rate&reviewStalls';

/**
 * COMPONENT: Detailed Stall View (FR09)
 */
const ViewStalls = ({ stallId }) => {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState('menu');
  const { stall, loading, isSaved, toggleBookmark, refresh } = useViewStalls(stallId);

  // After review submission: refresh stall data but STAY on the reviews tab
  const handleReviewSuccess = () => {
    refresh();
    setActiveTab('reviews');
  };

  if (loading) {
    return (
      <Container size="xl" py={40}>
        <Skeleton height={400} radius="xl" mb="xl" />
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Skeleton height={50} width="60%" mb="md" />
            <Skeleton height={20} width="40%" mb="xl" />
            <Skeleton height={200} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={300} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!stall) return <Center h="50vh"><Text>Stall not found.</Text></Center>;

  return (
    <Container size="xl" py={20}>
      <Stack gap="xl">
        {/* 1. Hero Image */}
        <Box style={{ position: 'relative', borderRadius: rem(24), overflow: 'hidden' }}>
          <Image
            src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200'}
            height={450}
            alt={stall.stallName}
            style={{ objectFit: 'cover' }}
          />
          <Badge 
            variant="filled" 
            color={stall.isHalal ? 'green' : 'red'} 
            size="lg"
            radius="md"
            style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}
          >
            {stall.isHalal ? 'HALAL' : 'NON-HALAL'}
          </Badge>
        </Box>

        <Grid gutter={40}>
          {/* LEFT SIDE: Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              {/* Header & Actions */}
              <Group justify="space-between" align="center">
                <Title order={1} style={{ fontSize: rem(42), fontWeight: 900 }}>
                  {stall.stallName}
                </Title>
                <Group gap="sm">
                  <Button 
                    variant="light" 
                    color="gray" 
                    radius="xl" 
                    leftSection={<IconShare size={18} />}
                  >
                    Share
                  </Button>
                  <Button 
                    variant={isSaved ? 'filled' : 'outline'} 
                    color={isSaved ? 'brand' : 'gray'} 
                    radius="xl" 
                    leftSection={isSaved ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                    onClick={toggleBookmark}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </Group>
              </Group>

              {/* Info Badges */}
              <Group gap="sm">
                <Badge size="xl" radius="md" color="brand" variant="light" leftSection={<IconMapPin size={14} />}>
                  {stall.distance || '1.2km'} away
                </Badge>
                <Badge size="xl" radius="md" color="green" variant="light">
                  {stall.isHalal ? 'Muslim Friendly' : 'Non-Halal'}
                </Badge>
                <Badge size="xl" radius="md" color="gray" variant="light">
                  {stall.budgetRange || 'RM 10 - RM 30'}
                </Badge>
                <Badge size="xl" radius="md" color="yellow" variant="light" leftSection={<IconClock size={14} />}>
                  {stall.operatingHours || '10:00 AM - 9:00 PM'}
                </Badge>
                <Badge size="xl" radius="md" color="brand" variant="filled" leftSection={<IconStarFilled size={14} />}>
                  {stall.rating || '4.0'} ({stall.reviewCount || 0} reviews)
                </Badge>
              </Group>

              <Text size="lg" c="dimmed" style={{ lineHeight: 1.6 }}>
                {stall.description || 'No description available for this stall.'}
              </Text>

              {/* Most Ordered Section (Placeholder logic for FYP) */}
              <Box mt="xl">
                <Title order={3} mb="lg">Most Ordered</Title>
                <Group gap="md">
                   {stall.menu?.slice(0, 3).map(item => (
                     <Paper key={item.menuID} withBorder p="md" radius="md" style={{ width: 200 }}>
                        <Image src={item.menuPic} height={100} radius="md" mb="xs" />
                        <Text fw={700} size="sm" truncate>{item.menuName}</Text>
                        <Text size="xs" c="brand" fw={800}>RM {parseFloat(item.menuPrice).toFixed(2)}</Text>
                     </Paper>
                   ))}
                </Group>
              </Box>

              {/* Tabs Section */}
              <Tabs value={activeTab} onChange={setActiveTab} color="brand" mt="xl" styles={{ tab: { fontWeight: 700, fontSize: rem(16) } }}>
                <Tabs.List>
                  <Tabs.Tab value="menu">Menu</Tabs.Tab>
                  <Tabs.Tab value="photos">Photos (24)</Tabs.Tab>
                  <Tabs.Tab value="reviews">Reviews ({stall.reviewCount || 0})</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="menu" pt="xl">
                  <StallMenu items={stall.menu} />
                </Tabs.Panel>

                <Tabs.Panel value="reviews" pt="xl">
                  <Stack gap="xl">
                    <RateAndReviewStalls stallId={stallId} stallName={stall.stallName} onReviewSuccess={handleReviewSuccess} />
                    {/* Placeholder for list of reviews would go here */}
                    <Text ta="center" c="dimmed" fs="italic">The review section is loaded in the Reviews tab above.</Text>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Grid.Col>

          {/* RIGHT SIDE: Info Panel */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="xl">
              {/* Map Placeholder */}
              <Paper withBorder radius="xl" style={{ overflow: 'hidden', height: 250, backgroundColor: theme.colors.gray[0] }}>
                <Center h="100%">
                  <Stack align="center" gap={4}>
                    <IconMapPin size={40} color={theme.colors.brand[6]} />
                    <Text fw={700}>Map View</Text>
                    <Text size="xs" c="dimmed">Integration coming soon</Text>
                  </Stack>
                </Center>
              </Paper>

              <Paper withBorder p="xl" radius="xl">
                <Stack gap="md">
                  <Title order={4}>About Stall</Title>
                  <Group gap={40}>
                    <Box>
                       <Text size="xs" c="dimmed" fw={700} tt="uppercase">Cuisine</Text>
                       <Text fw={600}>{stall.cuisineType || 'Malay'}</Text>
                    </Box>
                    <Box>
                       <Text size="xs" c="dimmed" fw={700} tt="uppercase">Spice Level</Text>
                       <Text fw={600}>{stall.spiceLevel || 'Medium'}</Text>
                    </Box>
                  </Group>
                  <Divider variant="dashed" />
                  <Box>
                     <Text size="xs" c="dimmed" fw={700} tt="uppercase">Opening Hours</Text>
                     <Text fw={600}>{stall.operatingHours || '10:00 AM - 9:00 PM'}</Text>
                  </Box>
                  <Divider variant="dashed" />
                  <Box>
                     <Text size="xs" c="dimmed" fw={700} tt="uppercase">Contact</Text>
                     <Text fw={600}>+60 12-345 6789</Text>
                  </Box>
                </Stack>
              </Paper>

              <Paper withBorder p="xl" radius="xl">
                <Title order={4} mb="md">Why people love it</Title>
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconCircleCheck size={20} color="green" />
                    <Text size="sm" fw={500}>Authentic Penang taste</Text>
                  </Group>
                  <Group gap="xs">
                    <IconCircleCheck size={20} color="green" />
                    <Text size="sm" fw={500}>Fresh homemade ingredients</Text>
                  </Group>
                  <Group gap="xs">
                    <IconCircleCheck size={20} color="green" />
                    <Text size="sm" fw={500}>Consistent quality</Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default ViewStalls;
