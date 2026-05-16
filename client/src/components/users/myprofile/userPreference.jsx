import React, { useState, useEffect } from 'react';
import { 
  Container, Title, Text, Box, SimpleGrid, UnstyledButton, Group, Stack, 
  Button, Paper, Center, Loader, Badge, Card, Image, ActionIcon,
  Divider, Transition, ThemeIcon, rem, Tooltip, Radio
} from '@mantine/core';
import { 
  IconToolsKitchen2, IconBowl, IconMeat, IconFish, IconSoup, IconCertificate, 
  IconFlame, IconWallet, IconMapPin, IconChevronRight, IconCheck, IconRefresh,
  IconSparkles, IconInfoCircle, IconChefHat, IconCoffee
} from '@tabler/icons-react';
import { usePreferences } from '../../../hooks/users/usePreferences';

/**
 * UC004: Set/Update User Preference
 * Premium Implementation for MakanMate FYP
 */

const CUISINES = [
  { name: 'Malay', icon: IconToolsKitchen2, color: 'teal' },
  { name: 'Chinese', icon: IconBowl, color: 'red' },
  { name: 'Indian', icon: IconChefHat, color: 'orange' },
  { name: 'Western', icon: IconMeat, color: 'blue' },
  { name: 'Japanese', icon: IconFish, color: 'cyan' },
  { name: 'Thai', icon: IconSoup, color: 'yellow' },
  { name: 'Pastries & Cafe', icon: IconCoffee, color: 'pink' },
];

const SPICE_LEVELS = [
  { value: 'LOW', label: 'Mild', color: 'green', desc: 'No heat, family friendly' },
  { value: 'MEDIUM', label: 'Spicy', color: 'orange', desc: 'Pleasant kick' },
  { value: 'HIGH', label: 'Extra Hot', color: 'red', desc: 'Challenge accepted!' },
];

const BUDGET_RANGES = [
  { value: 'RM5–10', label: 'Economical', icon: IconWallet },
  { value: 'RM10–20', label: 'Standard', icon: IconWallet },
  { value: 'RM20–30', label: 'Premium', icon: IconWallet },
  { value: 'RM30+', label: 'Luxury', icon: IconWallet },
];

