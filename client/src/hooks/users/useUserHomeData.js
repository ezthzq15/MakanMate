import { useState, useEffect } from 'react';

export const useUserHomeData = (props = {}) => {
  const { onSuccess, onMutate, onError } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (onMutate) onMutate();
      try {
        setLoading(true);
        // Mocking API call for user homepage data
        await new Promise(resolve => setTimeout(resolve, 800));

        const homeData = {
          // ... existing data ...
          hero: {
            title: "Find Good Food in Penang, Anytime.",
            image: "/3gmbrmakanan.png"
          },
          features: [
            { id: 1, title: "Personalized Food Suggestions", color: "#FF8A65", image: "/Personalized Recommendations.png" },
            { id: 2, title: "Nearby Eats with Live GPS", color: "#004D40", image: "/PC.png" },
            { id: 3, title: "Interactive Map Explorer", color: "#FFF176", image: "/Maps.png" },
            { id: 4, title: "Plan Ahead or Go Instant Mode", color: "#81D4FA", image: "/PlannedMode.png" }
          ],
          featuredItem: {
            title: "Teo Chew ChenduL",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            rating: 4.5,
            isMuslimFriendly: true,
            mainImage: "/cendol.png",
            topPicked: [
              { id: 1, label: "Chendul mangga", image: "/cendol.png" },
              { id: 2, label: "Chendul mangga", image: "/cendol.png" },
              { id: 3, label: "Chendul mangga", image: "/cendol.png" }
            ]
          },
          nearbyRestaurants: [
            { id: 1, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/laksa.png" },
            { id: 2, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/mee kari.png" },
            { id: 3, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/laksa.png" },
            { id: 4, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/mee kari.png" }
          ],
          trendingFoods: [
            { id: 1, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/laksa.png" },
            { id: 2, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/mee kari.png" },
            { id: 3, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/laksa.png" },
            { id: 4, name: "Restoran Tajuddin Hussain", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "/mee kari.png" }
          ]
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

    fetchData();
  }, []);

  return { data, loading };
};
