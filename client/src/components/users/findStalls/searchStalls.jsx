import React from 'react';
import { 
  SimpleGrid, Card, Image, Text, Badge, Group, 
  Stack, Box, ActionIcon, rem, useMantineTheme,
  Skeleton, Center, Transition
} from '@mantine/core';
import { 
  IconStarFilled, IconMapPin, IconHeart, IconCertificate,
  IconFlame, IconWallet, IconToolsKitchen2
} from '@tabler/icons-react';
import { isAuthenticated } from '../../../utils/auth';

import { useNavigate } from 'react-router-dom';

/**
 * UI: Result Grid & Stall Cards
 */
const SearchStalls = ({ stalls, loading }) => {
  const theme = useMantineTheme();

  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} radius="lg" p="md" withBorder>
            <Skeleton height={180} radius="md" mb="md" />
            <Skeleton height={20} width="70%" mb="sm" />
            <Skeleton height={15} width="40%" />
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (stalls.length === 0) {
    return (
      <Center py={100}>
        <Stack align="center" gap="xs">
          <IconToolsKitchen2 size={60} color={theme.colors.gray[3]} />
          <Text fw={800} size="xl" c="dimmed">No stalls found</Text>
          <Text c="dimmed">Try adjusting your filters or search terms.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
      {stalls.map((stall, idx) => (
        <StallCard key={stall.stallID || idx} stall={stall} />
      ))}
    </SimpleGrid>
  );
};

const StallCard = ({ stall }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  
  // Logic for badges
  const isTopPick = (stall.rating || 0) >= 4.5;

  // Favorite Icon (Only for Auth Users)
  const isAuth = isAuthenticated();

  return (
    <Transition mounted={true} transition="fade" duration={400}>
      {(styles) => (
        <Card 
          radius="lg" 
          p={0} 
          withBorder 
          shadow="sm" 
          onClick={() => navigate(`/stall-detail/${stall.id}`)}
          style={{ 
            ...styles, 
            overflow: 'hidden', 
            border: 'none', 
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          {/* Image Section */}
          <Box style={{ position: 'relative' }}>
            <Image
              src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400'}
              height={180}
              alt={stall.name}
              fallbackSrc="https://placehold.co/400x200?text=No+Image"
            />
            
            {/* Top Pick Badge */}
            {isTopPick && (
              <Badge 
                color="yellow" 
                variant="filled" 
                size="sm" 
                leftSection={<IconStarFilled size={10} />}
                style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}
              >
                TOP PICK
              </Badge>
            )}

            {/* Favorite Icon */}
            {isAuth && (
              <ActionIcon 
                variant="transparent" 
                color="white" 
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
              >
                <IconHeart size={22} stroke={2} />
              </ActionIcon>
            )}
          </Box>

          {/* Content Section */}
          <Stack p="md" gap="xs">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Text fw={800} size="md" lineClamp={1} style={{ color: 'var(--mm-color-primary)' }}>
                {stall.name}
              </Text>
              <Badge 
                variant="light" 
                color="yellow" 
                size="sm" 
                radius="sm" 
                leftSection={<IconStarFilled size={10} />}
              >
                {stall.rating || '4.0'}
              </Badge>
            </Group>

            <Group gap="xs">
              <Badge 
                variant="light" 
                color={stall.halal ? 'green' : 'red'} 
                size="xs" 
                radius="xs"
              >
                {stall.halal ? 'Halal' : 'Non-Halal'}
              </Badge>
            </Group>

            <Group justify="space-between" mt={5}>
              <Group gap={4}>
                <IconMapPin size={14} color={theme.colors.gray[5]} />
                <Text size="xs" c="dimmed" fw={600}>{stall.distance || '1.2km'} away</Text>
              </Group>
              <Text size="xs" fw={800} color="gray.6">{stall.priceRange || '$$'}</Text>
            </Group>

            <Text size="xs" c="dimmed" fw={600} mt={2}>
              {Array.isArray(stall.cuisine) ? stall.cuisine.join(', ') : stall.cuisine} • {stall.category || 'Street Food'}
            </Text>
          </Stack>
        </Card>
      )}
    </Transition>
  );
};

export default SearchStalls;