// Mock data for Intelligence (UC005 Preview)
const MOCK_RECOMMENDATIONS = [
  { name: 'Nasi Lemak Wanjo', price: 'RM8', dist: '1.2km', type: 'Malay', halal: true, img: 'https://images.unsplash.com/photo-1626700051175-656fc74e0b63?w=200&q=80' },
  { name: 'Sushi Mentai', price: 'RM15', dist: '0.8km', type: 'Japanese', halal: false, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80' },
  { name: 'Kapitan Tandoori', price: 'RM18', dist: '2.5km', type: 'Indian', halal: true, img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&q=80' },
  { name: 'OldTown White Coffee', price: 'RM12', dist: '0.5km', type: 'Chinese', halal: true, img: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=200&q=80' },
];

const UserPreference = () => {
  const {
    cuisines,
    halal,
    spiceLevel,
    budgetRange,
    loading,
    saving,
    hasChanges,
    toggleCuisine,
    setHalal,
    setSpiceLevel,
    setBudgetRange,
    handleSave,
    resetPreferences
  } = usePreferences();

  // Logic for Intelligence Preview
  const recommendations = MOCK_RECOMMENDATIONS.filter(item => 
    cuisines.length === 0 || cuisines.includes(item.type)
  ).slice(0, 2);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader color="olive" size="xl" type="bars" />
          <Text fw={700} c="dimmed">Analyzing your taste buds...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap={40}>
        {/* Header Section */}
        <Group justify="space-between" align="flex-end">
          <Box>
            <Group gap="xs">
              <ThemeIcon variant="light" color="olive" size="xl" radius="md">
                <IconSparkles size={24} />
              </ThemeIcon>
              <Title order={1} style={{ fontSize: rem(32), fontWeight: 900 }}>Taste Profile</Title>
            </Group>
            <Text c="dimmed" mt={5}>Customize how MakanMate discovers food for you.</Text>
          </Box>
          
          <Group gap="sm">
            <Button 
              variant="subtle" 
              color="gray" 
              leftSection={<IconRefresh size={16} />} 
              onClick={resetPreferences}
              disabled={!hasChanges || saving}
              radius="md"
            >
              Reset
            </Button>
            <Button 
              color="olive" 
              size="md" 
              radius="md" 
              onClick={handleSave}
              loading={saving}
              disabled={!hasChanges}
              leftSection={<IconCheck size={18} />}
              style={{ transition: 'all 0.2s ease' }}
            >
              Save Preferences
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          {/* Main Configuration (Left Col) */}
          <Stack gap="xl" style={{ gridColumn: 'span 2' }}>
            
            {/* 1. Cuisine Selection */}
            <Paper p="xl" radius="lg" withBorder shadow="sm">
              <Group mb="lg" justify="space-between">
                <Stack gap={0}>
                  <Text fw={800} size="lg" style={{ color: 'var(--mm-admin-sidebar)' }}>Cuisine Preferences</Text>
                  <Text size="xs" c="dimmed">Pick your favorite food cultures (Multi-select)</Text>
                </Stack>
                <Badge variant="light" color="olive">{cuisines.length} Selected</Badge>
              </Group>

              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                {CUISINES.map((item) => {
                  const isActive = cuisines.includes(item.name);
                  return (
                    <UnstyledButton
                      key={item.name}
                      onClick={() => toggleCuisine(item.name)}
                      p="md"
                      radius="md"
                      style={{
                        backgroundColor: isActive ? `var(--mantine-color-${item.color}-0)` : 'var(--mantine-color-gray-0)',
                        border: isActive ? `2px solid var(--mantine-color-${item.color}-5)` : '2px solid transparent',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: rem(10),
                      }}
                      sx={(theme) => ({
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows.sm,
                          backgroundColor: isActive ? theme.colors[item.color][1] : theme.colors.gray[1]
                        }
                      })}
                    >
                      <item.icon 
                        size={32} 
                        color={isActive ? `var(--mantine-color-${item.color}-6)` : 'var(--mantine-color-gray-5)'} 
                        stroke={1.5}
                      />
                      <Text fw={700} size="sm" c={isActive ? `${item.color}.9` : 'gray.7'}>{item.name}</Text>
                    </UnstyledButton>
                  );
                })}
              </SimpleGrid>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
              {/* 2. Spice Level */}
              <Paper p="xl" radius="lg" withBorder shadow="sm">
                <Group mb="md" gap="xs">
                  <IconFlame size={20} color="red" />
                  <Text fw={800} style={{ color: 'var(--mm-admin-sidebar)' }}>Spice Sensitivity</Text>
                </Group>
                
                <Stack gap="xs">
                  {SPICE_LEVELS.map((level) => (
                    <UnstyledButton
                      key={level.value}
                      onClick={() => setSpiceLevel(level.value)}
                      p="sm"
                      radius="md"
                      style={{
                        backgroundColor: spiceLevel === level.value ? `var(--mantine-color-${level.color}-0)` : 'transparent',
                        border: `1px solid ${spiceLevel === level.value ? `var(--mantine-color-${level.color}-3)` : 'var(--mantine-color-gray-2)'}`,
                      }}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Radio 
                          checked={spiceLevel === level.value} 
                          onChange={() => {}} // Controlled by button
                          color={level.color}
                          size="sm"
                        />
                        <Box>
                          <Text fw={700} size="sm">{level.label}</Text>
                          <Text size="xs" c="dimmed">{level.desc}</Text>
                        </Box>
                      </Group>
                    </UnstyledButton>
                  ))}
                </Stack>
              </Paper>

              {/* 3. Halal & Budget */}
              <Stack gap="xl">
                {/* Halal Toggle Card */}
                <Paper p="xl" radius="lg" withBorder shadow="sm" style={{ 
                  backgroundColor: halal ? 'var(--mantine-color-green-0)' : 'white',
                  border: halal ? '1px solid var(--mantine-color-green-3)' : '1px solid var(--mantine-color-gray-2)',
                  transition: 'all 0.3s ease'
                }}>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm">
                      <ThemeIcon color={halal ? 'green' : 'gray'} variant="light" size="lg" radius="md">
                        <IconCertificate size={20} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={800} size="md">Halal Only</Text>
                        <Text size="xs" c="dimmed">Strictly show certified outlets</Text>
                      </Box>
                    </Group>
                    <Radio.Group value={halal ? 'yes' : 'no'} onChange={(val) => setHalal(val === 'yes')}>
                      <Group>
                        <Radio value="yes" label="Yes" color="green" />
                        <Radio value="no" label="No" color="gray" />
                      </Group>
                    </Radio.Group>
                  </Group>
                </Paper>

                {/* Budget Range */}
                <Paper p="xl" radius="lg" withBorder shadow="sm">
                  <Group mb="md" gap="xs">
                    <IconWallet size={20} color="orange" />
                    <Text fw={800} style={{ color: 'var(--mm-admin-sidebar)' }}>Budget Range</Text>
                  </Group>
                  <SimpleGrid cols={2} spacing="xs">
                    {BUDGET_RANGES.map((b) => (
                      <UnstyledButton
                        key={b.value}
                        onClick={() => setBudgetRange(b.value)}
                        p="xs"
                        radius="md"
                        ta="center"
                        style={{
                          backgroundColor: budgetRange === b.value ? 'var(--mm-admin-sidebar)' : 'var(--mantine-color-gray-0)',
                          color: budgetRange === b.value ? 'white' : 'inherit',
                          border: `1px solid ${budgetRange === b.value ? 'var(--mm-admin-sidebar)' : 'transparent'}`,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Text fw={700} size="sm">{b.value}</Text>
                      </UnstyledButton>
                    ))}
                  </SimpleGrid>
                </Paper>
              </Stack>
            </SimpleGrid>
          </Stack>

          {/* Intelligence Section (Right Col) */}
          <Stack gap="xl">
            {/* Preference Summary Card */}
            <Card radius="lg" p="xl" withBorder shadow="md" bg="var(--mm-admin-sidebar)" style={{ color: 'white' }}>
              <Group mb="md" justify="space-between">
                <Text fw={800} size="lg">Profile Summary</Text>
                <IconSparkles size={20} color="yellow" />
              </Group>

              <Stack gap="sm">
                <Box>
                  <Text size="xs" c="gray.4" tt="uppercase" fw={800}>Halal Status</Text>
                  <Text fw={600} size="sm">{halal ? 'Verified Halal Only' : 'Flexible'}</Text>
                </Box>
                
                <Box>
                  <Text size="xs" c="gray.4" tt="uppercase" fw={800}>Budget Goal</Text>
                  <Text fw={600} size="sm">{budgetRange}</Text>
                </Box>

                <Box>
                  <Text size="xs" c="gray.4" tt="uppercase" fw={800}>Favorite Cuisines</Text>
                  <Group gap={5} mt={5}>
                    {cuisines.length > 0 ? cuisines.map(c => (
                      <Badge key={c} color="white" variant="outline" size="sm">{c}</Badge>
                    )) : <Text size="sm" italic c="gray.5">No selection</Text>}
                  </Group>
                </Box>

                <Divider my="sm" color="white" style={{ opacity: 0.1 }} />

                <Group gap="xs">
                  <IconFlame size={16} color="orange" />
                  <Text size="sm" fw={600}>Heat Preference: {spiceLevel}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Live Recommendation Preview (UC005 Connection) */}
            <Paper p="xl" radius="lg" withBorder shadow="sm" bg="gray.0">
              <Group mb="lg" gap="xs">
                <IconMapPin size={20} color="olive" />
                <Text fw={800} style={{ color: 'var(--mm-admin-sidebar)' }}>Recommendation Preview</Text>
                <Tooltip label="How your preferences affect results">
                  <IconInfoCircle size={14} color="gray" />
                </Tooltip>
              </Group>

              <Stack gap="md">
                {recommendations.length > 0 ? recommendations.map((item, idx) => (
                  <Transition key={item.name} mounted={true} transition="slide-up" duration={400} timingFunction="ease">
                    {(styles) => (
                      <Card radius="md" p={0} shadow="xs" style={{ ...styles, overflow: 'hidden' }}>
                        <Group wrap="nowrap" gap={0}>
                          <Image src={item.img} w={80} h={80} fit="cover" />
                          <Box p="sm" style={{ flex: 1 }}>
                            <Text fw={800} size="xs" lineClamp={1}>{item.name}</Text>
                            <Group justify="space-between" mt={4}>
                              <Text size="xs" fw={700} color="olive">{item.price}</Text>
                              <Text size="xs" c="dimmed">{item.dist}</Text>
                            </Group>
                            <Badge size="xs" variant="light" color="gray" mt={5}>{item.type}</Badge>
                          </Box>
                        </Group>
                      </Card>
                    )}
                  </Transition>
                )) : (
                  <Center py="xl">
                    <Stack align="center" gap={5}>
                      <IconToolsKitchen2 size={24} color="gray" opacity={0.5} />
                      <Text size="xs" c="dimmed" ta="center">Add more cuisines to see matches</Text>
                    </Stack>
                  </Center>
                )}
                
                <Button 
                  variant="subtle" 
                  fullWidth 
                  color="olive" 
                  size="xs" 
                  rightSection={<IconChevronRight size={14} />}
                  mt="sm"
                >
                  View All Matches
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default UserPreference;
