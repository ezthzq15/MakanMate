import React, { useState } from 'react';
import { Drawer, TextInput, NumberInput, Button, Stack, Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/apiClient';

const AddVoucer = ({ opened, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    discountType: 'Percentage',
    discountValue: '',
    minSpend: '',
    quantity: 100,
    validUntil: null
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.discountValue || !formData.validUntil) {
      return notifications.show({ title: 'Error', message: 'Please fill all required fields', color: 'red' });
    }

    setLoading(true);
    try {
      await apiClient.post('/vouchers', {
        ...formData,
        validUntil: new Date(formData.validUntil).toISOString()
      });
      notifications.show({ title: 'Success', message: 'Voucher added successfully', color: 'green' });
      onSuccess();
      onClose();
      setFormData({ title: '', discountType: 'Percentage', discountValue: '', minSpend: '', quantity: 100, validUntil: null }); // Reset
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add voucher';
      notifications.show({ title: 'Error', message: errorMsg, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Add New Voucher" position="right" size="md" padding="xl">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <TextInput 
            label="Voucher Title" 
            placeholder="e.g. 20% Off Nasi Lemak" 
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            required 
          />
          
          <Group grow align="flex-start">
            <Select
              label="Discount Type"
              data={['Percentage', 'Fixed Amount']}
              value={formData.discountType}
              onChange={(val) => handleChange('discountType', val)}
              required
            />
            <NumberInput 
              label="Discount Value" 
              placeholder={formData.discountType === 'Percentage' ? "e.g. 20" : "e.g. 5"} 
              value={formData.discountValue} 
              onChange={(val) => handleChange('discountValue', val)} 
              min={1}
              max={formData.discountType === 'Percentage' ? 100 : undefined}
              suffix={formData.discountType === 'Percentage' ? "%" : undefined}
              prefix={formData.discountType === 'Fixed Amount' ? "RM " : undefined}
              required 
            />
          </Group>

          <NumberInput 
            label="Minimum Spend (Optional)" 
            placeholder="e.g. 15" 
            value={formData.minSpend} 
            onChange={(val) => handleChange('minSpend', val)} 
            min={0}
            prefix="RM "
          />

          <NumberInput 
            label="Total Quantity" 
            placeholder="How many can be redeemed?" 
            value={formData.quantity} 
            onChange={(val) => handleChange('quantity', val)} 
            min={1} 
            required 
          />
          
          <DateInput 
            label="Valid Until" 
            placeholder="Select expiry date" 
            value={formData.validUntil} 
            onChange={(val) => handleChange('validUntil', val)} 
            minDate={new Date()} 
            required 
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

export default AddVoucer;
