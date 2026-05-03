import React, { useState, useEffect } from 'react';
import { 
  Paper, Stack, TextInput, Textarea, Switch, Button, 
  Group, Title, Text, LoadingOverlay, Box, Divider,
  SimpleGrid, Image, ThemeIcon
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBuildingStore, IconCamera, IconDeviceFloppy, IconAlertCircle } from '@tabler/icons-react';
import { useStallInformation } from '../../../../hooks/admin/StallManager/StallInformation/useStallInformtion';

/**
 * UC009: Manage Food Stall — Stall Manager Component
 * Centralized UI for managers to update their own stall information.
 */
const MyStall = () => {
  const { stallData, setStallData, loading, saving, updateMyStall } = useStallInformation();

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMyStall(stallData);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <form onSubmit={handleSave}>
        <Stack gap="xl">
          <Paper p="xl" withBorder radius="md">
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <ThemeIcon variant="light" color="olive" size="xl" radius="md">
                  <IconBuildingStore size={24} />
                </ThemeIcon>
                <Box>
                  <Title order={3} style={{ color: 'var(--mm-admin-sidebar)' }}>Stall Information</Title>
                  <Text size="sm" c="dimmed">Manage your stall's public profile and details</Text>
                </Box>
              </Group>
              <Button 
                type="submit" 
                loading={saving} 
                leftSection={<IconDeviceFloppy size={18} />}
                color="olive"
                radius="md"
              >
                Save Changes
              </Button>
            </Group>

            <Divider mb="xl" />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="md">
                <TextInput
                  label="Stall Name"
                  placeholder="Enter stall name"
                  required
                  value={stallData.stallName}
                  onChange={(e) => setStallData({ ...stallData, stallName: e.target.value })}
                  radius="md"
                />
                
                <TextInput
                  label="Cuisine Type"
                  placeholder="e.g. Malay, Chinese, Western"
                  required
                  value={stallData.cuisineType}
                  onChange={(e) => setStallData({ ...stallData, cuisineType: e.target.value })}
                  radius="md"
                />

                <Group justify="space-between" mt="xs">
                  <Box>
                    <Text fw={500} size="sm">Halal Certified</Text>
                    <Text size="xs" c="dimmed">Is your stall officially Halal certified?</Text>
                  </Box>
                  <Switch
                    checked={stallData.isHalal}
                    onChange={(e) => setStallData({ ...stallData, isHalal: e.currentTarget.checked })}
                    color="olive"
                    size="lg"
                  />
                </Group>

                <Textarea
                  label="Operating Hours"
                  placeholder="e.g. Mon-Fri: 10am - 8pm"
                  value={stallData.operatingHours}
                  onChange={(e) => setStallData({ ...stallData, operatingHours: e.target.value })}
                  radius="md"
                  minRows={2}
                />
              </Stack>

              <Stack gap="md">
                <TextInput
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={stallData.imageURL}
                  onChange={(e) => setStallData({ ...stallData, imageURL: e.target.value })}
                  radius="md"
                  leftSection={<IconCamera size={16} />}
                />

                {stallData.imageURL && (
                  <Paper withBorder p={4} radius="md" style={{ overflow: 'hidden' }}>
                    <Image
                      src={stallData.imageURL}
                      h={160}
                      fallbackSrc="https://placehold.co/600x400?text=Invalid+Image+URL"
                      radius="sm"
                    />
                  </Paper>
                )}

                <Textarea
                  label="Description"
                  placeholder="Tell customers about your stall..."
                  value={stallData.description}
                  onChange={(e) => setStallData({ ...stallData, description: e.target.value })}
                  radius="md"
                  minRows={4}
                />
              </Stack>
            </SimpleGrid>

            <Divider my="xl" label="Location Coordinates" labelPosition="center" />
            
            <SimpleGrid cols={2} spacing="md">
              <TextInput
                label="Latitude"
                type="number"
                step="any"
                value={stallData.latitude}
                onChange={(e) => setStallData({ ...stallData, latitude: e.target.value })}
                radius="md"
              />
              <TextInput
                label="Longitude"
                type="number"
                step="any"
                value={stallData.longitude}
                onChange={(e) => setStallData({ ...stallData, longitude: e.target.value })}
                radius="md"
              />
            </SimpleGrid>
          </Paper>
        </Stack>
      </form>
    </Box>
  );
};

export default MyStall;
