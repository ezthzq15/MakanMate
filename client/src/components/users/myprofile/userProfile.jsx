import React, { useRef, useState, useEffect } from 'react';
import {
  Box, Container, Title, Text, TextInput, PasswordInput,
  Button, Group, Stack, Avatar, Paper, Divider, ActionIcon,
  Progress, Popover, Select, Collapse, ThemeIcon, rem, Badge, SimpleGrid
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconCamera, IconCheck, IconX, IconLock, IconChevronDown,
  IconChevronUp, IconTrash, IconShieldLock, IconEye, IconEyeOff
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../lib/apiClient';

// ─── Password strength requirement row ───────────────────────────────────────
const Req = ({ meets, label }) => (
  <Text c={meets ? 'teal' : 'red'} size="xs" mt={4} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    {meets ? <IconCheck size={12} stroke={3} /> : <IconX size={12} stroke={3} />}
    {label}
  </Text>
);

// ─── Label style helper ───────────────────────────────────────────────────────
const labelStyle = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.04em',
  color: 'var(--mm-text-dimmed)',
  marginBottom: 6,
  textTransform: 'uppercase',
};

const inputStyle = {
  input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', borderRadius: 12 },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UserProfile = ({ profile, onSave, onCancel, loading }) => {
  const fileRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.profilePic || null);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [uploading,    setUploading]    = useState(false);

  // Personal fields
  const [userName,  setUserName]  = useState(profile?.userName  || '');
  const [userPhone, setUserPhone] = useState(profile?.userPhone || '');
  const [address,   setAddress]   = useState(profile?.address   || '');
  const [gender,    setGender]    = useState(profile?.gender    || null);
  const [birthday,  setBirthday]  = useState(
    profile?.birthday ? new Date(profile.birthday) : null
  );

  // Security fields
  const [secOpen,      setSecOpen]      = useState(false);
  const [currentPw,    setCurrentPw]    = useState('');
  const [newPw,        setNewPw]        = useState('');
  const [popoverOpen,  setPopoverOpen]  = useState(false);

  // Track if anything changed
  const hasChanges =
    !!photoFile ||
    userName  !== (profile?.userName  || '') ||
    userPhone !== (profile?.userPhone || '') ||
    address   !== (profile?.address   || '') ||
    gender    !== (profile?.gender    || null) ||
    (birthday?.toISOString?.() ?? null) !== (profile?.birthday ? new Date(profile.birthday).toISOString() : null) ||
    !!currentPw || !!newPw;

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName  || '');
      setUserPhone(profile.userPhone || '');
      setAddress(profile.address   || '');
      setGender(profile.gender    || null);
      setPhotoPreview(profile.profilePic || null);
      if (profile.birthday) setBirthday(new Date(profile.birthday));
    }
  }, [profile]);

  // Reset all fields back to current profile (Discard)
  const resetToProfile = () => {
    setUserName(profile?.userName  || '');
    setUserPhone(profile?.userPhone || '');
    setAddress(profile?.address   || '');
    setGender(profile?.gender    || null);
    setBirthday(profile?.birthday ? new Date(profile.birthday) : null);
    setPhotoPreview(profile?.profilePic || null);
    setPhotoFile(null);
    setCurrentPw('');
    setNewPw('');
  };

  const pwChecks = [
    { label: 'At least 8 characters',  meets: newPw.length >= 8 },
    { label: 'Includes a number',       meets: /[0-9]/.test(newPw) },
    { label: 'Lowercase letter',        meets: /[a-z]/.test(newPw) },
    { label: 'Uppercase letter',        meets: /[A-Z]/.test(newPw) },
    { label: 'Special character',       meets: /[^A-Za-z0-9]/.test(newPw) },
  ];
  const strength  = pwChecks.filter(c => c.meets).length;
  const pwColor   = strength === 5 ? 'teal' : strength > 2 ? 'yellow' : 'red';

  // ── Photo upload ────────────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhotoToFirebase = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.profilePic;
  };

  // ── Save handler ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userName.trim() || !userPhone.trim() || !address.trim() || !gender || !birthday) {
      notifications.show({ title: 'Validation Failed', message: 'All personal details (Name, Phone, Address, Gender, and Birthday) are required.', color: 'red' });
      return;
    }

    let profilePic = profile?.profilePic || null;
    if (photoFile) {
      setUploading(true);
      try {
        profilePic = await uploadPhotoToFirebase(photoFile);
      } catch {
        notifications.show({ title: 'Upload Failed', message: 'Could not upload photo', color: 'red' });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSave(
      {
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        address:   address.trim(),
        gender,
        birthday:  birthday ? new Date(birthday).toISOString() : null,
        profilePic,
        ...(secOpen && newPw ? { currentPassword: currentPw, userPassword: newPw } : {}),
      },
      // onSuccess callback — clears dirty state
      () => resetToProfile()
    );
  };

  return (
    <Container size="sm" py={{ base: 12, md: 20 }} px={{ base: 'sm', md: 'md' }}>
      <Stack gap={24}>

        {/* ── Header: Avatar + title ─────────────────────────────────────── */}
        <Group align="flex-start" gap="xl" wrap="wrap">
          <Box style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              size={100}
              radius="50%"
              src={photoPreview}
              styles={{ root: { border: '3px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}
            />
            <ActionIcon
              variant="filled"
              color="#0f4c5c"
              radius="xl"
              size={34}
              style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid white' }}
              onClick={() => fileRef.current?.click()}
              loading={uploading}
            >
              <IconCamera size={16} />
            </ActionIcon>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </Box>
          <Box>
            <Title order={1} style={{ fontSize: 28, fontWeight: 800, color: 'var(--mm-text-main)' }}>
              Manage Profile
            </Title>
            <Text size="sm" c="dimmed" mt={4}>Update your personal culinary identity</Text>
          </Box>
        </Group>

        {/* ── Personal Details ───────────────────────────────────────────── */}
        <Paper p={{ base: 16, md: 28 }} radius={20} style={{ border: '1px solid var(--mm-border-color)', backgroundColor: 'var(--mm-bg-surface)' }}>
          <Text fw={800} size="md" c="var(--mm-color-primary)" mb="xl">Personal Details</Text>

          <Stack gap="md">
            <TextInput
              withAsterisk
              label="Full Name"
              placeholder="Your full name"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              radius="md"
              size="md"
              styles={{ ...inputStyle, label: labelStyle }}
            />

            {/* Phone + Email — stack on mobile, side-by-side on sm+ */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                withAsterisk
                label="Phone Number"
                placeholder="+60 12-345 6789"
                value={userPhone}
                onChange={(e) => setUserPhone(e.currentTarget.value)}
                radius="md"
                size="md"
                styles={{ ...inputStyle, label: labelStyle }}
              />
              <TextInput
                label="Email Address"
                value={profile?.userEmail || ''}
                readOnly
                radius="md"
                size="md"
                styles={{
                  input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', borderRadius: 12, color: 'var(--mm-text-dimmed)' },
                  label: labelStyle
                }}
              />
            </SimpleGrid>

            <TextInput
              withAsterisk
              label="Address"
              placeholder="Your address"
              value={address}
              onChange={(e) => setAddress(e.currentTarget.value)}
              radius="md"
              size="md"
              styles={{ ...inputStyle, label: labelStyle }}
            />

            {/* Gender + Birthday — stack on mobile, side-by-side on sm+ */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                withAsterisk
                label="Gender"
                placeholder="Select gender"
                data={[
                  { value: 'male',   label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'others', label: 'Others' },
                ]}
                value={gender}
                onChange={setGender}
                radius="md"
                size="md"
                styles={{ input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', borderRadius: 12 }, label: labelStyle }}
              />

              <DatePickerInput
                withAsterisk
                label="Birthday"
                placeholder="Pick date"
                value={birthday}
                onChange={setBirthday}
                maxDate={new Date()}
                radius="md"
                size="md"
                clearable
                styles={{ input: { backgroundColor: 'var(--mm-bg-body)', border: 'none', borderRadius: 12 }, label: labelStyle }}
              />
            </SimpleGrid>
          </Stack>
        </Paper>

        {/* ── Security (collapsible) ─────────────────────────────────────── */}
        <Paper radius={20} style={{ border: '1px solid var(--mm-border-color)', backgroundColor: 'var(--mm-bg-surface)', overflow: 'hidden' }}>
          {/* Toggle header */}
          <Group
            justify="space-between"
            p={24}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSecOpen(o => !o)}
          >
            <Group gap="sm">
              <ThemeIcon variant="light" color="#0f4c5c" size="lg" radius="md">
                <IconShieldLock size={18} />
              </ThemeIcon>
              <Text fw={800} size="sm">Security</Text>
            </Group>
            <ActionIcon variant="subtle" color="gray">
              {secOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
            </ActionIcon>
          </Group>

          <Collapse in={secOpen}>
            <Divider />
            <Box p={24}>
              <Stack gap="md">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.currentTarget.value)}
                  radius="md"
                  size="md"
                  styles={{ ...inputStyle, label: labelStyle }}
                />

                <Popover
                  opened={popoverOpen}
                  position="bottom"
                  width="target"
                  transitionProps={{ transition: 'pop' }}
                  radius="lg"
                >
                  <Popover.Target>
                    <PasswordInput
                      label="New Password"
                      placeholder="Min. 8 characters"
                      value={newPw}
                      onChange={(e) => setNewPw(e.currentTarget.value)}
                      onFocus={() => setPopoverOpen(true)}
                      onBlur={() => setPopoverOpen(false)}
                      radius="md"
                      size="md"
                      styles={{ ...inputStyle, label: labelStyle }}
                    />
                  </Popover.Target>
                  <Popover.Dropdown p="md">
                    <Progress color={pwColor} value={strength * 20} size="xs" mb="sm" />
                    {pwChecks.map((c, i) => <Req key={i} {...c} />)}
                  </Popover.Dropdown>
                </Popover>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* ── Action Buttons ──────────────────────────────────────────────── */}
        <Group grow gap="md">
          <Button
            size="lg"
            radius="xl"
            style={{ backgroundColor: 'var(--mm-color-primary)', height: 52 }}
            loading={loading || uploading}
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button
            size="lg"
            radius="xl"
            variant="filled"
            style={{ backgroundColor: 'var(--mm-border-color)', color: 'var(--mm-text-main)', height: 52 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Group>

        <Divider />

        <Group justify="center">
          <Button variant="subtle" color="red" leftSection={<IconTrash size={15} />} size="sm">
            Deactivate my account
          </Button>
        </Group>

      </Stack>
    </Container>
  );
};

export default UserProfile;
