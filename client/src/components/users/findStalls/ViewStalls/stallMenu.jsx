import React, { useState } from 'react';
import {
  Grid, Image, Text, Group,
  Stack, Box, rem, UnstyledButton
} from '@mantine/core';

/**
 * COMPONENT: Stall Menu (FR09) — Sidebar Category + Item Row Layout
 */
const StallMenu = ({ items }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  if (!items || items.length === 0) {
    return (
      <Box py={rem(40)} ta="center">
        <Text c="dimmed" fz="sm" fs="italic">
          No menu items available for this stall yet.
        </Text>
      </Box>
    );
  }

  const categories = ['All', ...new Set(items.map(i => i.category || 'Others'))];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => (i.category || 'Others') === activeCategory);

  return (
    <Box
      style={{
        border: '1px solid #e9ecef',
        borderRadius: rem(12),
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Grid m={0} style={{ minHeight: rem(300) }}>
        {/* LEFT: Category Sidebar */}
        <Grid.Col
          span={{ base: 12, sm: 3 }}
          style={{
            borderRight: '1px solid #e9ecef',
            padding: rem(16),
            backgroundColor: '#fafafa',
          }}
        >
          <Stack gap={4}>
            {categories.map(cat => (
              <UnstyledButton
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: `${rem(8)} ${rem(12)}`,
                  borderRadius: rem(8),
                  backgroundColor: activeCategory === cat ? '#e8f5f0' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <Text
                  fz="sm"
                  fw={activeCategory === cat ? 700 : 400}
                  c={activeCategory === cat ? 'var(--mm-color-primary)' : 'dimmed'}
                >
                  {cat}
                </Text>
              </UnstyledButton>
            ))}
          </Stack>
        </Grid.Col>

        {/* RIGHT: Menu Item Rows */}
        <Grid.Col span={{ base: 12, sm: 9 }} style={{ padding: 0 }}>
          <Stack gap={0}>
            {filteredItems.map((item, idx) => (
              <Box
                key={item.menuID || idx}
                style={{
                  borderBottom: idx < filteredItems.length - 1 ? '1px solid #f1f3f5' : 'none',
                  padding: `${rem(14)} ${rem(20)}`,
                }}
              >
                <Group wrap="nowrap" gap="md" align="flex-start">
                  {/* Food Image */}
                  <Image
                    src={item.menuPic || 'https://placehold.co/80x80?text=Food'}
                    w={80}
                    h={80}
                    radius="md"
                    alt={item.menuName}
                    style={{ flexShrink: 0, objectFit: 'cover' }}
                  />

                  {/* Item Details */}
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fz="sm" fw={700} mb={2} truncate="end">
                      {item.menuName}
                    </Text>
                    <Text fz="xs" c="dimmed" lineClamp={2} style={{ lineHeight: 1.5 }}>
                      {item.itemDescription || 'No description available'}
                    </Text>
                  </Box>

                  {/* Price */}
                  <Text
                    fz="sm"
                    fw={700}
                    style={{
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      color: '#1a1a1a',
                    }}
                  >
                    RM {parseFloat(item.menuPrice || 0).toFixed(2)}
                  </Text>
                </Group>
              </Box>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default StallMenu;
