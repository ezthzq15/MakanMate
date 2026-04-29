import React, { useState } from 'react';
import { Table, Group, Text, ActionIcon, Badge, Image, Stack, Box, Center, Button } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconToolsKitchen2 } from '@tabler/icons-react';
import { useMenu } from '../../../hooks/admin/MenuManagement/useMenu';
import AddMenu from './AddMenu';
import EditMenu from './EditMenu';

const ListMenu = ({ stallID }) => {
  const { menuItems, loading, deleteMenuItem } = useMenu(stallID);
  const [editingItem, setEditingItem] = useState(null);

  const rows = menuItems.map((item) => (
    <Table.Tr key={item.menuID}>
      <Table.Td>
        <Group gap="sm">
          <Image
            radius="md"
            src={item.itemImage || 'https://placehold.co/100x100?text=Food'}
            w={50}
            h={50}
            fallbackSrc="https://placehold.co/100x100?text=Food"
          />
          <Box>
            <Text size="sm" fw={700}>{item.itemName}</Text>
            <Text size="xs" c="dimmed">{item.itemDescription || 'No description'}</Text>
          </Box>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={700} c="olive">RM {Number(item.itemPrice).toFixed(2)}</Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={item.isAvailable ? 'green' : 'red'} 
          variant="light"
          radius="sm"
        >
          {item.isAvailable ? 'Available' : 'Sold Out'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon 
            variant="light" 
            color="blue" 
            onClick={() => setEditingItem(item)}
            radius="md"
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon 
            variant="light" 
            color="red" 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this item?')) {
                deleteMenuItem(item.menuID);
              }
            }}
            radius="md"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4" style={{ color: '#4D6459' }}>Menu Items ({menuItems.length})</Title>
        <AddMenu stallID={stallID} />
      </Group>

      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item Details</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py={50}>
                    <Stack align="center" gap="xs">
                      <IconToolsKitchen2 size={40} color="gray" />
                      <Text c="dimmed">No items in menu yet.</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {editingItem && (
        <EditMenu 
          item={editingItem} 
          stallID={stallID} 
          onClose={() => setEditingItem(null)} 
        />
      )}
    </Box>
  );
};

// Internal Title component since it wasn't imported from Mantine
const Title = ({ children, order, size, style, ...props }) => (
  <Text 
    {...props} 
    style={{ 
      ...style, 
      fontSize: order === 1 ? '32px' : order === 2 ? '24px' : '18px', 
      fontWeight: 700 
    }}
  >
    {children}
  </Text>
);

export default ListMenu;
