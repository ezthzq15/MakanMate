import React from 'react';
import { 
  Container, 
  Group, 
  Title, 
  ActionIcon, 
  SimpleGrid, 
  Card, 
  Image, 
  Stack, 
  Text,
  Box
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

const TrendingDeals = ({ data }) => {
  if (!data) return null;

  const SectionHeader = ({ title }) => (
    <Group justify="space-between" mb="40px">
      <Title order={2} style={{ fontSize: '32px', fontWeight: 800, color: 'var(--mm-text-main)' }}>
        {title}
      </Title>
    </Group>
  );

  const StyledCard = ({ item, rank }) => (
    <Card 
      padding="xl" 
      radius="32px" 
      style={{ 
        backgroundColor: '#fff', 
        border: 'none',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box style={{ position: 'relative', marginBottom: '20px' }}>
        {rank !== undefined && (
          <Box style={{ 
            position: 'absolute', 
            top: -10, 
            left: -10, 
            zIndex: 10,
            backgroundColor: '#0f4c5c', 
            color: 'white', 
            width: 32, 
            height: 32, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 800,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            {rank}
          </Box>
        )}
        <Image 
          src={item.image} 
          radius="24px" 
          h={220} 
          w="100%"
          fallbackSrc="https://placehold.co/600x400?text=Food"
        />
      </Box>

      <Stack gap="xs">
        <Text fw={800} size="lg" style={{ color: 'var(--mm-text-main)', fontSize: '20px' }}>
          {item.name}
        </Text>
        <Text size="sm" lineClamp={3} style={{ color: 'var(--mm-text-dimmed)', lineHeight: 1.6 }}>
          {item.description}
        </Text>
      </Stack>
    </Card>
  );

  return (
    <Box py={80} style={{ backgroundColor: '#fcfcfc' }}>
      {/* 4. Similar Restaurants */}
      <Container size="xl" mb={100}>
        <SectionHeader title="Similar Restaurants Near You" />
        <Box style={{ position: 'relative' }}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
            {data.nearbyRestaurants.map((res) => (
              <StyledCard key={res.id} item={res} />
            ))}
          </SimpleGrid>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="xl" 
            radius="xl"
            style={{ 
              position: 'absolute', 
              right: -60, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }}
          >
            <IconChevronRight size={32} stroke={1.5} />
          </ActionIcon>
        </Box>
      </Container>

      {/* 5. Trending Foods */}
      <Container size="xl">
        <SectionHeader title="Trending Foods" />
        <Box style={{ position: 'relative' }}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
            {data.trendingFoods.map((food, i) => (
              <StyledCard key={food.id} item={food} rank={i + 1} />
            ))}
          </SimpleGrid>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="xl" 
            radius="xl"
            style={{ 
              position: 'absolute', 
              right: -60, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }}
          >
            <IconChevronRight size={32} stroke={1.5} />
          </ActionIcon>
        </Box>
      </Container>
    </Box>
  );
};

export default TrendingDeals;
