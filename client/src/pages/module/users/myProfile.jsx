import React, { useState, useEffect } from 'react';
import UserProfile from '../../../components/users/myprofile/userProfile';
import { Loader, Center, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch profile');

            const data = await response.json();
            setProfile(data);
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

    const handleSave = async (updatedData) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update profile');
            }

            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'teal'
            });
            
            // Refresh local state with updated info
            setProfile(prev => ({ ...prev, name: updatedData.name }));
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
        window.location.href = '/home';
    };

    if (loading) {
        return (
            <Center style={{ height: '70vh' }}>
                <Loader color="#0f4c5c" size="xl" type="dots" />
            </Center>
        );
    }

    return (
        <Container fluid p={0} style={{ backgroundColor: '#fff' }}>
             <UserProfile 
                profile={profile} 
                onSave={handleSave} 
                onCancel={handleCancel}
                loading={updating}
            />
        </Container>
    );
};

export default MyProfile;
