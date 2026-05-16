import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Image, Title, Text, 
  Group, Badge, Stack, Box, Button, 
  ActionIcon, rem, useMantineTheme, Tabs,
  Divider, Paper, Skeleton, Center, Rating, Progress, Tooltip
} from '@mantine/core';
import { 
  IconHeart, IconHeartFilled, IconShare, 
  IconStarFilled, IconMapPin, IconClock, 
  IconCircleCheck, IconPlus, IconChevronRight,
  IconCurrentLocation, IconLeaf, IconCurrencyDollar,
  IconThumbUp
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useViewStalls } from '../../../../hooks/users/useViewStalls';
import apiClient from '../../../../lib/apiClient';
import { isAuthenticated } from '../../../../utils/auth';
import StallMenu from './stallMenu';
import RateAndReviewStalls from './rate&reviewStalls';
import GoogleMapWrapper from '../../../common/GoogleMapWrapper';
import { MarkerF } from '@react-google-maps/api';
import { useRedeemVoucher } from '../../../../hooks/users/useRedeemVoucher';
import VoucherCheckInModal from './VoucherCheckInModal';
import { IconTicket } from '@tabler/icons-react';

/**
 * COMPONENT: Revamped Detailed Stall View (FR09)
 */
const ViewStalls = ({ stallId }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const { stall, loading, isSaved, toggleBookmark, refresh } = useViewStalls(stallId);
  const [recommendations, setRecommendations] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [stallVouchers, setStallVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherModalOpened, setVoucherModalOpened] = useState(false);

  const {
    loading: voucherLoading,
    checkInState,
    redemptionData,
    requestCheckIn,
    resetVoucherState
  } = useRedeemVoucher();

  // Fetch active vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await apiClient.get(`/vouchers/stall/${stallId}`);
        setStallVouchers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch vouchers', err);
      }
    };
    if (stallId) fetchVouchers();
  }, [stallId]);

  // Share functionality
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    notifications.show({
      title: 'Link Copied',
      message: 'Stall link has been copied to your clipboard',
      color: 'teal',
      icon: <IconShare size={16} />
    });
  };

  // Like Menu Item functionality
  const handleLikeMenu = async (menuId) => {
    if (!isAuthenticated()) {
      notifications.show({
        title: 'Login Required',
        message: 'Please login to like menu items',
        color: 'yellow'
      });
      return;
    }

    try {
      await apiClient.post('/engagement/menu/like', { menuId });
      refresh(); // Refresh stall data to show new like count
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update like status',
        color: 'red'
      });
    }
  };

  // Fetch recommendations for "You might also like"
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await apiClient.get('/recommendation', { params: { limit: 3 } });
        setRecommendations(res.data?.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      }
    };
    fetchRecs();
  }, []);

  // Fetch reviews to calculate breakdown
  useEffect(() => {
    const fetchReviews = async () => {
      if (!stallId) return;
      try {
        const res = await apiClient.get(`/engagement/stall/${stallId}`);
        setReviewsData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch reviews data', err);
      }
    };
    fetchReviews();
  }, [stallId]);

  // Calculate Rating Breakdown
  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(r => {
      const score = Math.round(r.ratingScore);
      if (counts[score] !== undefined) counts[score]++;
    });
    return counts;
  }, [reviewsData]);

  // Sort Menu by Likes for "Most Ordered" (Top 3)
  const mostOrderedItems = useMemo(() => {
    if (!stall?.menu) return [];
    return [...stall.menu]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3);
  }, [stall?.menu]);

  const handleReviewSuccess = () => {
    refresh();
    setActiveTab('reviews');
  };

  if (loading) {
    return (
      <div className="stall-detail-container">
        <Skeleton height={450} radius={24} mb="xl" />
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Skeleton height={60} width="70%" mb="md" />
            <Skeleton height={20} width="40%" mb="xl" />
            <Skeleton height={300} radius={24} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Skeleton height={400} radius={24} />
          </Grid.Col>
        </Grid>
      </div>
    );
  }

  if (!stall) return <Center h="50vh"><Text>Stall not found.</Text></Center>;

  const displayRating = stall.reviewCount > 0 ? (stall.rating || '0.0') : '0.0';

  const handleOpenVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    resetVoucherState();
    setVoucherModalOpened(true);
  };

  return (
    <div className="stall-detail-container">
      <Stack gap={40}>
        
        {/* 1. Hero Image Section */}
        <div className="hero-wrapper">
          <img 
            src={stall.imageURL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200'} 
            alt={stall.stallName}
            className="hero-image"
          />
          <div className="halal-badge">
            <IconLeaf size={16} color={stall.isHalal ? '#0ca678' : '#fa5252'} />
            <span>{stall.isHalal ? 'HALAL' : 'NON-HALAL'}</span>
          </div>
        </div>

        <Grid gutter={50}>
          {/* LEFT COLUMN: Main Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap={32}>
              
              {/* Header: Title & Actions (Separated Rows per User Request) */}
              <Box>
                <Stack gap="xs" mb="md">
                  <h1 className="stall-title" style={{ marginBottom: 0 }}>{stall.stallName}</h1>
                  <Group gap="sm">
                    <Tooltip label="Copy Link">
                      <ActionIcon size="xl" variant="light" color="gray" radius="xl" onClick={handleShare}>
                        <IconShare size={20} />
                      </ActionIcon>
                    </Tooltip>
                    <Button 
                      variant={isSaved ? 'filled' : 'outline'} 
                      color={isSaved ? 'brand' : 'gray'} 
                      radius="xl"
                      size="md"
                      leftSection={isSaved ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                      onClick={toggleBookmark}
                      px={24}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </Group>
                </Stack>

                {/* Info Badges Row */}
                <Group gap="sm">
                  <div className="info-badge primary">
                    <IconCurrentLocation size={16} />
                    <span>{stall.distance || '800m'} away</span>
                  </div>
                  <div className="info-badge">
                    <IconLeaf size={16} color="#0ca678" />
                    <span>Muslim Friendly</span>
                  </div>
                  <div className="info-badge">
                    <IconCurrencyDollar size={16} />
                    <span>{stall.budgetRange || 'RM 20 - RM 50'}</span>
                  </div>
                  <div className="info-badge">
                    <IconClock size={16} />
                    <span>{stall.operatingHours || 'Not specified'}</span>
                  </div>
                  <div className="info-badge rating">
                    <IconStarFilled size={14} color="#fab005" />
                    <span>{displayRating} ({stall.reviewCount || 0} reviews)</span>
                  </div>
                </Group>
              </Box>

              <Text size="lg" c="dimmed" style={{ lineHeight: 1.8, fontSize: rem(18) }}>
                {stall.description || 'Famous Penang Road cendul with rich gula melaka, smooth coconut milk, and soft green jelly. A must-try local dessert that cools you down on a hot day.'}
              </Text>

              {/* Most Ordered Section (Top 3) */}
              <Box>
                <Title order={3} mb="xl" style={{ fontSize: rem(24) }}>Most Ordered</Title>
                <Grid gutter="md">
                  {(mostOrderedItems.length > 0 ? mostOrderedItems : [1,2,3]).map((item, idx) => (
                    <Grid.Col key={item.menuID || idx} span={{ base: 12, sm: 4 }}>
                      <Paper className="most-ordered-card" withBorder p="md" radius="xl">
                        <Image 
                          src={item.menuPic || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400'} 
                          height={140} 
                          radius="lg" 
                          mb="sm" 
                        />
                        <Stack gap={2}>
                          <Text fw={700} size="md" truncate>{item.menuName || 'Item'}</Text>
                          <Group justify="space-between" align="center">
                            <Box>
                              <Text size="md" fw={800} c="brand">RM {parseFloat(item.menuPrice || 0).toFixed(2)}</Text>
                              {item.likes > 0 && (
                                <Group gap={4}>
                                  <IconHeartFilled size={10} color="#e03131" />
                                  <Text size="xs" fw={700} c="dimmed">{item.likes}</Text>
                                </Group>
                              )}
                            </Box>
                            <Tooltip label="Love this item">
                               <ActionIcon 
                                 variant={item.isLiked ? 'filled' : 'light'} 
                                 color={item.isLiked ? 'red' : 'gray'} 
                                 radius="md"
                                 onClick={() => handleLikeMenu(item.menuID)}
                               >
                                 <IconHeartFilled size={16} />
                               </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Stack>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>

              {/* Tabs Section */}
              <Tabs 
                value={activeTab} 
                onChange={setActiveTab} 
                variant="pills" 
                color="brand" 
                mt="xl"
                styles={{
                  root: { borderTop: '1px solid #f1f3f5', paddingTop: rem(40) },
                  tab: { 
                    fontWeight: 700, 
                    fontSize: rem(16), 
                    padding: `${rem(12)} ${rem(24)}`,
                    borderRadius: rem(12)
                  }
                }}
              >
                <Tabs.List mb="xl">
                  <Tabs.Tab value="menu">Menu</Tabs.Tab>
                  <Tabs.Tab value="reviews">Reviews ({stall.reviewCount || 0})</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="menu">
                  <StallMenu items={stall.menu} onRefresh={refresh} onLike={handleLikeMenu} />
                </Tabs.Panel>

                <Tabs.Panel value="reviews">
                  <Stack gap={40}>
                    <RateAndReviewStalls 
                      stallId={stallId} 
                      stallName={stall.stallName} 
                      onReviewSuccess={handleReviewSuccess} 
                    />
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Grid.Col>

          {/* RIGHT COLUMN: Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap={24}>
              
              {/* Mini Map */}
              <div 
                className="sidebar-section" 
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => {
                  if (stall?.latitude && stall?.longitude) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${stall.latitude},${stall.longitude}`, '_blank');
                  } else {
                    const query = encodeURIComponent(`${stall?.stallName || 'Food Stall'} Penang`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  }
                }}
              >
                <div className="map-container" style={{ position: 'relative', minHeight: '180px' }}>
                  {stall?.latitude && stall?.longitude ? (
                    <Box style={{ pointerEvents: 'none' }} w="100%" h="100%" pos="absolute" top={0} left={0}>
                      <GoogleMapWrapper
                        center={{ lat: stall.latitude, lng: stall.longitude }}
                        zoom={15}
                        options={{ disableDefaultUI: true, gestureHandling: 'none' }}
                      >
                        <MarkerF position={{ lat: stall.latitude, lng: stall.longitude }} />
                      </GoogleMapWrapper>
                    </Box>
                  ) : (
                    <Center h="100%">
                      <Stack align="center" gap={4}>
                        <IconMapPin size={32} color={theme.colors.brand[6]} />
                        <Text fw={700} size="sm">{stall?.stallName || 'Food Stall'}</Text>
                      </Stack>
                    </Center>
                  )}
                  <div className="distance-tag" style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    <IconCurrentLocation size={12} color={theme.colors.brand[6]} />
                    <span>{stall?.distance || '800m'} away</span>
                  </div>
                </div>
                <Box p="md" 
                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                     style={{ transition: 'background-color 0.2s ease' }}
                >
                   <Group gap="xs" wrap="nowrap">
                     <IconMapPin size={16} color="gray" />
                     <Text size="xs" fw={500} c="dimmed">
                       {stall?.stallName || 'Food Stall Location'}
                     </Text>
                   </Group>
                   <Text size="xs" c="brand" fw={600} mt={8} ta="center">Tap to view directions</Text>
                </Box>
              </div>

              {/* Vouchers Section */}
              {stallVouchers.length > 0 && (
                <div className="sidebar-section" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                  <Group gap="xs" mb="md">
                    <IconTicket size={24} color="var(--mantine-color-brand-6)" />
                    <h3 className="sidebar-title" style={{ margin: 0, color: 'var(--mantine-color-dark-8)' }}>Available Vouchers</h3>
                  </Group>
                  <Stack gap="sm">
                    {stallVouchers.map((v) => {
                      const formatDiscount = (v) => {
                        if (v.discountType === 'Percentage') return `${v.discountValue}%`;
                        if (v.discountType === 'Fixed Amount') return `RM ${v.discountValue}`;
                        return v.discount || '';
                      };
                      return (
                      <Paper 
                        key={v.id} 
                        p="md" 
                        radius="md" 
                        withBorder 
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease', 
                          borderColor: 'var(--mantine-color-brand-2)',
                          background: 'linear-gradient(135deg, var(--mantine-color-brand-0) 0%, white 100%)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => handleOpenVoucher(v)}
                      >
                        {/* Decorative ticket cutouts */}
                        <Box style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--mantine-color-gray-0)', borderRight: '1px solid var(--mantine-color-brand-2)', zIndex: 1 }} />
                        <Box style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--mantine-color-gray-0)', borderLeft: '1px solid var(--mantine-color-brand-2)', zIndex: 1 }} />
                        
                        <Group justify="space-between" wrap="nowrap" px="xs" style={{ position: 'relative', zIndex: 2 }}>
                          <Box style={{ minWidth: '60px', textAlign: 'center' }}>
                            <Text fw={800} size="xl" c="brand.9" style={{ lineHeight: 1 }}>{formatDiscount(v)}</Text>
                            <Text size="10px" c="brand.7" fw={700} tt="uppercase" mt={4} letterSpacing={0.5}>Discount</Text>
                          </Box>
                          
                          <Divider orientation="vertical" variant="dashed" color="brand.3" style={{ height: '40px' }} />

                          <Box style={{ flex: 1 }} pl="xs">
                            <Text fw={700} c="dark.8" size="sm" lineClamp={2} style={{ lineHeight: 1.3 }}>{v.title}</Text>
                            {v.minSpend ? (
                              <Text size="xs" c="dimmed" mt={2}>Min Spend: RM {v.minSpend}</Text>
                            ) : null}
                            <Group gap={4} mt={v.minSpend ? 2 : 6}>
                              <Text size="10px" c="dimmed" fw={600} tt="uppercase" letterSpacing={0.5}>Tap to redeem</Text>
                              <IconChevronRight size={12} color="var(--mantine-color-gray-5)" stroke={2.5} />
                            </Group>
                          </Box>
                        </Group>
                      </Paper>
                    )})}
                  </Stack>
                </div>
              )}

              {/* About Stall */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">About Stall</h3>
                <Stack gap={0}>
                  <div className="about-row">
                    <span className="about-label">Cuisine</span>
                    <span className="about-value">{stall.cuisineType || 'Not specified'}</span>
                  </div>
                  <Divider variant="dashed" my={10} />
                  <div className="about-row">
                    <span className="about-label">Halal</span>
                    <span className="about-value">{stall.isHalal ? 'Yes' : 'No'}</span>
                  </div>
                  <Divider variant="dashed" my={10} />
                  <div className="about-row">
                    <span className="about-label">Opening Hours</span>
                    <span className="about-value">{stall.operatingHours || 'Not specified'}</span>
                  </div>
                </Stack>
              </div>

              {/* Reviews Summary */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">Reviews ({stall.reviewCount || 0})</h3>
                <Group align="flex-end" gap={8} mb="xl">
                   <Text fz={48} fw={800} style={{ lineHeight: 1 }}>{displayRating}</Text>
                   <Stack gap={4}>
                      <Rating value={parseFloat(displayRating)} readOnly color="yellow" size="sm" />
                      <Text size="xs" c="dimmed">({stall.reviewCount || 0} reviews)</Text>
                   </Stack>
                </Group>
                
                <Stack gap="xs">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingBreakdown[star] || 0;
                    const total = Object.values(ratingBreakdown).reduce((a,b) => a+b, 0) || 1;
                    const percent = (count / total) * 100;
                    return (
                      <div key={star} className="rating-bar-wrapper">
                        <Text size="xs" fw={700} w={20}>{star}★</Text>
                        <div className="rating-bar-bg">
                           <div className="rating-bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                        <Text size="xs" c="dimmed" w={30} ta="right">{count}</Text>
                      </div>
                    );
                  })}
                </Stack>
                <Button 
                  variant="light" 
                  color="gray" 
                  fullWidth 
                  mt="xl" 
                  radius="md"
                  onClick={() => setActiveTab('reviews')}
                >
                  Read all reviews
                </Button>
              </div>

              {/* You might also like */}
              <div className="sidebar-section">
                <Group justify="space-between" mb="lg">
                  <h3 className="sidebar-title" style={{ margin: 0 }}>You might also like</h3>
                  <Text 
                    size="xs" 
                    fw={700} 
                    c="brand" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/search')}
                  >
                    View all
                  </Text>
                </Group>
                <Stack gap="md">
                  {(recommendations.length > 0 ? recommendations.slice(0, 3) : [
                    { id: 1, stallName: 'Penang Road Laksa', rating: 4.6, distance: '600m' },
                    { id: 2, stallName: 'Nasi Kandar Line Clear', rating: 4.7, distance: '850m' },
                    { id: 3, stallName: 'Kimberley Street CKT', rating: 4.5, distance: '1.1km' }
                  ]).map((rec, idx) => (
                    <Group key={rec.id || idx} wrap="nowrap" gap="sm">
                       <Image 
                         src={rec.imageURL || `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=100`} 
                         w={60} 
                         h={60} 
                         radius="lg" 
                       />
                       <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={700}>{rec.stallName}</Text>
                          <Group gap={4}>
                             <IconStarFilled size={10} color="#fab005" />
                             <Text size="xs" fw={700}>{rec.rating || '4.5'}</Text>
                             <Text size="xs" c="dimmed">•</Text>
                             <Text size="xs" c="dimmed">{rec.distance || '1.2km'} away</Text>
                          </Group>
                       </Box>
                       <ActionIcon 
                         variant="transparent" 
                         color="gray"
                         onClick={() => navigate(`/stall-detail/${rec.id}`)}
                       >
                         <IconChevronRight size={16} />
                       </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </div>

            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
      
      <VoucherCheckInModal 
        opened={voucherModalOpened}
        onClose={() => setVoucherModalOpened(false)}
        voucher={selectedVoucher}
        checkInState={checkInState}
        requestCheckIn={requestCheckIn}
        redemptionData={redemptionData}
      />
    </div>
  );
};

export default ViewStalls;
