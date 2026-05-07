import React from 'react';
import { 
  Container, Group, Title, Text, Box, Stack,
  Button, ActionIcon
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconChevronRight, IconStar, IconMapPin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Rotate through real local food images as fallback
const FALLBACK_IMAGES = [
  '/laksa.png',
  '/mee kari.png',
  '/cendol.png',
  '/3gmbrmakanan.png',
  '/ceondol-2.png',
];
const getFallback = (index) => FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

const TrendingDeals = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return null;

  const SectionHeader = ({ title }) => (
    <Group justify="space-between" mb="xl">
      <Title order={2} style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
        {title}
      </Title>
      <Button
        variant="subtle"
        color="gray"
        rightSection={<IconChevronRight size={16} />}
        fw={700}
        size="sm"
        onClick={() => navigate('/search')}
      >
        View all
      </Button>
    </Group>
  );

  // ─── Circular stall card ───
  const StallCard = ({ item, rank, index = 0 }) => {
    const imgSrc = item.image && !item.image.includes('placehold') 
      ? item.image 
      : getFallback(index);

    return (
      <Stack
        align="center"
        gap="sm"
        style={{ cursor: 'pointer', width: 160, flexShrink: 0 }}
        onClick={() => navigate(`/stall-detail/${item.id}`)}
      >
        {/* Circular image container */}
        <Box pos="relative">
          <Box
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #f1f3f5',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              backgroundColor: '#f8f9fa',
            }}
          >
            <img
              src={imgSrc}
              alt={item.name}
              onError={(e) => { e.target.src = getFallback(index); }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>

          {/* Rank badge */}
          {rank !== undefined && (
            <Box style={{
              position: 'absolute',
              top: -4,
              left: -4,
              backgroundColor: '#2d6a4f',
              color: '#fff',
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 900,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              border: '2px solid #fff',
            }}>
              {rank}
            </Box>
          )}
        </Box>

        {/* Info */}
        <Stack gap={2} align="center" style={{ maxWidth: 150 }}>
          <Text fw={800} size="sm" ta="center" lineClamp={2}>{item.name}</Text>
          <Group gap={3} justify="center">
            <IconStar size={12} color="#fab005" fill="#fab005" />
            <Text size="xs" fw={700}>{item.rating || '4.5'}</Text>
            <Text size="xs" c="dimmed">({item.reviews || 0})</Text>
          </Group>
          {item.distance && item.distance !== '—' && (
            <Group gap={3} justify="center">
              <IconMapPin size={11} color="#aaa" />
              <Text size="xs" c="dimmed" fw={600}>{item.distance}</Text>
            </Group>
          )}
          <Text size="xs" c="dimmed">{item.cuisine || 'Malay'}</Text>
        </Stack>
      </Stack>
    );
  };

  // ─── Section with horizontal Carousel ───
  const CarouselSection = ({ title, items, showRank = false }) => (
    <Container size="xl" mb={80}>
      <SectionHeader title={title} />
      <Box style={{ position: 'relative' }}>
        <Carousel
          slideSize="auto"
          slideGap={32}
          align="start"
          containScroll="trimSnaps"
          withArrows={false}
          withIndicators={false}
          draggable
        >
          {items.map((item, i) => (
            <Carousel.Slide key={item.id}>
              <StallCard item={item} rank={showRank ? i + 1 : undefined} index={i} />
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Floating next-page arrow */}
        <ActionIcon
          variant="white"
          size={44}
          radius="xl"
          style={{
            position: 'absolute',
            right: -22,
            top: '42%',
            transform: 'translateY(-50%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid #e9ecef',
          }}
          onClick={() => navigate('/search')}
        >
          <IconChevronRight size={22} stroke={2} />
        </ActionIcon>
      </Box>
    </Container>
  );

  return (
    <Box py={60} id="recommendations">
      {data.nearbyRestaurants?.length > 0 && (
        <CarouselSection
          title="Similar Restaurants Near You"
          items={data.nearbyRestaurants}
        />
      )}
      {data.trendingFoods?.length > 0 && (
        <CarouselSection
          title="Trending Foods"
          items={data.trendingFoods}
          showRank
        />
      )}
    </Box>
  );
};

export default TrendingDeals;
