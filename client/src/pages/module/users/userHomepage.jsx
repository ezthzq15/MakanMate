import React from 'react';
import { useUserHomeData } from '../../../hooks/users/useUserHomeData';
import HomepageUI from '../../../components/users/homepage/homepage';
import { Loader, Center } from '@mantine/core';

const UserHomepage = () => {
  const { data, loading } = useUserHomeData({
    onSuccess: (data) => console.log('Successfully loaded homepage data', data),
    onError: (err) => console.error('Error loading homepage data', err)
  });

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader color="brand" size="xl" type="dots" />
      </Center>
    );
  }

  return <HomepageUI data={data} />;
};

export default UserHomepage;
