import React from 'react';
import { Drawer, TextInput, NumberInput, Button, Stack, Group, Textarea } from '@mantine/core';
import { useAddChallenges } from '../../../../hooks/admin/SuperAdmin/ChallengeManagement/useAddChallenges';

const AddChallenge = ({ opened, onClose, onSuccess }) => {
  const { form, loading, handleSubmit } = useAddChallenges({ onSuccess, onClose });

  return (
    <Drawer opened={opened} onClose={onClose} title="Add New Challenge" position="right" size="md" padding="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput 
            label="Challenge Title" 
            placeholder="e.g. Halal Food Explorer" 
            required
            {...form.getInputProps('title')}
          />
          
          <Textarea 
            label="Description" 
            placeholder="e.g. Try any halal certified stall today to earn reward points" 
            required
            minRows={3}
            {...form.getInputProps('description')}
          />

          <NumberInput 
            label="Points Awarded" 
            placeholder="e.g. 50" 
            min={1} 
            required 
            {...form.getInputProps('points')}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button type="submit" color="olive" loading={loading}>Save</Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default AddChallenge;
