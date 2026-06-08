/**
 * seed_menus.js
 * Populates the `menu` collection in Firestore.
 *
 * Strategy:
 *  - Pick 2 stalls per Penang region (George Town, Gurney/Pulau Tikus,
 *    Bayan Lepas, Air Itam, Balik Pulau, Butterworth)
 *  - Each stall gets 15+ menu items across realistic categories
 *
 * Run: node seed_menus.js
 */

require('dotenv').config();
const { db } = require('./src/config/firebase');

// ─── Helpers ────────────────────────────────────────────────────────────────
const now = new Date().toISOString();

function item(stallID, name, price, category, description, pic = '') {
  return {
    stallID,
    menuName:        name,
    menuPrice:       price,
    category,
    itemDescription: description,
    menuPic:         pic,
    isAvailable:     true,
    likes:           0,
    createdDate:     now,
    lastUpdated:     now,
  };
}

// ─── Stall ID map — look these up from Firestore ─────────────────────────────
// We fetch stall IDs dynamically so no hardcoding is needed.

const REGION_STALL_NAMES = {
  'George Town': [
    'Deen Maju Nasi Kandar',
    'Toh Soon Cafe',
  ],
  'Gurney / Pulau Tikus': [
    'Gurney Drive Pasembur',
    'Nasi Kandar Pelita',
  ],
  'Bayan Lepas': [
    'Masjid Negeri Mee Goreng Mamak',
    'Warung Dapur Melayu',
  ],
  'Air Itam': [
    'Air Itam Sister Curry Mee',
    'Nasi Ulam Warisan',
  ],
  'Balik Pulau': [
    'Laksa Balik Pulau',
    'Nasi Padang Minang',
  ],
  'Butterworth / Seberang Perai': [
    'Roti Canai Transfer Road',
    'Sup Hameed',
  ],
};

// All stall names we need
const ALL_TARGET_STALLS = Object.values(REGION_STALL_NAMES).flat();

// ─── Menu definitions per stall ──────────────────────────────────────────────
// Returns an array of menu item objects given a stallID.

