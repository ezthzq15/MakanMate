const { db } = require('../config/firebase');

// FULL Document IDs from Firestore
const targetStalls = [
  'klLb1O6SxpQMMeLPC5Py', // Air Itam Sister Curry Mee
  'XqS8opftGS80oKJjuQRU', // Ali Nasi Lemak Daun Pisang
  'ei04aYG253yryk6TTFfx', // Auntie\'s Char Koay Teow
  'PmiOW6Wtw9F0hegOiSmN', // Kapitan Restaurant
  'QvOft4hDkkOUiTGfTUAU'  // Line Clear Nasi Kandar
];

const menus = [
  // Air Itam Sister Curry Mee (klLb1O6SxpQMMeLPC5Py)
  {
    stallID: 'klLb1O6SxpQMMeLPC5Py',
    menuName: 'Signature Curry Mee (Standard)',
    menuPrice: 6.00,
    menuPic: 'https://images.unsplash.com/photo-1547928576-a4a33237eceb?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'The legendary sister\'s curry mee with cuttlefish, pig\'s blood, and tofu puff.',
    category: 'Mains'
  },
  {
    stallID: 'klLb1O6SxpQMMeLPC5Py',
    menuName: 'Curry Mee (Large)',
    menuPrice: 7.50,
    menuPic: 'https://images.unsplash.com/photo-1547928576-a4a33237eceb?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Bigger portion of the classic curry mee with extra toppings.',
    category: 'Mains'
  },
  {
    stallID: 'klLb1O6SxpQMMeLPC5Py',
    menuName: 'Side: Extra Cuttlefish',
    menuPrice: 2.00,
    menuPic: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Add more of our signature marinated cuttlefish to your bowl.',
    category: 'Add-ons'
  },
  {
    stallID: 'klLb1O6SxpQMMeLPC5Py',
    menuName: 'Side: Tofu Puffs (4pcs)',
    menuPrice: 1.50,
    menuPic: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Extra spongy tofu puffs that soak up all the curry goodness.',
    category: 'Add-ons'
  },
  {
    stallID: 'klLb1O6SxpQMMeLPC5Py',
    menuName: 'Signature Iced Kopi',
    menuPrice: 3.00,
    menuPic: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Traditional thick black coffee with condensed milk and ice.',
    category: 'Drinks'
  },

  // Ali Nasi Lemak Daun Pisang (XqS8opftGS80oKJjuQRU)
  {
    stallID: 'XqS8opftGS80oKJjuQRU',
    menuName: 'Nasi Lemak Bilis',
    menuPrice: 2.50,
    menuPic: 'https://images.unsplash.com/photo-1626700051175-656fc74e0b63?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Fragrant coconut rice with spicy sambal, anchovies, and hard-boiled egg.',
    category: 'Mains'
  },
  {
    stallID: 'XqS8opftGS80oKJjuQRU',
    menuName: 'Nasi Lemak Ayam Goreng',
    menuPrice: 5.50,
    menuPic: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Classic nasi lemak served with a crispy, spiced fried chicken leg.',
    category: 'Mains'
  },
  {
    stallID: 'XqS8opftGS80oKJjuQRU',
    menuName: 'Nasi Lemak Sotong',
    menuPrice: 6.00,
    menuPic: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Nasi lemak served with tender sambal squid.',
    category: 'Mains'
  },
  {
    stallID: 'XqS8opftGS80oKJjuQRU',
    menuName: 'Nasi Lemak Telur Goyang',
    menuPrice: 3.50,
    menuPic: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Nasi lemak topped with two perfectly wobbly soft-boiled eggs.',
    category: 'Mains'
  },
  {
    stallID: 'XqS8opftGS80oKJjuQRU',
    menuName: 'Signature Teh Tarik',
    menuPrice: 2.80,
    menuPic: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Pulled milk tea with a frothy top, served hot or cold.',
    category: 'Drinks'
  },

  // Auntie\'s Char Koay Teow (ei04aYG253yryk6TTFfx)
  {
    stallID: 'ei04aYG253yryk6TTFfx',
    menuName: 'Duck Egg Char Koay Teow',
    menuPrice: 9.00,
    menuPic: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Premium version using duck egg for a richer, creamier taste.',
    category: 'Mains'
  },
  {
    stallID: 'ei04aYG253yryk6TTFfx',
    menuName: 'Seafood Special CKT',
    menuPrice: 12.00,
    menuPic: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Loaded with extra large prawns, cockles, and squid slices.',
    category: 'Mains'
  },
  {
    stallID: 'ei04aYG253yryk6TTFfx',
    menuName: 'Standard Chicken Egg CKT',
    menuPrice: 7.50,
    menuPic: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Traditional street style char koay teow with chicken egg.',
    category: 'Mains'
  },
  {
    stallID: 'ei04aYG253yryk6TTFfx',
    menuName: 'Vegetarian Char Koay Teow',
    menuPrice: 7.00,
    menuPic: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Fried with bean sprouts, chives, and tofu. No meat or seafood.',
    category: 'Mains'
  },
  {
    stallID: 'ei04aYG253yryk6TTFfx',
    menuName: 'Fresh Calamansi Lime',
    menuPrice: 3.50,
    menuPic: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Cooling lime juice with sour plum to beat the heat.',
    category: 'Drinks'
  },

  // Kapitan Restaurant (PmiOW6Wtw9F0hegOiSmN)
  {
    stallID: 'PmiOW6Wtw9F0hegOiSmN',
    menuName: 'Milani Tandoori Chicken',
    menuPrice: 18.00,
    menuPic: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Kapitan\'s specialty creamy tandoori chicken marinated in cashew paste.',
    category: 'Tandoori'
  },
  {
    stallID: 'PmiOW6Wtw9F0hegOiSmN',
    menuName: 'Claypot Briyani Chicken',
    menuPrice: 16.50,
    menuPic: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Fragrant basmati rice cooked in a claypot with spiced chicken.',
    category: 'Mains'
  },
  {
    stallID: 'PmiOW6Wtw9F0hegOiSmN',
    menuName: 'Garlic Cheese Naan',
    menuPrice: 7.50,
    menuPic: 'https://images.unsplash.com/photo-1601356616077-695728ecf769?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Freshly baked naan with generous amounts of garlic and cheese.',
    category: 'Breads'
  },
  {
    stallID: 'PmiOW6Wtw9F0hegOiSmN',
    menuName: 'Butter Chicken Masala',
    menuPrice: 14.00,
    menuPic: 'https://images.unsplash.com/photo-1603894584134-f132f1782bb5?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Creamy tomato-based gravy with tender pieces of chicken.',
    category: 'Curries'
  },
  {
    stallID: 'PmiOW6Wtw9F0hegOiSmN',
    menuName: 'Mango Lassi',
    menuPrice: 8.50,
    menuPic: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Thick yogurt-based drink blended with sweet ripe mangoes.',
    category: 'Drinks'
  },

  // Line Clear Nasi Kandar (QvOft4hDkkOUiTGfTUAU)
  {
    stallID: 'QvOft4hDkkOUiTGfTUAU',
    menuName: 'Nasi Kandar Banjir',
    menuPrice: 14.00,
    menuPic: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Rice with a mix of all available curries for the ultimate flavor punch.',
    category: 'Mains'
  },
  {
    stallID: 'QvOft4hDkkOUiTGfTUAU',
    menuName: 'Honey Chicken (Ayam Madu)',
    menuPrice: 7.00,
    menuPic: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Deep-fried chicken coated in a sweet and spicy honey glaze.',
    category: 'Sides'
  },
  {
    stallID: 'QvOft4hDkkOUiTGfTUAU',
    menuName: 'Squid Curry (Kari Sotong)',
    menuPrice: 9.50,
    menuPic: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Large squid cooked in a thick, spicy and savory curry.',
    category: 'Sides'
  },
  {
    stallID: 'QvOft4hDkkOUiTGfTUAU',
    menuName: 'Salted Egg Fish',
    menuPrice: 5.50,
    menuPic: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Fried fish steak seasoned with salted egg and curry leaves.',
    category: 'Sides'
  },
  {
    stallID: 'QvOft4hDkkOUiTGfTUAU',
    menuName: 'Iced Milo Dinosaur',
    menuPrice: 4.50,
    menuPic: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&w=800&q=80',
    itemDescription: 'Iced Milo topped with an extra heap of Milo powder.',
    category: 'Drinks'
  }
];

async function seed() {
  console.log('Cleaning up ALL menu items to ensure fresh data...');
  const menuCol = db.collection('menu');
  const allDocs = await menuCol.get();
  const batch = db.batch();
  allDocs.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log('Cleared all existing menu items.');

  console.log('Starting Correct Seeding (using FULL stall IDs)...');
  
  for (const item of menus) {
    const now = new Date().toISOString();
    const data = {
      ...item,
      menuPrice: Number(item.menuPrice),
      isAvailable: true,
      createdDate: now,
      lastUpdated: now
    };
    
    await menuCol.add(data);
    console.log(`Added: ${item.menuName} for Stall: ${item.stallID}`);
  }
  
  console.log('Correct seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
