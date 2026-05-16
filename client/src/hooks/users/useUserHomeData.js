import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

/**
 * HOOK: useUserHomeData
 * Fetches real data from the backend to power the user homepage.
 * - Uses browser GPS to find nearby stalls
 * - Trending = sorted by review count (most liked)
 * - Recommendations = personalised via /recommendations
 */
export const useUserHomeData = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async (lat, lng) => {
      if (onMutate) onMutate();
      try {
        setLoading(true);

        const [recommendationsRes, nearbyRes, trendingRes, bookmarksRes, checkInsRes] = await Promise.all([
          // Personalised recommendations
          apiClient.get('/recommendations').catch(() => ({ data: { stalls: [] } })),
          // Nearby stalls using GPS coords
          apiClient.get('/stalls/search', {
            params: { lat, lng, limit: 10 }
          }).catch(() => ({ data: { stalls: [] } })),
          // Trending = highest review count
          apiClient.get('/stalls/search', {
            params: { limit: 10, sortBy: 'reviewCount' }
          }).catch(() => ({ data: { stalls: [] } })),
          // Bookmarks
          apiClient.get('/engagement/my').catch(() => ({ data: [] })),
          // Check-ins
          apiClient.get('/vouchers/my-checkins').catch(() => ({ data: [] })),
        ]);

        const nearby = nearbyRes.data.stalls || [];
        const trending = trendingRes.data.stalls || [];
        const bookmarks = bookmarksRes.data || [];
        const checkIns = checkInsRes.data || [];
        console.log('Check-ins from API:', checkIns);
        const featured = recommendationsRes.data.stalls?.[0] || nearby?.[0] || null;

        const homeData = {
          hero: { title: "Find Good Food in\nPenang Anytime." },
          features: [
            { id: 1, title: "Personalized Food Suggestions", color: "#FF8A65", image: "/Personalized Recommendations.png", description: "Get recommendations that match your taste and preferences." },
            { id: 2, title: "Nearby Eats with Live GPS",     color: "#004D40", image: "/PC.png",                           description: "Find the best food around you in real-time." },
            { id: 3, title: "Interactive Map Explorer",       color: "#FFF176", image: "/Maps.png",                        description: "Explore food spots across Penang with ease." },
            { id: 4, title: "Plan Ahead or Go Instant Mode",  color: "#81D4FA", image: "/PlannedMode.png",                 description: "Plan your food hunt or find food on the go instantly." }
          ],
          featuredItem: featured ? {
            title:           featured.stallName,
            description:     featured.description || "A beloved Penang institution with authentic flavors and heritage recipes.",
            rating:          featured.overallRating || 4.5,
            isMuslimFriendly: featured.isHalal,
            mainImage:       featured.imageURL || '/cendol.png',
            topPicked: featured.menuItems?.slice(0, 3).map(m => ({
              label: m.itemName || m.name,
              image: m.imageURL  || '/cendol.png'
            })) || [{ label: "Chef's Special", image: featured.imageURL || '/cendol.png' }]
          } : null,

          // Nearby restaurants (GPS-based)
          nearbyRestaurants: nearby.map(s => ({
            id:          s.id,
            name:        s.stallName,
            description: s.description || '',
            image:       s.imageURL  || '/laksa.png',
            rating:      s.overallRating,
            reviews:     s.reviewCount,
            distance:    s.distance   ? `${(s.distance / 1000).toFixed(1)} km` : '—',
            cuisine:     s.cuisineType || 'Malay',
            isHalal:     s.isHalal,
          })),

          // Trending = most-reviewed stalls
          trendingFoods: trending.map(s => ({
            id:          s.id,
            name:        s.stallName,
            description: s.description || '',
            image:       s.imageURL  || '/mee kari.png',
            rating:      s.overallRating,
            reviews:     s.reviewCount,
            distance:    s.distance   ? `${(s.distance / 1000).toFixed(1)} km` : '—',
            cuisine:     s.cuisineType || 'Malay',
          })),

          // Saved Stalls
          savedStalls: bookmarks.map(s => ({
            id:          s.id,
            name:        s.name || s.stallName || 'Unnamed Stall',
            image:       s.imageURL  || '/laksa.png',
            reviews:     s.reviews || 0,
            cuisine:     Array.isArray(s.cuisine) ? s.cuisine[0] : (s.cuisine || 'Malay'),
          })),

          // Recently Visited (Check-ins)
          recentlyVisited: checkIns.map(c => ({
            id:          c.id,
            name:        c.stallName,
            image:       c.imageURL || '/mee kari.png',
            cuisine:     c.cuisineType || 'Malay',
            date:        c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          })),

          // District Heatmap — classify all stalls into Penang districts by lat/lng bounding boxes
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
            const allStallsForMap = [...nearby, ...trending];
            allStallsForMap.forEach(s => {
              const district = classify(Number(s.latitude || s.lat), Number(s.longitude || s.lng));
              if (district !== 'Other') counts[district] = (counts[district] || 0) + 1;
            });

            // Boost districts where the user has checked in
            checkIns.forEach(c => {
              const district = classify(Number(c.latitude || c.lat || 0), Number(c.longitude || c.lng || 0));
              if (district !== 'Other') counts[district] = (counts[district] || 0) + 3; // weight check-ins more
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

            // Always include top 2 districts; guarantee George Town if data is sparse
            if (sorted.length === 0) {
              return [
                { name: 'George Town', count: 0, label: 'Low Activity', color: '#a8c5b5' },
                { name: 'Bayan Lepas', count: 0, label: 'Low Activity', color: '#a8c5b5' },
              ];
            }
            return sorted.slice(0, 4);
          })(),
        };

        setData(homeData);
        if (onSuccess) onSuccess(homeData);
      } catch (err) {
        console.error("Failed to fetch home data", err);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    // Try GPS first, fall back to Penang default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
        ()    => fetchData(5.4141, 100.3288) // George Town, Penang fallback
      );
    } else {
      fetchData(5.4141, 100.3288);
    }
  }, []);

  return { data, loading };
};
