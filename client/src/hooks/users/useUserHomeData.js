import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

/**
 * HOOK: useUserHomeData
 * Staged loading: critical data renders immediately; secondary data fills in after.
 * - Stage 1 (fast): recommendations, trending, check-ins  → renders page shell
 * - Stage 2 (after render): nearby (GPS), bookmarks, heatmap → fills in remaining sections
 */
export const useUserHomeData = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const buildHomeData = ({ recommendations, nearby, trending, bookmarks, checkIns, allStalls }) => {
    const featured = recommendations?.[0] || nearby?.[0] || null;

    return {
      hero: { title: "Find Good Food in\nPenang Anytime." },
      features: [
        { id: 1, title: "Personalized Food Suggestions", color: "#FF8A65", image: "/Personalized Recommendations.png", description: "Get recommendations that match your taste and preferences." },
        { id: 2, title: "Nearby Eats with Live GPS",     color: "#004D40", image: "/PC.png",                           description: "Find the best food around you in real-time." },
        { id: 3, title: "Interactive Map Explorer",       color: "#FFF176", image: "/Maps.png",                        description: "Explore food spots across Penang with ease." },
        { id: 4, title: "Plan Ahead or Go Instant Mode",  color: "#81D4FA", image: "/PlannedMode.png",                 description: "Plan your food hunt or find food on the go instantly." }
      ],
      featuredItem: featured ? {
        title:            featured.stallName,
        description:      featured.description || "A beloved Penang institution with authentic flavors and heritage recipes.",
        rating:           featured.overallRating || 4.5,
        isMuslimFriendly: featured.isHalal,
        mainImage:        featured.imageURL || '/cendol.png',
        topPicked: featured.menuItems?.slice(0, 3).map(m => ({
          label: m.itemName || m.name,
          image: m.imageURL  || '/cendol.png'
        })) || [{ label: "Chef's Special", image: featured.imageURL || '/cendol.png' }]
      } : null,

      nearbyRestaurants: (nearby || []).map(s => ({
        id:          s.id,
        name:        s.stallName,
        description: s.description || '',
        image:       s.imageURL  || '/laksa.png',
        rating:      s.overallRating,
        reviews:     s.reviewCount,
        distance:    s.distance ? `${(s.distance / 1000).toFixed(1)} km` : '—',
        cuisine:     s.cuisineType || 'Malay',
        isHalal:     s.isHalal,
      })),

      trendingFoods: (trending || []).map(s => ({
        id:          s.id,
        name:        s.stallName,
        description: s.description || '',
        image:       s.imageURL  || '/mee kari.png',
        rating:      s.overallRating,
        reviews:     s.reviewCount,
        distance:    s.distance ? `${(s.distance / 1000).toFixed(1)} km` : '—',
        cuisine:     s.cuisineType || 'Malay',
      })),

      savedStalls: (bookmarks || []).map(s => ({
        id:      s.id,
        name:    s.name || s.stallName || 'Unnamed Stall',
        image:   s.imageURL  || '/laksa.png',
        reviews: s.reviews || 0,
        cuisine: Array.isArray(s.cuisine) ? s.cuisine[0] : (s.cuisine || 'Malay'),
      })),

      recentlyVisited: (checkIns || []).map(c => ({
        id:      c.id,
        name:    c.stallName,
        image:   c.imageURL || '/mee kari.png',
        cuisine: c.cuisineType || 'Malay',
        date:    c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      })),

      districtHeatmap: (() => {
        const DISTRICTS = [
          { name: 'George Town',    latMin: 5.38, latMax: 5.45, lngMin: 100.30, lngMax: 100.37 },
          { name: 'Bayan Lepas',    latMin: 5.27, latMax: 5.35, lngMin: 100.26, lngMax: 100.32 },
          { name: 'Air Itam',       latMin: 5.37, latMax: 5.42, lngMin: 100.27, lngMax: 100.33 },
          { name: 'Tanjung Tokong', latMin: 5.45, latMax: 5.50, lngMin: 100.29, lngMax: 100.34 },
          { name: 'Jelutong',       latMin: 5.38, latMax: 5.42, lngMin: 100.30, lngMax: 100.33 },
          { name: 'Balik Pulau',    latMin: 5.32, latMax: 5.37, lngMin: 100.20, lngMax: 100.27 },
        ];
        const classify = (lat, lng) => {
          for (const d of DISTRICTS) {
            if (lat >= d.latMin && lat <= d.latMax && lng >= d.lngMin && lng <= d.lngMax) return d.name;
          }
          return 'Other';
        };
        const counts = {};
        const stallsForMap = (allStalls?.length > 0 ? allStalls : [...(nearby || []), ...(trending || [])]);
        stallsForMap.forEach(s => {
          const stalLat = Number(s.location?.lat ?? s.latitude ?? s.lat ?? 0);
          const stalLng = Number(s.location?.lng ?? s.longitude ?? s.lng ?? 0);
          const district = classify(stalLat, stalLng);
          if (district !== 'Other') counts[district] = (counts[district] || 0) + 1;
        });
        (checkIns || []).forEach(c => {
          const ciLat = Number(c.location?.lat ?? c.latitude ?? c.lat ?? 0);
          const ciLng = Number(c.location?.lng ?? c.longitude ?? c.lng ?? 0);
          const district = classify(ciLat, ciLng);
          if (district !== 'Other') counts[district] = (counts[district] || 0) + 3;
        });
        const getActivityLabel = (count) => {
          if (count >= 10) return 'Heavy Activity';
          if (count >= 5)  return 'Moderate Activity';
          if (count >= 2)  return 'Growing Interest';
          return 'Low Activity';
        };
        const getActivityColor = (label) => {
          if (label === 'Heavy Activity')    return '#1a4d3c';
          if (label === 'Moderate Activity') return '#3A5A4A';
          if (label === 'Growing Interest')  return '#6b9e7e';
          return '#a8c5b5';
        };
        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count, label: getActivityLabel(count), color: getActivityColor(getActivityLabel(count)) }))
          .sort((a, b) => b.count - a.count);
        if (sorted.length === 0) {
          return [
            { name: 'George Town', count: 0, label: 'Low Activity', color: '#a8c5b5' },
            { name: 'Bayan Lepas', count: 0, label: 'Low Activity', color: '#a8c5b5' },
          ];
        }
        return sorted.slice(0, 4);
      })(),
    };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchCritical = async () => {
      if (onMutate) onMutate();
      try {
        // STAGE 1: Fetch critical data — no GPS needed, renders page immediately
        const [recommendationsRes, trendingRes, checkInsRes] = await Promise.all([
          apiClient.get('/recommendation').catch(() => ({ data: { stalls: [] } })),
          apiClient.get('/stalls/search', { params: { limit: 10, sortBy: 'reviewCount', skipMenu: true } }).catch(() => ({ data: { stalls: [] } })),
          apiClient.get('/vouchers/my-checkins').catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        const recommendations = recommendationsRes.data.stalls || [];
        const trending        = trendingRes.data.stalls       || [];
        const checkIns        = checkInsRes.data              || [];

        // Show page immediately with what we have
        const stage1Data = buildHomeData({ recommendations, nearby: [], trending, bookmarks: [], checkIns, allStalls: [] });
        setData(stage1Data);
        setLoading(false);

        // STAGE 2: Fetch secondary data in the background (GPS, bookmarks, heatmap)
        const getLocation = () => new Promise((resolve) => {
          if (!navigator.geolocation) return resolve({ lat: 5.4141, lng: 100.3288 });
          navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            ()  => resolve({ lat: 5.4141, lng: 100.3288 }),
            { enableHighAccuracy: false, timeout: 2000, maximumAge: 120000 }
          );
        });

        const { lat, lng } = await getLocation();
        if (cancelled) return;

        const [nearbyRes, bookmarksRes, allStallsRes] = await Promise.all([
          apiClient.get('/stalls/search', { params: { lat, lng, limit: 10, skipMenu: true } }).catch(() => ({ data: { stalls: [] } })),
          apiClient.get('/engagement/my').catch(() => ({ data: [] })),
          apiClient.get('/stalls/search', { params: { limit: 50, skipMenu: true } }).catch(() => ({ data: { stalls: [] } })),
        ]);

        if (cancelled) return;

        const nearby    = nearbyRes.data.stalls   || [];
        const bookmarks = bookmarksRes.data        || [];
        const allStalls = allStallsRes.data.stalls || [];

        // Merge stage 2 into final data
        const finalData = buildHomeData({ recommendations, nearby, trending, bookmarks, checkIns, allStalls });
        setData(finalData);
        if (onSuccess) onSuccess(finalData);

      } catch (err) {
        console.error("Failed to fetch home data", err);
        if (onError) onError(err);
        if (!cancelled) setLoading(false);
      }
    };

    fetchCritical();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
};

