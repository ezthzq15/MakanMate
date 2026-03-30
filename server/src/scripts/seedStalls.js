const { db } = require('../config/firebase');

const stalls = [
  {
    stallName: "Siam Road Charcoal Char Koay Teow",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4150,
    longitude: 100.3214,
    description: "Legendary uncle cooking charcoal char koay teow by the roadside. Expect long queues for his wok hei-infused masterpiece.",
    operatingHours: "12:00 PM - 6:00 PM (Closed Mon/Sun)",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Siam+Road+CKT"
  },
  {
    stallName: "Deen Maju Nasi Kandar",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4098,
    longitude: 100.3278,
    description: "One of the most popular Nasi Kandar spots in Penang. Famous for their fried chicken and rich, mixed curries (kuah campur).",
    operatingHours: "2:00 PM - 11:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Deen+Maju"
  },
  {
    stallName: "Penang Road Famous Teochew Chendul",
    cuisineType: "Dessert",
    isHalal: true,
    latitude: 5.4172,
    longitude: 100.3308,
    description: "Refreshing, icy chendul packed with green jelly noodles, red beans, fresh coconut milk, and rich gula melaka.",
    operatingHours: "10:30 AM - 7:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Teochew+Chendul"
  },
  {
    stallName: "Hameediyah Restaurant",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4187,
    longitude: 100.3323,
    description: "The oldest Nasi Kandar restaurant in Penang (since 1907). World-famous for its perfectly spiced curries and murtabak.",
    operatingHours: "10:00 AM - 10:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Hameediyah"
  },
  {
    stallName: "Air Itam Sister Curry Mee",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4005,
    longitude: 100.2778,
    description: "A heritage stall run by two elderly sisters. Offers authentic Penang curry mee with cuttlefish and fragrant sambal.",
    operatingHours: "7:30 AM - 1:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Sister+Curry+Mee"
  },
  {
    stallName: "Ali Nasi Lemak Daun Pisang",
    cuisineType: "Malay",
    isHalal: true,
    latitude: 5.4170,
    longitude: 100.3429,
    description: "Fiery, spicy, and satisfying nasi lemak wrapped in banana leaves. Located at Sri Weld Food Court.",
    operatingHours: "7:00 AM - 4:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Ali+Nasi+Lemak"
  },
  {
    stallName: "Line Clear Nasi Kandar",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4192,
    longitude: 100.3332,
    description: "Operating in an unassuming alley 24/7, serving heavily spiced curry, giant squids, and massive fish heads.",
    operatingHours: "24 Hours",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Line+Clear"
  },
  {
    stallName: "Roti Canai Transfer Road",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4214,
    longitude: 100.3308,
    description: "Iconic breakfast spot serving hot, crispy roti canai flooded with thick beef or chicken curry and a side of half-boiled eggs.",
    operatingHours: "7:00 AM - 12:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Roti+Canai+Transfer+Road"
  },
  {
    stallName: "Sup Hameed",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4225,
    longitude: 100.3337,
    description: "Hearty, deeply flavored Indian soups including ox-tail and mutton soup, served with crusty Bengali bread.",
    operatingHours: "7:00 AM - 2:00 AM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Sup+Hameed"
  },
  {
    stallName: "Chulia Street Wanton Mee",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4184,
    longitude: 100.3361,
    description: "Night-time hawker stall famous for springy egg noodles tossed in dark soy sauce, topped with char siew and wontons.",
    operatingHours: "6:00 PM - 11:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Chulia+Street+Wanton+Mee"
  },
  {
    stallName: "888 Hokkien Mee",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4121,
    longitude: 100.3314,
    description: "Located on Presgrave Street, they serve rich and sweet prawn broth noodles packed with roasted pork and prawn slices.",
    operatingHours: "4:00 PM - 11:30 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=888+Hokkien+Mee"
  },
  {
    stallName: "Toh Soon Cafe",
    cuisineType: "Hainanese",
    isHalal: true,
    latitude: 5.4189,
    longitude: 100.3324,
    description: "Alleyway kopitiam famous for charcoal-toasted bread, half-boiled eggs, and thick robust Hainanese coffee.",
    operatingHours: "8:00 AM - 6:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Toh+Soon+Cafe"
  },
  {
    stallName: "Nasi Kandar Beratur",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4168,
    longitude: 100.3381,
    description: "Located right next to Kapitan Keling Mosque. Literally named 'Queue Nasi Kandar' because it only opens at 10 PM and people line up early.",
    operatingHours: "10:00 PM - 9:00 AM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Nasi+Kandar+Beratur"
  },
  {
    stallName: "Kapitan Restaurant",
    cuisineType: "Northern Indian",
    isHalal: true,
    latitude: 5.4172,
    longitude: 100.3374,
    description: "Famed 24-hour joint specializing in sizzling Claypot Briyani and Tandoori chicken smothered in aromatic spices.",
    operatingHours: "24 Hours",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Kapitan+Tandoori"
  },
  {
    stallName: "Auntie's Char Koay Teow",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4152,
    longitude: 100.3241,
    description: "A hidden gem serving char koay teow with fresh duck egg and massive prawns. Packed with wok-hei.",
    operatingHours: "11:00 AM - 5:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Auntie+Char+Koay+Teow"
  },
  {
    stallName: "Sister Yao's Char Koay Kak",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4136,
    longitude: 100.3276,
    description: "Specializes in fried radish cake (Koay Kak) seasoned with soy sauce, preserved radish, and bean sprouts.",
    operatingHours: "7:00 AM - 1:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Sister+Yao+Koay+Kak"
  },
  {
    stallName: "Gurney Drive Pasembur",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4357,
    longitude: 100.3152,
    description: "The ultimate Malaysian salad! Fresh seafood, fritters, and veggies drenched in a sweet and spicy nut sauce loaded with flavors.",
    operatingHours: "5:00 PM - 1:00 AM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Gurney+Pasembur"
  },
  {
    stallName: "Pitt Street Koay Teow Th'ng",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4169,
    longitude: 100.3387,
    description: "Comforting flat rice noodles served in a clear, flavorful duck and pork broth topped with homemade eel fish balls.",
    operatingHours: "8:00 AM - 2:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Pitt+Street+Koay+Teow"
  },
  {
    stallName: "Kek Seng Coffee Shop",
    cuisineType: "Dessert",
    isHalal: true,
    latitude: 5.4162,
    longitude: 100.3300,
    description: "Nostalgic coffee shop famous for its homemade durian ice cream and old-school Ais Kacang.",
    operatingHours: "9:00 AM - 5:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Kek+Seng+Ice+Kacang"
  },
  {
    stallName: "Tai Tong Restaurant",
    cuisineType: "Dim Sum",
    isHalal: false,
    latitude: 5.4161,
    longitude: 100.3341,
    description: "Traditional push-cart dim sum experience in the heart of George Town. Classic Siew Mai and Har Gao.",
    operatingHours: "6:00 AM - 2:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Tai+Tong+Dim+Sum"
  },
  {
    stallName: "Lorong Selamat Char Koay Teow",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4173,
    longitude: 100.3245,
    description: "The famous stall operated by the lady in the red hat. Known for huge, juicy prawns and fiery noodles.",
    operatingHours: "11:00 AM - 6:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Lorong+Selamat+CKT"
  },
  {
    stallName: "Moh Teng Pheow Nyonya Koay",
    cuisineType: "Nyonya",
    isHalal: true,
    latitude: 5.4190,
    longitude: 100.3353,
    description: "Generations-old Nyonya kuih factory turned cafe. Sells spectacular artisan traditional sweet and savory treats.",
    operatingHours: "10:30 AM - 5:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Moh+Teng+Pheow"
  },
  {
    stallName: "Apom Chooi",
    cuisineType: "Snack",
    isHalal: true,
    latitude: 5.4225,
    longitude: 100.3207,
    description: "Famed sweet, airy, and soft Nyonya Apom completely cooked over charcoal stoves since the 1960s.",
    operatingHours: "1:30 PM - 8:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Apom+Chooi"
  },
  {
    stallName: "Nasi Padang Minang",
    cuisineType: "Malay/Indonesian",
    isHalal: true,
    latitude: 5.4208,
    longitude: 100.3327,
    description: "A massive, mouthwatering selection of spicy Minangkabau curries and side dishes located near Transfer Road.",
    operatingHours: "11:00 AM - 3:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Nasi+Padang+Minang"
  },
  {
    stallName: "Tajuddin Hussain",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4168,
    longitude: 100.3385,
    description: "Legendary Nasi Kandar establishment specifically revered for their rich, unadulterated Mutton Curry and Rose Chicken.",
    operatingHours: "11:00 AM - 3:30 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Tajuddin+Hussain"
  },
  {
    stallName: "Cintra Food Corner",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4173,
    longitude: 100.3340,
    description: "Nostalgic stall famous for hearty Bak Chang (meat dumplings) filled with pork, mushroom, salted egg, and chestnuts.",
    operatingHours: "9:00 AM - 6:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Cintra+Food+Corner"
  },
  {
    stallName: "Jawi House Cafe Gallery",
    cuisineType: "Jawi Peranakan",
    isHalal: true,
    latitude: 5.4155,
    longitude: 100.3364,
    description: "An elegant setting offering rare Jawi Peranakan dishes like Bamiyah (lamb stew) and Nasi Lemuni.",
    operatingHours: "11:00 AM - 9:30 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Jawi+House"
  },
  {
    stallName: "Hutton Lane Roti Bakar",
    cuisineType: "Indian Muslim",
    isHalal: true,
    latitude: 5.4196,
    longitude: 100.3302,
    description: "The iconic streetside Roti Bakar stacked and soaked heavily in beef curry or dhal, beloved by locals for hearty breakfasts.",
    operatingHours: "7:00 AM - 2:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Hutton+Lane+Roti"
  },
  {
    stallName: "Kedai Kopi Bobo",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.3853,
    longitude: 100.2982,
    description: "Popular local breakfast spot in Lip Sin area known for comforting pork noodles and rich kopi-o.",
    operatingHours: "7:30 AM - 1:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Kedai+Kopi+Bobo"
  },
  {
    stallName: "Ping Hwa Chicken Rice",
    cuisineType: "Chinese",
    isHalal: false,
    latitude: 5.4218,
    longitude: 100.3312,
    description: "Perfectly roasted and steamed chicken served atop fragrant oiled rice, a staple for quick hawker meals.",
    operatingHours: "10:30 AM - 3:00 PM",
    imageURL: "https://placehold.co/600x400/2c3e50/ffffff?text=Ping+Hwa+Chicken+Rice"
  }
];

async function seed() {
  // Clean up the accidental 'stalls' collection first
  const badSnapshot = await db.collection('stalls').get();
  if (!badSnapshot.empty) {
    const batch = db.batch();
    badSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned up ${badSnapshot.size} documents from accidental 'stalls' collection.`);
  }

  const collection = db.collection('FoodStalls');
  
  let count = 0;
  for (const stall of stalls) {
    try {
      stall.createdAt = new Date().toISOString();
      stall.updatedAt = new Date().toISOString();
      stall.averageRating = Number((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)); 
      stall.totalReviews = Math.floor(Math.random() * 500) + 10;
      
      const docRef = await collection.add(stall);
      await docRef.update({ stallID: docRef.id }); // Redundantly store ID as required by MakanMate schema
      
      console.log(`Added ${stall.stallName} with ID ${docRef.id}`);
      count++;
    } catch (e) {
      console.error(`Failed to add ${stall.stallName}:`, e);
    }
  }
  console.log(`\nSuccessfully populated ${count} authentic Penang stalls into FoodStalls!`);
  process.exit();
}

seed();
