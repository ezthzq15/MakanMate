import React from 'react';
import { Box, Title, Text, Group } from '@mantine/core';
import AdminLayout from '../../../../../container/AdminLayout';
import ListChallenges from '../../../../../components/admin/SuperAdmin/ChallengeManagement/ListChallenges';

const ChallengeManagement = () => {
  return (
    <AdminLayout>
      <Box p="md">
        <Group justify="space-between" mb={40}>
          <Box>
            <Title order={1} style={{ fontSize: '32px', color: '#4D6459' }}>
              Challenge Management (Admin)
            </Title>
            <Text c="dimmed">Manage loyalty reward challenges or generate random daily surprise tasks for MakanMate users.</Text>
          </Box>
        </Group>

        <ListChallenges />
      </Box>
    </AdminLayout>
  );
};

export default ChallengeManagement;
