import React, { useState } from 'react';
import { 
  Table, Group, Text, ActionIcon, Badge, Stack, Box, 
  Center, Button, Paper, Title, TextInput, Select, Pagination,
  Tooltip, Loader, Menu, ThemeIcon, Modal
} from '@mantine/core';
import { 
  IconPencil, IconTrash, IconPlus, IconSearch, IconChevronDown,
  IconFileTypeCsv, IconTrophy, IconSparkles
} from '@tabler/icons-react';
import { useTableChallenges } from '../../../../hooks/admin/SuperAdmin/ChallengeManagement/useTableChallenges';
import AddChallenge from './AddChallenge';
import EditChallenge from './EditChallenge';

const ListChallenges = () => {
  const { challenges, loading, fetchChallenges, deleteChallenge, generateRandomChallenge } = useTableChallenges();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [generatingRandom, setGeneratingRandom] = useState(false);

  // Pagination & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDeleteClick = (challenge) => {
    setChallengeToDelete(challenge);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!challengeToDelete) return;
    const success = await deleteVoucher(challengeToDelete.id);
    if (success) {
      setDeleteModalOpen(false);
      setChallengeToDelete(null);
    }
  };

  const deleteVoucher = async (id) => {
    return await deleteChallenge(id);
  };

  const handleEditClick = (challenge) => {
    setSelectedChallenge(challenge);
    setEditModalOpen(true);
  };

  const handleGenerateRandom = async () => {
    setGeneratingRandom(true);
    await generateRandomChallenge();
    setGeneratingRandom(false);
  };

  // --- Filtering ---
  const filtered = challenges.filter((c) => {
    const titleMatch = c.title.toLowerCase().includes(search.toLowerCase());
    const descMatch = (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    
    if (statusFilter === 'All') return matchesSearch;
    const isActive = statusFilter === 'Active';
    return matchesSearch && c.isActive === isActive;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  const exportCSV = () => {
    const headers = ['Title', 'Description', 'Points', 'Status'];
    const rows = filtered.map((c) => {
      return [
        c.title, c.description || '', c.points || 0, c.isActive ? 'Active' : 'Inactive'
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_challenges_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper p="xl" withBorder radius="md">
      {/* ── Table Toolbar ── */}
      <Group justify="space-between" mb="xl" wrap="wrap" align="center">
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon variant="light" color="olive" size="lg" radius="md">
            <IconTrophy size={20} />
          </ThemeIcon>
          <Title order={3} style={{ fontSize: '20px', fontWeight: 800, color: 'var(--mm-admin-sidebar)', whiteSpace: 'nowrap' }}>
            Loyalty Challenges
          </Title>
          <Badge variant="outline" color="olive" size="sm" radius="sm">
            {challenges.length} Total
          </Badge>
        </Group>

        <Group gap="sm" wrap="wrap">
          <TextInput
            placeholder="Search challenges..."
            leftSection={<IconSearch size={15} />}
            radius="xl"
            size="sm"
            value={search}
            onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
            style={{ width: 220 }}
          />

          <Select
            size="sm"
            radius="xl"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val || 'All'); setPage(1); }}
            data={['All', 'Active', 'Inactive']}
            style={{ width: 120 }}
          />

          <Select
            size="sm"
            radius="xl"
            value={String(pageSize)}
            onChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            data={['5', '10', '20', '50']}
            style={{ width: 80 }}
            styles={{ input: { textAlign: 'center', fontWeight: 600 } }}
          />

          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                radius="xl"
                rightSection={<IconChevronDown size={14} />}
              >
                Export
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconFileTypeCsv size={16} />} onClick={exportCSV}>
                Download CSV
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button 
            leftSection={<IconSparkles size={16} />} 
            color="violet" 
            variant="light"
            size="sm"
            radius="xl"
            loading={generatingRandom}
            onClick={handleGenerateRandom}
          >
            Generate Random
          </Button>

          <Button 
            leftSection={<IconPlus size={16} />} 
            color="olive" 
            size="sm"
            radius="xl"
            onClick={() => setAddModalOpen(true)}
          >
            Add Challenge
          </Button>
        </Group>
      </Group>

      {/* ── Table Body ── */}
      {loading ? (
        <Center py={60}>
          <Loader color="olive" />
        </Center>
      ) : (
        <>
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>TITLE</Table.Th>
                <Table.Th>DESCRIPTION</Table.Th>
                <Table.Th>POINTS</Table.Th>
                <Table.Th>STATUS</Table.Th>
                <Table.Th>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginated.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Center py={50}>
                      <Stack align="center" gap="xs">
                        <IconTrophy size={40} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed">No challenges found.</Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginated.map((challenge) => {
                  return (
                  <Table.Tr key={challenge.id}>
                    <Table.Td fw={700} style={{ color: 'var(--mm-admin-text-main)', minWidth: 200 }}>{challenge.title}</Table.Td>
                    <Table.Td>{challenge.description}</Table.Td>
                    <Table.Td>
                      <Text fw={800} size="sm" color="orange">{challenge.points} Pts</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Box
                          style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: challenge.isActive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)',
                          }}
                        />
                        <Text size="sm" fw={600} color={challenge.isActive ? 'green.7' : 'gray.6'}>
                          {challenge.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Tooltip label="Edit Challenge" position="top" withArrow>
                          <ActionIcon variant="light" color="blue" onClick={() => handleEditClick(challenge)}>
                            <IconPencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete Challenge" position="top" withArrow>
                          <ActionIcon variant="light" color="red" onClick={() => handleDeleteClick(challenge)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )})
              )}
            </Table.Tbody>
          </Table>

          {/* ── Delete Confirmation Modal ── */}
          <Modal 
            opened={deleteModalOpen} 
            onClose={() => setDeleteModalOpen(false)} 
            title="Delete Challenge" 
            centered
          >
            <Stack gap="md">
              <Text>Are you sure you want to delete challenge "{challengeToDelete?.title}"? This action cannot be undone.</Text>
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                <Button color="red" onClick={confirmDelete}>Delete</Button>
              </Group>
            </Stack>
          </Modal>

          <Group justify="space-between" mt="xl" align="center">
            <Text size="sm" c="dimmed">
              {filtered.length === 0
                ? 'No items to show'
                : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} items`}
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="olive"
              size="sm"
              radius="xl"
            />
          </Group>
        </>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <AddChallenge 
          opened={addModalOpen} 
          onClose={() => setAddModalOpen(false)} 
          onSuccess={fetchChallenges} 
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <EditChallenge 
          opened={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          challenge={selectedChallenge}
          onSuccess={fetchChallenges} 
        />
      )}
    </Paper>
  );
};

export default ListChallenges;
