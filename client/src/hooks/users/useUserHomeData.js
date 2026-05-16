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

        const [recommendationsRes, nearbyRes, trendingRes, bookmarksRes] = await Promise.all([
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
        ]);

        const nearby = nearbyRes.data.stalls || [];
        const trending = trendingRes.data.stalls || [];
        const bookmarks = bookmarksRes.data || [];
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
            id:          s.id || s.stallID,
            name:        s.stallName,
            image:       s.imageURL  || '/laksa.png',
            reviews:     s.reviewCount || 0,
            cuisine:     s.cuisineType || 'Malay',
          })),
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
