import React from 'react';
import { useUserHomeData } from '../../../hooks/users/useUserHomeData';
import HomepageUI from '../../../components/users/homepage/homepage';
import TopPicked from '../../../components/users/homepage/topPicked';
import TrendingDeals from '../../../components/users/homepage/trendingDeals';
import { Loader, Center, Stack } from '@mantine/core';

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

  return (
    <Stack gap={0}>
      <HomepageUI data={data} />
      <TopPicked />
      <TrendingDeals data={data} />
    </Stack>
  );
};

export default UserHomepage;
