import React from 'react';
import { Drawer, TextInput, NumberInput, Button, Stack, Group, Select, Switch } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEditVouchers } from '../../../../hooks/admin/SuperAdmin/VoucherManagement/useEditVouchers';

const EditVoucher = ({ opened, onClose, voucher, onSuccess }) => {
  const { form, stalls, loading, handleSubmit } = useEditVouchers({ voucher, onSuccess, onClose });

  const stallOptions = [
    { value: 'general', label: '📢 General Voucher (All Stalls)' },
    ...stalls.map(s => ({ value: s.stallID, label: s.stallName }))
  ];

  return (
    <Drawer opened={opened} onClose={onClose} title="Edit Voucher (Admin)" position="right" size="md" padding="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Food Stall"
            placeholder="Select a food stall"
            data={stallOptions}
            searchable
            required
            {...form.getInputProps('stallID')}
          />

          <TextInput 
            label="Voucher Title" 
            placeholder="e.g. 20% Off Nasi Lemak" 
            required
            {...form.getInputProps('title')}
          />
          
          <Group grow align="flex-start">
            <Select
              label="Discount Type"
              data={['Percentage', 'Fixed Amount']}
              required
              {...form.getInputProps('discountType')}
            />
            <NumberInput 
              label="Discount Value" 
              placeholder={form.values.discountType === 'Percentage' ? "e.g. 20" : "e.g. 5"} 
              min={1}
              max={form.values.discountType === 'Percentage' ? 100 : undefined}
              suffix={form.values.discountType === 'Percentage' ? "%" : undefined}
              prefix={form.values.discountType === 'Fixed Amount' ? "RM " : undefined}
              required 
              {...form.getInputProps('discountValue')}
            />
          </Group>

          <NumberInput 
            label="Minimum Spend (Optional)" 
            placeholder="e.g. 15" 
            min={0}
            prefix="RM "
            {...form.getInputProps('minSpend')}
          />

          <NumberInput 
            label="Total Quantity" 
            placeholder="How many can be redeemed?" 
            min={1} 
            required 
            {...form.getInputProps('quantity')}
          />
          
          <DateInput 
            label="Valid Until" 
            placeholder="Select expiry date" 
            minDate={new Date()} 
            required 
            {...form.getInputProps('validUntil')}
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

export default EditVoucher;
