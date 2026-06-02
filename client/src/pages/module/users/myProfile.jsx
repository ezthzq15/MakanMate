import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../../components/users/myprofile/userProfile';
import UserPreference from '../../../components/users/myprofile/userPreference';
import RewardsChallenges from '../../../components/users/myprofile/RewardsChallenges';
import { Loader, Center, Container, Grid, Paper, UnstyledButton, Text, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUser, IconSettings, IconTrophy } from '@tabler/icons-react';
import apiClient from '../../../lib/apiClient';

const MyProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/auth/profile');
            setProfile(response.data);
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'Could not load profile data',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedData, onSuccess) => {
        setUpdating(true);
        try {
            const response = await apiClient.put('/auth/profile', updatedData);
            const result = response.data;

            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'teal'
            });
            
            // Refresh local state with updated info
            setProfile(prev => ({
                ...prev,
                userName:   updatedData.userName,
                userPhone:  updatedData.userPhone,
                address:    updatedData.address,
                gender:     updatedData.gender,
                birthday:   updatedData.birthday,
                profilePic: updatedData.profilePic,
            }));

            // Clear dirty / unsaved-changes state
            if (onSuccess) onSuccess();
        } catch (error) {
            notifications.show({
                title: 'Update Failed',
                message: error.message,
                color: 'red'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    if (loading) {
        return (
            <Center style={{ height: '70vh' }}>
                <Loader color="#0f4c5c" size="xl" type="dots" />
            </Center>
        );
    }

    const menuItems = [
      { id: 'profile', label: 'My Profile', icon: IconUser },
      { id: 'preference', label: 'User Preference', icon: IconSettings },
      { id: 'rewards', label: 'Rewards & Challenges', icon: IconTrophy }
    ];

    return (
        <Container size="xl" py={40} style={{ backgroundColor: 'transparent', minHeight: '80vh' }}>
            <Grid gutter={40}>
                {/* Sidebar Navigation */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper p="md" radius="lg" withBorder style={{ backgroundColor: 'var(--mm-bg-surface)', borderColor: 'var(--mm-border-color)' }}>
                        <Stack gap="xs">
                            {menuItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                <UnstyledButton
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        color: isActive ? 'var(--mm-text-on-primary)' : 'var(--mm-text-main)',
                                        backgroundColor: isActive ? 'var(--mm-color-primary)' : 'transparent',
                                        transition: 'background-color 0.2s ease, color 0.2s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <item.icon size={20} stroke={2} />
                                        <Text fw={600} size="sm">{item.label}</Text>
                                    </div>
                                </UnstyledButton>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Main Content Area */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    {activeTab === 'profile' && (
                        <UserProfile 
                            profile={profile} 
                            onSave={handleSave} 
                            onCancel={handleCancel}
                            loading={updating}
                        />
                    )}
                    {activeTab === 'preference' && (
                        <UserPreference />
                    )}
                    {activeTab === 'rewards' && (
                        <RewardsChallenges profile={profile} />
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default MyProfile;
