import React, { useEffect, useState } from 'react';
import { Box, Title, Text, SimpleGrid, Paper, Group, ThemeIcon, Stack, Skeleton, Badge, Avatar, Rating, Divider, Center, ScrollArea } from '@mantine/core';
import { IconBuildingStore, IconToolsKitchen2, IconClock, IconMessageCircleOff } from '@tabler/icons-react';
import apiClient from '../../lib/apiClient';
import NotFoundPage from '../../pages/404';

const StallMDashboard = () => {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyStall = async () => {
      try {
        const res = await apiClient.get('/stalls/my-stall');
        const stallData = res.data.stall;
        setData(stallData);

        if (stallData?.stallID) {
          const reviewRes = await apiClient.get(`/engagement/stall/${stallData.stallID}`);
          setReviews(reviewRes.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stall info');
      } finally {
        setLoading(false);
      }
    };
    fetchMyStall();
  }, []);

  if (loading) return (
    <Stack p="xl">
      <Skeleton height={40} width="30%" radius="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="xl">
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
        <Skeleton height={120} radius="md" />
      </SimpleGrid>
    </Stack>
  );

  if (error) return <NotFoundPage />;

  return (
    <Box p="xl">
      <Group justify="space-between" mb={40}>
        <Box>
          <Title order={1} style={{ fontSize: '32px', color: '#4D6459' }}>
            Welcome back, Manager
          </Title>
          <Text c="dimmed">Here is an overview of your assigned stall.</Text>
        </Box>
        <Badge size="xl" variant="light" color="olive" radius="md">
          {data?.stallName}
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Cuisine Type</Text>
              <Text size="xl" fw={700} mt={4}>{data?.cuisineType}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="blue" variant="light">
              <IconBuildingStore size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Menu Items</Text>
              <Text size="xl" fw={700} mt={4}>{data?.totalMenuItems}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="orange" variant="light">
              <IconToolsKitchen2 size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Operating Hours</Text>
              <Text size="xl" fw={700} mt={4}>{data?.operatingHours || 'Not Set'}</Text>
            </Box>
            <ThemeIcon size="xl" radius="md" color="teal" variant="light">
              <IconClock size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="xl" radius="md" mt="xl">
        <Group justify="space-between" mb="md">
          <Title order={3} style={{ color: '#4D6459' }}>User Reviews</Title>
          <Badge variant="light" color="olive">{reviews.length} Reviews</Badge>
        </Group>

        <ScrollArea h={400} offsetScrollbars type="auto">
          {reviews.length > 0 ? (
            <Stack gap="lg" pr="md">
              {reviews.map((rev, idx) => (
                <Box key={rev.id || idx}>
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group wrap="nowrap">
                      <Avatar color="olive" radius="xl" variant="light">
                        {rev.userName?.substring(0, 2).toUpperCase() || 'AN'}
                      </Avatar>
                      <Box>
                        <Text fw={700} size="sm">{rev.userName || 'Anonymous'}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(rev.ratingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </Text>
                      </Box>
                    </Group>
                    <Rating value={rev.ratingScore || 0} readOnly size="sm" color="orange" fractions={2} />
                  </Group>
                  
                  <Text size="sm" mt="sm" style={{ lineHeight: 1.5 }}>
                    {rev.comments || <Text fs="italic" c="dimmed" component="span">No comments provided.</Text>}
                  </Text>
                  
                  {rev.imageURL && (
                    <Box mt="sm">
                      <img 
                        src={rev.imageURL} 
                        alt="Review Attachment" 
                        style={{ borderRadius: '8px', maxHeight: '150px', objectFit: 'cover' }} 
                      />
                    </Box>
                  )}
                  
                  {idx < reviews.length - 1 && <Divider mt="lg" />}
                </Box>
              ))}
            </Stack>
          ) : (
            <Center h={150}>
              <Stack align="center" gap="xs">
                <IconMessageCircleOff size={32} color="gray" opacity={0.5} />
                <Text c="dimmed" size="sm">No reviews yet for your stall.</Text>
              </Stack>
            </Center>
          )}
        </ScrollArea>
      </Paper>
    </Box>
  );
};

export default StallMDashboard;
