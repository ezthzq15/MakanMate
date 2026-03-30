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
            { id: 1, name: "Restoran Tajuddin Hussain", description: "Legendary Nasi Kandar establishment famous for their rich, unadulterated Mutton Curry and Rose Chicken.", image: "/laksa.png" },
            { id: 2, name: "Sister Yao's Char Koay Kak", description: "Specializes in fried radish cake seasoned with soy sauce, preserved radish, and crispy bean sprouts.", image: "/mee kari.png" },
            { id: 3, name: "Hutton Lane Roti Bakar", description: "Iconic streetside Roti Bakar stacked and soaked heavily in beef curry, beloved for hearty breakfasts.", image: "/laksa.png" },
            { id: 4, name: "Deen Maju Nasi Kandar", description: "One of the most popular Nasi Kandar spots in Penang. Famous for their fried chicken and rich, mixed curries.", image: "/mee kari.png" }
          ],
          trendingFoods: [
            { id: 1, name: "Penang Road Famous Laksa", description: "Experience the authentic taste of Penang Assam Laksa, served hot with fresh mackerel broth.", image: "/laksa.png" },
            { id: 2, name: "Siam Road Charcoal CKT", description: "Legendary uncle cooking charcoal char koay teow by the roadside. Expect long queues for his masterpiece.", image: "/mee kari.png" },
            { id: 3, name: "888 Hokkien Mee", description: "Rich and sweet prawn broth noodles packed with roasted pork and prawn slices.", image: "/laksa.png" },
            { id: 4, name: "Moh Teng Pheow Nyonya Koay", description: "Generations-old Nyonya kuih factory turned cafe. Sells spectacular artisan traditional treats.", image: "/mee kari.png" }
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
