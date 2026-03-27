import React, { useState } from 'react';
import { 
  Container, Title, Text, Box, SimpleGrid, UnstyledButton, Group, Stack, 
  Slider, Button, ThemeIcon, Paper, Center
} from '@mantine/core';
import { 
  IconToolsKitchen2, IconBowl, IconCodeCircle2, 
  IconMeat, IconFish, IconSoup, IconCertificate, 
  IconFlame, IconCheck, IconCircle, IconPaperBag, IconWallet
} from '@tabler/icons-react';

const UserPreference = () => {
  const [cuisineType, setCuisineType] = useState(['Malay']);
  const [isHalal, setIsHalal] = useState(true);
  const [spicyLevel, setSpicyLevel] = useState('MEDIUM');
  const [budgetAmount, setBudgetAmount] = useState(2);

  const toggleCuisine = (cuisine) => {
    if (cuisineType.includes(cuisine)) {
      setCuisineType(cuisineType.filter(c => c !== cuisine));
    } else {
      setCuisineType([...cuisineType, cuisine]);
    }
  };

  const cuisines = [
    { name: 'Malay', icon: IconToolsKitchen2 },
    { name: 'Chinese', icon: IconBowl },
    { name: 'Indian', icon: IconPaperBag },
    { name: 'Western', icon: IconMeat },
    { name: 'Japanese', icon: IconFish },
    { name: 'Thai', icon: IconSoup },
  ];

  const spiceLevels = ['LOW', 'MEDIUM', 'HIGH'];
  const halalOptions = ['Halal Only', 'Muslim-Friendly'];

  const marks = [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' }
  ];

  return (
    <Container size="md" py={20} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Banner */}
      <Box 
        style={{ 
          backgroundColor: 'var(--mm-color-primary)', 
          borderRadius: '40px', 
          padding: '60px 40px', 
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--mm-shadow)'
        }}
      >
        <Box style={{ position: 'relative', zIndex: 10 }}>
          <Title order={1} style={{ color: 'var(--mm-text-on-primary)', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            Your Palate, Your Rules
          </Title>
          <Text style={{ color: 'var(--mm-color-primary-light)', fontSize: '16px', fontWeight: 500 }}>
            Customize your MakanMate experience
          </Text>
        </Box>
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

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {cuisines.map((cuisine) => {
            const isActive = cuisineType.includes(cuisine.name);
            return (
              <UnstyledButton
                key={cuisine.name}
                onClick={() => toggleCuisine(cuisine.name)}
                style={{
                  backgroundColor: isActive ? 'var(--mm-bg-body)' : 'var(--mm-bg-surface)',
                  border: isActive ? '2px solid var(--mm-color-primary)' : '2px solid transparent',
                  borderRadius: '30px',
                  padding: '24px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isActive ? 'var(--mm-shadow)' : 'none'
                }}
              >
                <cuisine.icon size={28} color={isActive ? 'var(--mm-color-primary)' : 'var(--mm-text-dimmed)'} stroke={1.5} />
                <Text fw={isActive ? 800 : 600} style={{ color: isActive ? 'var(--mm-text-main)' : 'var(--mm-text-dimmed)', fontSize: '15px' }}>
                  {cuisine.name}
                </Text>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* Grid for Halal and Spice */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb={50}>
        
        {/* Halal Status */}
        <Paper p="30px" radius="32px" style={{ backgroundColor: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border-color)' }}>
          <Group gap="xs" mb="xl">
            <IconCertificate size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Halal Status
            </Title>
          </Group>

          <Stack gap="md">
            {halalOptions.map((option) => {
              const optionIsHalal = option === 'Halal Only';
              return (
              <UnstyledButton
                key={option}
                onClick={() => setIsHalal(optionIsHalal)}
                style={{
                  backgroundColor: 'var(--mm-bg-body)',
                  borderRadius: '24px',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--mm-shadow)'
                }}
              >
                <Text fw={700} style={{ color: 'var(--mm-text-main)' }}>{option}</Text>
                {isHalal === optionIsHalal ? (
                  <ThemeIcon style={{ backgroundColor: 'var(--mm-color-primary)' }} radius="xl" size="sm">
                    <IconCheck size={14} stroke={3} color="var(--mm-text-on-primary)" />
                  </ThemeIcon>
                ) : (
                  <IconCircle size={20} color="var(--mm-border-color)" stroke={1.5} />
                )}
              </UnstyledButton>
            )})}
          </Stack>
        </Paper>

        {/* Spice Tolerance */}
        <Paper p="30px" radius="32px" style={{ backgroundColor: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border-color)' }}>
          <Group gap="xs" mb="xl">
            <IconFlame size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Spice Tolerance
            </Title>
          </Group>

          <Group grow gap="md">
            {spiceLevels.map((level) => {
              const isActive = spicyLevel === level;
              return (
                <UnstyledButton
                  key={level}
                  onClick={() => setSpicyLevel(level)}
                  style={{
                    backgroundColor: isActive ? 'var(--mm-color-primary)' : 'var(--mm-bg-body)',
                    borderRadius: '24px',
                    padding: '16px 0',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--mm-shadow)' : 'none'
                  }}
                >
                  <Text fw={800} style={{ color: isActive ? 'var(--mm-text-on-primary)' : 'var(--mm-text-main)', fontSize: '12px', letterSpacing: '0.5px' }}>
                    {level}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Budget Range */}
      <Paper p="40px" radius="32px" style={{ backgroundColor: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border-color)', marginBottom: '50px' }}>
         <Group justify="space-between" mb="40px">
          <Group gap="xs">
            <IconWallet size={24} color="var(--mm-color-primary)" />
            <Title order={4} style={{ color: 'var(--mm-color-primary)', fontSize: '18px', fontWeight: 800 }}>
              Budget Range
            </Title>
          </Group>
          <Text style={{ color: 'var(--mm-text-main)', fontSize: '14px', fontWeight: 800 }}>
            Ringgit Malaysia
          </Text>
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
            styles={{
              track: { backgroundColor: 'var(--mm-bg-body)', '&::before': { backgroundColor: 'var(--mm-bg-body)' } },
              bar: { backgroundColor: 'var(--mm-color-primary)' },
              thumb: { width: 28, height: 28, border: '4px solid var(--mm-color-primary)', backgroundColor: 'var(--mm-bg-surface)', boxShadow: 'var(--mm-shadow)' },
              mark: { display: 'none' },
              markLabel: { fontSize: '18px', fontWeight: 800, color: 'var(--mm-color-primary)', marginTop: '20px' }
            }}
          />
        </Box>
      </Paper>

      {/* Save Button */}
      <Stack align="center" gap="sm" pb={100}>
        <Button 
          fullWidth
          size="xl" 
          radius="xl" 
          style={{ backgroundColor: 'var(--mm-color-primary)', height: '64px', fontSize: '18px', fontWeight: 700 }}
        >
          Save
        </Button>
        <Text size="sm" style={{ color: 'var(--mm-text-dimmed)', textAlign: 'center', maxWidth: '500px' }}>
          MakanMate uses these settings to curate your personalized discovery feed and restaurant recommendations.
        </Text>
      </Stack>

    </Container>
  );
};

export default UserPreference;
