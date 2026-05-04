import React, { useState } from 'react';
import {
  Grid, Image, Text, Group,
  Stack, Box, rem, ActionIcon, Tooltip
} from '@mantine/core';
import { IconHeartFilled, IconHeart } from '@tabler/icons-react';
import './styles.css';

/**
 * COMPONENT: Revamped Stall Menu (FR09) — with Love (Like) functionality
 */
const StallMenu = ({ items, onRefresh, onLike }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  if (!items || items.length === 0) {
    return (
      <Box py={rem(60)} ta="center">
        <Text c="dimmed" fz="lg" fs="italic" fw={500}>
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
    <Box className="sidebar-section" p={0} style={{ overflow: 'hidden' }}>
      <Grid m={0}>
        {/* LEFT: Category Sidebar */}
        <Grid.Col
          span={{ base: 12, sm: 3 }}
          style={{
            borderRight: '1px solid #f1f3f5',
            padding: rem(24),
            backgroundColor: '#fafafa',
          }}
        >
          <Stack gap={8}>
            {categories.map(cat => (
              <div
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </Stack>
        </Grid.Col>

        {/* RIGHT: Menu Item Rows */}
        <Grid.Col span={{ base: 12, sm: 9 }} style={{ padding: rem(24) }}>
          <Stack gap={0}>
            {filteredItems.map((item, idx) => (
              <div key={item.menuID || idx} className="menu-item-row">
                <Group wrap="nowrap" gap="xl" align="center">
                  {/* Food Image */}
                  <Image
                    src={item.menuPic || 'https://placehold.co/100x100?text=Food'}
                    w={100}
                    h={100}
                    radius="xl"
                    alt={item.menuName}
                    style={{ flexShrink: 0, objectFit: 'cover' }}
                  />

                  {/* Item Details */}
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fz="md" fw={700} mb={4}>
                      {item.menuName}
                    </Text>
                    <Text fz="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.6 }}>
                      {item.itemDescription || 'Famous local delight prepared with fresh ingredients and traditional recipe.'}
                    </Text>
                    <Group gap={6} mt={8}>
                       <IconHeartFilled size={14} color={item.likes > 0 ? "#e03131" : "#dee2e6"} />
                       <Text size="xs" fw={700} c="dimmed">{item.likes || 0} loves</Text>
                    </Group>
                  </Box>

                  {/* Price & Love Action */}
                  <Stack align="flex-end" gap={8} style={{ flexShrink: 0 }}>
                    <Text fz="md" fw={800} c="brand">
                      RM {parseFloat(item.menuPrice || 0).toFixed(2)}
                    </Text>
                    <Tooltip label="Love this item">
                       <ActionIcon 
                         variant={item.isLiked ? "filled" : "light"} 
                         color={item.isLiked ? "red" : "gray"} 
                         radius="md" 
                         size="lg"
                         onClick={() => onLike(item.menuID)}
                       >
                         <IconHeartFilled size={20} />
                       </ActionIcon>
                    </Tooltip>
                  </Stack>
                </Group>
              </div>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default StallMenu;
