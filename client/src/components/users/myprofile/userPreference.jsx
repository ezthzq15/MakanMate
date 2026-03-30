import { 
  Container, Title, Text, Box, SimpleGrid, UnstyledButton, Group, Stack, 
  Slider, Button, Paper, Center, Loader, SegmentedControl, Radio
} from '@mantine/core';
import { 
  IconToolsKitchen2, IconBowl, IconMeat, IconFish, IconSoup, IconCertificate, 
  IconFlame, IconWallet, IconPaperBag 
} from '@tabler/icons-react';
import { usePreferences } from '../../../hooks/users/usePreferences';

const UserPreference = () => {
  const {
    cuisineType,
    isHalal,
    spicyLevel,
    budgetAmount,
    loading,
    saving,
    setIsHalal,
    setSpicyLevel,
    setBudgetAmount,
    toggleCuisine,
    handleSave,
  } = usePreferences();

  const cuisines = [
    { name: 'Malay', icon: IconToolsKitchen2 },
    { name: 'Chinese', icon: IconBowl },
    { name: 'Indian', icon: IconPaperBag },
    { name: 'Western', icon: IconMeat },
    { name: 'Japanese', icon: IconFish },
    { name: 'Thai', icon: IconSoup },
  ];

  const marks = [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' }
  ];

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader color="var(--mm-color-primary)" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Container size="md" py={20} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Banner */}
      <Box 
        style={{ 
          backgroundColor: 'var(--mm-color-primary)', 
          borderRadius: '40px', 
          padding: '40px', 
          marginBottom: '40px',
          boxShadow: 'var(--mm-shadow)'
        }}
      >
        <Title order={1} style={{ color: 'var(--mm-text-on-primary)', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Your Palate, Your Rules
        </Title>
        <Text style={{ color: 'var(--mm-color-primary-light)', fontSize: '15px', fontWeight: 500 }}>
          Customize your MakanMate experience for better recommendations
        </Text>
      </Box>

      {/* Cuisine Type */}
      <Box mb={50}>
        <Group justify="space-between" mb="xl">
          <Title order={3} style={{ color: 'var(--mm-color-primary)', fontSize: '20px', fontWeight: 800 }}>
            Cuisine Type
          </Title>
          <Text style={{ color: 'var(--mm-text-dimmed)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px' }}>
            SELECT MULTIPLE
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
          {cuisines.map((cuisine) => {
            const isActive = cuisineType.includes(cuisine.name);
            return (
              <UnstyledButton
                key={cuisine.name}
                onClick={() => toggleCuisine(cuisine.name)}
                style={{
                  backgroundColor: isActive ? 'var(--mm-color-primary-light)' : 'var(--mm-bg-surface)',
                  border: isActive ? '2px solid var(--mm-color-primary)' : '2px solid var(--mm-border-color)',
                  borderRadius: '20px',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <cuisine.icon size={24} color={isActive ? 'var(--mm-color-primary)' : 'var(--mm-text-dimmed)'} />
                <Text fw={isActive ? 800 : 600} size="sm" style={{ color: isActive ? 'var(--mm-color-primary)' : 'var(--mm-text-main)' }}>
                  {cuisine.name}
                </Text>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb={50}>
        {/* Halal Status - Radio based */}
        <Paper p="30px" radius="32px" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)' }}>
          <Group gap="xs" mb="xl">
            <IconCertificate size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Halal Status
            </Title>
          </Group>

          <Radio.Group
            value={isHalal ? 'halal' : 'muslim-friendly'}
            onChange={(val) => setIsHalal(val === 'halal')}
          >
            <Stack>
              <Radio value="halal" label="Halal Only" color="var(--mm-color-primary)" />
              <Radio value="muslim-friendly" label="Muslim-Friendly" color="var(--mm-color-primary)" />
            </Stack>
          </Radio.Group>
        </Paper>

        {/* Spice Tolerance - SegmentedControl based */}
        <Paper p="30px" radius="32px" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)' }}>
          <Group gap="xs" mb="xl">
            <IconFlame size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Spice Tolerance
            </Title>
          </Group>

          <SegmentedControl
            fullWidth
            radius="xl"
            size="md"
            color="var(--mm-color-primary)"
            value={spicyLevel}
            onChange={setSpicyLevel}
            data={[
              { label: 'LOW', value: 'LOW' },
              { label: 'MEDIUM', value: 'MEDIUM' },
              { label: 'HIGH', value: 'HIGH' },
            ]}
          />
        </Paper>
      </SimpleGrid>

      {/* Budget Range - Slider */}
      <Paper p="40px" radius="32px" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)', marginBottom: '50px' }}>
        <Group justify="space-between" mb="40px">
          <Group gap="xs">
            <IconWallet size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Budget Range
            </Title>
          </Group>
        </Group>

        <Box px={10}>
          <Slider
            min={1}
            max={4}
            step={1}
            marks={marks}
            value={budgetAmount}
            onChange={setBudgetAmount}
            size="xl"
            radius="xl"
            color="var(--mm-color-primary)"
            label={null}
          />
        </Box>
      </Paper>

      {/* Save Button */}
      <Stack align="center" gap="sm" pb={100}>
        <Button 
          fullWidth
          size="xl" 
          radius="xl" 
          loading={saving}
          onClick={handleSave}
          style={{ backgroundColor: 'var(--mm-color-primary)', height: '64px', fontSize: '18px', fontWeight: 700 }}
        >
          Save Culinary Identity
        </Button>
      </Stack>
    </Container>
  );
};

export default UserPreference;