function menusFor(stallName, stallID) {
  const menus = {

    // ── George Town ─────────────────────────────────────────────────────────

    'Deen Maju Nasi Kandar': [
      // Main Course
      item(stallID, 'Nasi Kandar Ayam Goreng',    9.00,  'Main Course', 'Crispy fried chicken over fragrant kandar rice topped with mixed curry gravy.'),
      item(stallID, 'Nasi Kandar Ikan Goreng',     9.50,  'Main Course', 'Fried mackerel with rich curry sauce ladled over steamed rice.'),
      item(stallID, 'Nasi Kandar Daging Merah',   11.00,  'Main Course', 'Tender beef in fiery red curry poured over kandar rice.'),
      item(stallID, 'Nasi Kandar Sotong',          10.50,  'Main Course', 'Squid cooked in thick masala curry served with rice.'),
      item(stallID, 'Nasi Kandar Telur Dadar',      7.50,  'Main Course', 'Fluffy omelette over rice with curry gravy — simple and satisfying.'),
      item(stallID, 'Nasi Campur Dalca',            8.50,  'Main Course', 'Rice with lentil curry and mixed vegetables.'),
      // Side Dishes
      item(stallID, 'Ayam Ros',                    5.00,  'Side Dish',   'Rose chicken — chicken marinated in aromatic rose and spice blend.'),
      item(stallID, 'Ikan Bilis Goreng',            3.00,  'Side Dish',   'Crispy fried anchovies, perfect alongside kandar rice.'),
      item(stallID, 'Papadom',                      1.00,  'Side Dish',   'Thin, crispy lentil wafer.'),
      item(stallID, 'Acar Awak',                    2.00,  'Side Dish',   'Tangy pickled vegetables with turmeric.'),
      item(stallID, 'Sayur Kubis Goreng',            3.50,  'Side Dish',   'Stir-fried cabbage with garlic.'),
      item(stallID, 'Telur Rebus',                  2.00,  'Side Dish',   'Hard-boiled egg served with curry gravy.'),
      // Drinks
      item(stallID, 'Teh Tarik',                   2.50,  'Drinks',      'Frothy pulled milk tea, a Malaysian classic.'),
      item(stallID, 'Kopi O',                       2.00,  'Drinks',      'Strong black Hainanese coffee.'),
      item(stallID, 'Milo Ais',                     3.50,  'Drinks',      'Iced Milo chocolate malt drink.'),
      item(stallID, 'Air Sirap Limau',              3.00,  'Drinks',      'Rose syrup with lime juice on ice.'),
      // Dessert
      item(stallID, 'Ais Kacang',                   4.50,  'Dessert',     'Shaved ice with red beans, corn, grass jelly, and rose syrup.'),
    ],

    'Toh Soon Cafe': [
      // Breakfast
      item(stallID, 'Roti Bakar Kaya',              4.50,  'Breakfast',   'Charcoal-toasted bread generously spread with homemade coconut jam.'),
      item(stallID, 'Roti Bakar Mentega',           3.50,  'Breakfast',   'Butter toast charcoal-grilled to crispy perfection.'),
      item(stallID, 'Half-Boiled Eggs (2 pcs)',     3.00,  'Breakfast',   'Soft half-boiled eggs served with soy sauce and white pepper.'),
      item(stallID, 'Kaya Butter Toast Set',        7.50,  'Breakfast',   'Roti bakar kaya + half-boiled eggs + hot drink combo.'),
      item(stallID, 'Roti Kahwin',                  5.00,  'Breakfast',   'Marriage toast — kaya AND butter layered between thick slices.'),
      // Drinks
      item(stallID, 'Kopi O Kosong',                2.00,  'Drinks',      'Black Hainanese coffee with no sugar.'),
      item(stallID, 'Kopi C',                       2.50,  'Drinks',      'Coffee with evaporated milk.'),
      item(stallID, 'Kopi Ais',                     3.00,  'Drinks',      'Iced Hainanese coffee.'),
      item(stallID, 'Teh O Ais Limau',              3.00,  'Drinks',      'Iced black tea with fresh lime.'),
      item(stallID, 'Horlicks Panas',               3.50,  'Drinks',      'Hot Horlicks malt drink.'),
      item(stallID, 'Milo Panas',                   3.00,  'Drinks',      'Hot Milo chocolate malt.'),
      item(stallID, 'Bandung',                      3.50,  'Drinks',      'Rose syrup with evaporated milk.'),
      // Snacks
      item(stallID, 'Kuih Talam',                   2.00,  'Snacks',      'Two-layered steamed rice flour cake with pandan and coconut.'),
      item(stallID, 'Onde-Onde',                    3.00,  'Snacks',      'Pandan rice balls filled with gula melaka.'),
      item(stallID, 'Roti Jala',                    4.00,  'Snacks',      'Lacy net crepes served with curry sauce.'),
      item(stallID, 'Curry Puff',                   2.50,  'Snacks',      'Flaky pastry stuffed with spiced potato and chicken.'),
    ],

    // ── Gurney / Pulau Tikus ────────────────────────────────────────────────

    'Gurney Drive Pasembur': [
      // Main
      item(stallID, 'Pasembur Large',              12.00,  'Main Course', 'Full plate of pasembur salad — prawn fritters, cucumber, turnip, tofu, and egg in peanut sauce.'),
      item(stallID, 'Pasembur Regular',              8.00,  'Main Course', 'Regular serving of the classic Penang Indian rojak.'),
      item(stallID, 'Sotong Goreng Tepung',          8.00,  'Main Course', 'Crispy battered squid rings.'),
      item(stallID, 'Udang Goreng Tepung',           9.00,  'Main Course', 'Golden battered prawns served with sweet chili sauce.'),
      item(stallID, 'Bergedil',                      2.50,  'Main Course', 'Deep-fried potato patty with minced meat.'),
      item(stallID, 'Cucur Udang',                   4.00,  'Main Course', 'Prawn fritters — crispy outside, soft and flavourful inside.'),
      // Side / Extras
      item(stallID, 'Tauhu Goreng',                 2.50,  'Side Dish',   'Deep-fried silken tofu, soft inside with crispy skin.'),
      item(stallID, 'Lobak (5 pcs)',                 5.00,  'Side Dish',   'Five-spice pork rolls wrapped in tofu skin, deep-fried.'),
      item(stallID, 'Telur Rebus',                   2.00,  'Side Dish',   'Boiled egg served with peanut sauce.'),
      item(stallID, 'Extra Peanut Sauce',            1.50,  'Side Dish',   'Additional thick peanut dipping sauce.'),
      item(stallID, 'Jicama (Bangkuang)',             3.00,  'Side Dish',   'Fresh turnip strips.'),
      // Drinks
      item(stallID, 'Coconut Water',                 5.00,  'Drinks',      'Fresh coconut water served chilled.'),
      item(stallID, 'Air Bandung',                   3.50,  'Drinks',      'Rose milk.'),
      item(stallID, 'Teh Tarik',                     2.50,  'Drinks',      'Pulled tea.'),
      item(stallID, 'Sirap Ais',                     2.50,  'Drinks',      'Iced rose syrup with water.'),
      // Dessert
      item(stallID, 'Chendul',                       4.00,  'Dessert',     'Shaved ice with green jelly noodles, red beans, and gula melaka coconut milk.'),
      item(stallID, 'Ais Kacang Campur',             4.50,  'Dessert',     'Shaved ice with assorted toppings.'),
    ],

    'Nasi Kandar Pelita': [
      // Main
      item(stallID, 'Nasi Kandar Ayam Tandoor',    11.00,  'Main Course', 'Tandoori-spiced chicken over fragrant kandar rice.'),
      item(stallID, 'Nasi Kandar Ikan Bakar',       10.00,  'Main Course', 'Grilled fish served with kandar gravy.'),
      item(stallID, 'Mee Goreng Mamak',              8.00,  'Main Course', 'Spicy stir-fried yellow noodles with egg, tomato, and tofu.'),
      item(stallID, 'Roti Canai',                    2.00,  'Main Course', 'Flaky flatbread served with curry or dhall.'),
      item(stallID, 'Tosai',                         3.00,  'Main Course', 'Crispy fermented rice crepe with coconut chutney and sambar.'),
      item(stallID, 'Maggi Goreng',                  7.00,  'Main Course', 'Stir-fried instant noodles mamak-style with egg and vegetables.'),
      item(stallID, 'Roti Telur',                    4.50,  'Main Course', 'Egg-stuffed roti canai.'),
      item(stallID, 'Naan Cheese',                   6.00,  'Main Course', 'Soft tandoori naan with melted cheese.'),
      // Sides
      item(stallID, 'Curry Ayam',                    5.00,  'Side Dish',   'Chicken curry — thick and aromatic.'),
      item(stallID, 'Dhall',                          2.50,  'Side Dish',   'Lentil curry for dipping roti.'),
      item(stallID, 'Kuah Banjir',                    2.00,  'Side Dish',   'Flooded mixed curry gravy for kandar rice.'),
      // Drinks
      item(stallID, 'Teh Tarik',                     2.50,  'Drinks',      'Classic pulled milk tea.'),
      item(stallID, 'Lassi Mangga',                   5.00,  'Drinks',      'Chilled mango yogurt lassi.'),
      item(stallID, 'Air Nenas',                      3.50,  'Drinks',      'Fresh pineapple juice.'),
      item(stallID, 'Kopi Tarik',                     3.00,  'Drinks',      'Pulled coffee with evaporated milk.'),
      // Dessert
      item(stallID, 'Gulab Jamun',                    4.00,  'Dessert',     'Soft milk-solid balls soaked in rose sugar syrup.'),
    ],

    // ── Bayan Lepas ─────────────────────────────────────────────────────────

    'Masjid Negeri Mee Goreng Mamak': [
      item(stallID, 'Mee Goreng Mamak Biasa',        7.00,  'Main Course', 'Classic mamak fried noodles.'),
      item(stallID, 'Mee Goreng Mamak Telur',        8.00,  'Main Course', 'With extra egg.'),
      item(stallID, 'Mee Goreng Mamak Seafood',     11.00,  'Main Course', 'With prawns and squid.'),
      item(stallID, 'Mee Rebus',                     7.50,  'Main Course', 'Yellow noodles in thick gravy with hard-boiled egg and tofu.'),
      item(stallID, 'Mee Sup',                       7.00,  'Main Course', 'Noodles in spiced beef broth.'),
      item(stallID, 'Roti Canai',                    2.00,  'Main Course', 'Flaky flatbread served with dhall.'),
      item(stallID, 'Roti Bom',                      3.50,  'Main Course', 'Thick, buttery roti pan-fried flat.'),
      item(stallID, 'Tosai Biasa',                   3.00,  'Main Course', 'Plain fermented rice crepe.'),
      item(stallID, 'Naan Butter',                   5.00,  'Main Course', 'Soft tandoor-baked naan with butter.'),
      item(stallID, 'Maggi Goreng Cheese',           8.00,  'Main Course', 'Mamak instant noodles with melted cheese.'),
      // Sides & Drinks
      item(stallID, 'Ayam Goreng',                   5.00,  'Side Dish',   'Crispy fried chicken.'),
      item(stallID, 'Teh Tarik',                     2.50,  'Drinks',      'Frothy pulled tea.'),
      item(stallID, 'Milo Ais',                      3.50,  'Drinks',      'Iced chocolate malt.'),
      item(stallID, 'Limau Ais',                     2.50,  'Drinks',      'Iced lime juice.'),
      item(stallID, 'Teh O Ais',                     2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Ais Kacang',                    4.50,  'Dessert',     'Shaved ice dessert.'),
    ],

    'Warung Dapur Melayu': [
      item(stallID, 'Rendang Ayam',                   9.00,  'Main Course', 'Slow-cooked chicken in rich coconut and spice rendang.'),
      item(stallID, 'Rendang Daging',                12.00,  'Main Course', 'Classic dry beef rendang.'),
      item(stallID, 'Gulai Ikan Pari',               10.00,  'Main Course', 'Stingray in spiced coconut milk curry.'),
      item(stallID, 'Sambal Petai Udang',            11.00,  'Main Course', 'Prawns and stink beans in sambal.'),
      item(stallID, 'Asam Pedas Ikan Tenggiri',      10.50,  'Main Course', 'Spanish mackerel in sour-spicy tamarind gravy.'),
      item(stallID, 'Nasi Putih',                     2.00,  'Side Dish',   'Plain steamed white rice.'),
      item(stallID, 'Ulam Raja',                      3.00,  'Side Dish',   'Traditional ulam herb salad with sambal belacan.'),
      item(stallID, 'Sambal Belacan',                 2.00,  'Side Dish',   'Shrimp paste sambal with fresh lime.'),
      item(stallID, 'Pucuk Paku Goreng',              4.00,  'Side Dish',   'Stir-fried jungle fern with sambal.'),
      item(stallID, 'Sayur Lodeh',                    4.50,  'Side Dish',   'Vegetables in spiced coconut milk.'),
      item(stallID, 'Teh O Ais',                      2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Air Sirap',                       2.00,  'Drinks',      'Rose syrup drink.'),
      item(stallID, 'Barli Sejuk',                     3.50,  'Drinks',      'Chilled barley water.'),
      item(stallID, 'Teh Halia',                       3.00,  'Drinks',      'Ginger tea.'),
      item(stallID, 'Cendol',                          4.50,  'Dessert',     'Pandan green jelly strings in coconut milk with gula melaka.'),
      item(stallID, 'Pengat Pisang',                   4.00,  'Dessert',     'Banana in sweet coconut milk.'),
    ],

    // ── Air Itam ─────────────────────────────────────────────────────────────

    'Air Itam Sister Curry Mee': [
      item(stallID, 'Curry Mee Biasa',               7.50,  'Main Course', 'Classic Penang curry mee with tofu, cuttlefish, and cockles.'),
      item(stallID, 'Curry Mee Special',             10.00,  'Main Course', 'With extra cuttlefish, prawns, and pork.'),
      item(stallID, 'Curry Mee Seafood',             11.00,  'Main Course', 'Loaded seafood curry mee.'),
      item(stallID, 'Curry Mee Vegetarian',           7.00,  'Main Course', 'No meat — extra tofu and vegetables.'),
      item(stallID, 'Laksa Putih',                    8.00,  'Main Course', 'White curry soup with noodles.'),
      item(stallID, 'Kway Teow Soup',                 7.00,  'Main Course', 'Flat rice noodles in clear broth.'),
      item(stallID, 'Mee Soup',                       7.00,  'Main Course', 'Yellow noodles in spiced broth.'),
      // Extras
      item(stallID, 'Extra Sotong',                   4.00,  'Add-on',      'Extra cuttlefish add-on.'),
      item(stallID, 'Extra Tauhu',                    2.00,  'Add-on',      'Extra tofu puff.'),
      item(stallID, 'Extra Sambal',                   1.50,  'Add-on',      'Extra fiery sambal.'),
      item(stallID, 'Extra Cockles',                  3.00,  'Add-on',      'Extra fresh cockles.'),
      // Drinks & Dessert
      item(stallID, 'Kopi O Panas',                   2.00,  'Drinks',      'Hot black coffee.'),
      item(stallID, 'Kopi Ais',                        3.00,  'Drinks',      'Iced coffee with milk.'),
      item(stallID, 'Teh Tarik',                       2.50,  'Drinks',      'Pulled milk tea.'),
      item(stallID, 'Air Barli',                        3.50,  'Drinks',      'Barley water.'),
      item(stallID, 'Ais Kacang',                       4.50,  'Dessert',     'Shaved ice with red beans and syrup.'),
    ],

    'Nasi Ulam Warisan': [
      item(stallID, 'Nasi Ulam Campur',               9.00,  'Main Course', 'Herbed rice with assorted ulam herbs, sambal belacan, and fried fish.'),
      item(stallID, 'Nasi Ulam Ikan Goreng',          10.00,  'Main Course', 'Nasi ulam with crispy fried fish.'),
      item(stallID, 'Nasi Ulam Ayam Goreng',           9.50,  'Main Course', 'Nasi ulam with fried chicken.'),
      item(stallID, 'Lauk Sambal Ikan Bilis',          4.00,  'Side Dish',   'Spicy dried anchovy sambal.'),
      item(stallID, 'Ulam Jantung Pisang',             3.50,  'Side Dish',   'Banana flower salad.'),
      item(stallID, 'Sambal Tempoyak',                 3.00,  'Side Dish',   'Fermented durian sambal.'),
      item(stallID, 'Nasi Putih',                       2.00,  'Side Dish',   'Plain steamed rice.'),
      item(stallID, 'Pajeri Nenas',                     4.00,  'Side Dish',   'Pineapple in aromatic gravy.'),
      item(stallID, 'Peria Goreng',                     3.50,  'Side Dish',   'Stir-fried bitter gourd.'),
      item(stallID, 'Kerabu Mangga',                    4.00,  'Side Dish',   'Green mango salad with sambal.'),
      item(stallID, 'Acar Rampai',                      3.00,  'Side Dish',   'Pickled vegetables medley.'),
      item(stallID, 'Teh O Ais',                         2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Air Asam Jawa',                     3.00,  'Drinks',      'Tamarind refresher.'),
      item(stallID, 'Air Kelapa',                         5.00,  'Drinks',      'Fresh coconut water.'),
      item(stallID, 'Cendol',                             4.50,  'Dessert',     'Green pandan jelly with coconut milk and gula melaka.'),
    ],

    // ── Balik Pulau ─────────────────────────────────────────────────────────

    'Laksa Balik Pulau': [
      item(stallID, 'Assam Laksa Biasa',              6.00,  'Main Course', 'Traditional Penang Assam Laksa — sour mackerel broth, thick rice noodles, pineapple, and mint.'),
      item(stallID, 'Assam Laksa Seafood',             9.00,  'Main Course', 'With extra prawn and squid.'),
      item(stallID, 'Assam Laksa Pedas',               7.00,  'Main Course', 'Extra chili for heat lovers.'),
      item(stallID, 'Mee Siam',                        6.50,  'Main Course', 'Thin rice vermicelli in sweet-sour gravy.'),
      item(stallID, 'Fried Mihun',                     6.00,  'Main Course', 'Stir-fried rice vermicelli with vegetables.'),
      item(stallID, 'Kuay Teow Sup',                   6.50,  'Main Course', 'Flat noodles in clear fish broth.'),
      // Extras & Sides
      item(stallID, 'Extra Ikan Bilis',                2.00,  'Add-on',      'More dried anchovies topping.'),
      item(stallID, 'Extra Prawn Paste',               1.50,  'Add-on',      'Additional hae ko prawn paste.'),
      item(stallID, 'Extra Noodles',                   2.00,  'Add-on',      'Extra serving of noodles.'),
      item(stallID, 'Telur Rebus',                     2.00,  'Side Dish',   'Hard-boiled egg.'),
      item(stallID, 'Keropok Lekor',                   3.00,  'Side Dish',   'Terengganu fish crackers.'),
      // Drinks & Dessert
      item(stallID, 'Teh O Ais',                       2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Cincau Ais',                       3.00,  'Drinks',      'Iced grass jelly drink.'),
      item(stallID, 'Air Kelapa Muda',                  5.00,  'Drinks',      'Fresh young coconut water.'),
      item(stallID, 'Pengat Durian',                    8.00,  'Dessert',     'Balik Pulau durian in coconut milk — local specialty.'),
      item(stallID, 'Ais Kacang',                       4.50,  'Dessert',     'Shaved ice with beans and syrup.'),
    ],

    'Nasi Padang Minang': [
      item(stallID, 'Nasi Padang Campur',             10.00,  'Main Course', 'Rice with 3 choices of Minangkabau dishes.'),
      item(stallID, 'Rendang Daging Minang',          14.00,  'Main Course', 'Authentic Minang dry beef rendang.'),
      item(stallID, 'Ayam Pop',                        8.00,  'Main Course', 'Steamed then fried chicken Padang style.'),
      item(stallID, 'Gulai Pakis',                     6.00,  'Side Dish',   'Fern in coconut milk curry.'),
      item(stallID, 'Sambal Hijau',                    5.00,  'Side Dish',   'Green chili sambal with fish.'),
      item(stallID, 'Telur Balado',                    4.50,  'Side Dish',   'Hard-boiled egg in red sambal.'),
      item(stallID, 'Perkedel Jagung',                 3.00,  'Side Dish',   'Corn fritters.'),
      item(stallID, 'Nasi Putih',                       2.00,  'Side Dish',   'Steamed rice.'),
      item(stallID, 'Gulai Ayam',                       7.00,  'Side Dish',   'Chicken in coconut curry.'),
      item(stallID, 'Daun Singkong Rebus',              3.00,  'Side Dish',   'Boiled cassava leaves.'),
      item(stallID, 'Sambal Terasi',                    2.50,  'Side Dish',   'Shrimp paste sambal.'),
      item(stallID, 'Teh Manis',                        2.50,  'Drinks',      'Sweet tea.'),
      item(stallID, 'Es Teh',                            3.00,  'Drinks',      'Iced sweet tea.'),
      item(stallID, 'Es Jeruk',                          3.50,  'Drinks',      'Iced orange juice.'),
      item(stallID, 'Es Cincau',                         3.00,  'Drinks',      'Iced grass jelly drink.'),
      item(stallID, 'Bubur Hitam',                       4.50,  'Dessert',     'Black glutinous rice pudding in coconut milk.'),
    ],

    // ── Butterworth / Seberang Perai ─────────────────────────────────────────

    'Roti Canai Transfer Road': [
      item(stallID, 'Roti Canai Kosong',               1.80,  'Main Course', 'Plain flaky flatbread served with curry and dhall.'),
      item(stallID, 'Roti Telur',                       3.50,  'Main Course', 'Egg roti canai.'),
      item(stallID, 'Roti Sardine',                     4.50,  'Main Course', 'Roti stuffed with spiced sardine.'),
      item(stallID, 'Roti Bawang',                      2.50,  'Main Course', 'Onion roti canai.'),
      item(stallID, 'Roti Pisang',                      3.50,  'Main Course', 'Banana roti.'),
      item(stallID, 'Roti Tissue',                      5.50,  'Main Course', 'Paper-thin crispy stretched roti with condensed milk.'),
      item(stallID, 'Tosai',                             3.00,  'Main Course', 'Fermented rice and lentil crepe.'),
      item(stallID, 'Tosai Telur',                       4.00,  'Main Course', 'Egg tosai.'),
      item(stallID, 'Chapati',                           3.00,  'Main Course', 'Whole wheat flatbread served with curry.'),
      item(stallID, 'Prata Cheese',                      5.00,  'Main Course', 'Roti canai with cheese filling.'),
      // Extras
      item(stallID, 'Kuah Kari Ayam',                   3.00,  'Side Dish',   'Chicken curry for dipping.'),
      item(stallID, 'Kuah Dhall',                        2.00,  'Side Dish',   'Lentil curry.'),
      item(stallID, 'Half-Boiled Eggs',                  3.00,  'Side Dish',   'Two soft-boiled eggs.'),
      // Drinks
      item(stallID, 'Teh Tarik',                         2.50,  'Drinks',      'Frothy pulled milk tea.'),
      item(stallID, 'Kopi Tarik',                         3.00,  'Drinks',      'Pulled coffee.'),
      item(stallID, 'Teh O Ais',                           2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Milo Ais',                            3.50,  'Drinks',      'Iced Milo.'),
    ],

    'Sup Hameed': [
      item(stallID, 'Sup Ekor',                         18.00,  'Main Course', 'Rich oxtail soup simmered for hours in aromatic spices.'),
      item(stallID, 'Sup Kambing',                       12.00,  'Main Course', 'Spiced mutton soup with chunky bone-in pieces.'),
      item(stallID, 'Sup Tulang',                        10.00,  'Main Course', 'Bone broth soup with marrow.'),
      item(stallID, 'Sup Ayam',                           8.00,  'Main Course', 'Clear spiced chicken soup.'),
      item(stallID, 'Sup Daging',                        12.00,  'Main Course', 'Beef soup with tender chunks.'),
      item(stallID, 'Sup Perut',                         10.00,  'Main Course', 'Tripe soup — a local favourite.'),
      item(stallID, 'Nasi Putih',                          2.00,  'Side Dish',   'Steamed rice to accompany soup.'),
      item(stallID, 'Roti Bengali',                        2.50,  'Side Dish',   'Crusty Bengali-style bread for dipping into soup.'),
      item(stallID, 'Acar',                                 2.00,  'Side Dish',   'Pickled cucumber and carrot.'),
      item(stallID, 'Sambal',                               2.00,  'Side Dish',   'Chili sambal condiment.'),
      item(stallID, 'Dalca',                                5.00,  'Side Dish',   'Lentil and vegetable curry.'),
      item(stallID, 'Teh Tarik',                            2.50,  'Drinks',      'Classic pulled tea.'),
      item(stallID, 'Kopi O',                               2.00,  'Drinks',      'Black coffee.'),
      item(stallID, 'Teh O Ais',                            2.50,  'Drinks',      'Iced black tea.'),
      item(stallID, 'Air Sejuk',                             1.00,  'Drinks',      'Cold water.'),
      item(stallID, 'Sago Gula Melaka',                      5.00,  'Dessert',     'Sago pearls in coconut milk with palm sugar syrup.'),
    ],
  };

  return menus[stallName] || [];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🔎 Fetching existing stalls from Firestore...');

  const snapshot = await db.collection('FoodStalls').get();
  const stallMap = {};
  snapshot.docs.forEach(doc => {
    stallMap[doc.data().stallName] = doc.id;
  });

  const missing = ALL_TARGET_STALLS.filter(n => !stallMap[n]);
  if (missing.length) {
    console.warn('⚠️  Stalls not found in DB (will be skipped):', missing);
  }

  let totalWritten = 0;
  const batch_size = 400; // Firestore batch limit is 500 writes
  let batch = db.batch();
  let batchCount = 0;

  for (const [region, stallNames] of Object.entries(REGION_STALL_NAMES)) {
    console.log(`\n📍 Region: ${region}`);

    for (const stallName of stallNames) {
      const stallID = stallMap[stallName];
      if (!stallID) {
        console.log(`  ⛔  Skipping "${stallName}" — not in DB`);
        continue;
      }

      const items = menusFor(stallName, stallID);
      console.log(`  🍽️  "${stallName}" (${stallID}) — ${items.length} items`);

      for (const menuItem of items) {
        const ref = db.collection('menu').doc();
        batch.set(ref, menuItem);
        batchCount++;
        totalWritten++;

        if (batchCount >= batch_size) {
          await batch.commit();
          console.log(`    ✅ Committed batch of ${batchCount}`);
          batch = db.batch();
          batchCount = 0;
        }
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Committed final batch of ${batchCount}`);
  }

  console.log(`\n🎉 Done! Total menu items written: ${totalWritten}`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
