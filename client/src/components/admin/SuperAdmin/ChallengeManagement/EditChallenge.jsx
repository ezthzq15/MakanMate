import React from 'react';
import { Drawer, TextInput, NumberInput, Button, Stack, Group, Textarea, Switch } from '@mantine/core';
import { useEditChallenges } from '../../../../hooks/admin/SuperAdmin/ChallengeManagement/useEditChallenges';

const EditChallenge = ({ opened, onClose, challenge, onSuccess }) => {
  const { form, loading, handleSubmit } = useEditChallenges({ challenge, onSuccess, onClose });

  return (
    <Drawer opened={opened} onClose={onClose} title="Edit Challenge" position="right" size="md" padding="xl">
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

          <Switch
            label="Active Status"
            checked={form.values.isActive}
            onChange={(event) => form.setFieldValue('isActive', event.currentTarget.checked)}
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

export default EditChallenge;
