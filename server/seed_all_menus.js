/**
 * seed_all_menus.js
 * Generates 15–20 realistic menu items for every stall that doesn't have menus yet,
 * based on its cuisineType. Runs in batch writes (max 400/batch).
 *
 * Run: node seed_all_menus.js
 */

require('dotenv').config();
const { db } = require('./src/config/firebase');

const now = () => new Date().toISOString();

function item(stallID, name, price, category, desc) {
  return {
    stallID,
    menuName: name,
    menuPrice: price,
    category,
    itemDescription: desc,
    menuPic: '',
    isAvailable: true,
    likes: 0,
    createdDate: now(),
    lastUpdated: now(),
  };
}

// ─── Cuisine-type menu templates ─────────────────────────────────────────────
// Each returns an array of 15-20 items given a stallID.

const TEMPLATES = {

  // ── Chinese ────────────────────────────────────────────────────────────────
  Chinese: (id) => [
    item(id, 'Char Koay Teow',               8.00,  'Main Course', 'Flat rice noodles stir-fried with egg, bean sprouts, cockles, and wok hei.'),
    item(id, 'Hokkien Mee',                   8.00,  'Main Course', 'Yellow noodles in rich prawn and pork bone broth.'),
    item(id, 'Wonton Mee',                    7.50,  'Main Course', 'Springy egg noodles with char siew and wontons in dark soy.'),
    item(id, 'Chee Cheong Fun',               5.00,  'Main Course', 'Silky steamed rice rolls with sweet and spicy sauce.'),
    item(id, 'Porridge (Congee)',             6.00,  'Main Course', 'Smooth rice porridge with century egg and salted pork.'),
    item(id, 'Curry Laksa',                   8.50,  'Main Course', 'Creamy coconut curry soup with noodles and tofu puff.'),
    item(id, 'Assam Laksa',                   7.50,  'Main Course', 'Sour mackerel broth with rice noodles and fresh herbs.'),
    item(id, 'Bak Kut Teh',                  12.00,  'Main Course', 'Clear herbal pork rib soup simmered with garlic and pepper.'),
    item(id, 'Claypot Rice',                  12.00,  'Main Course', 'Fragrant rice with chicken, mushroom, and salted fish cooked in a claypot over charcoal.'),
    item(id, 'Fried Rice (Nasi Goreng Cina)', 8.00,  'Main Course', 'Chinese-style fried rice with egg, char siew, and vegetables.'),
    item(id, 'Sweet & Sour Pork',            14.00,  'Main Course', 'Crispy pork chunks in tangy sweet-sour sauce with pineapple.'),
    item(id, 'Steamed Fish with Ginger',     22.00,  'Main Course', 'Whole steamed fish with ginger, soy, and spring onion.'),
    item(id, 'Crispy Roast Pork (Siu Yuk)',  15.00,  'Side Dish',   'Crackling roast pork belly — crispy skin, juicy meat.'),
    item(id, 'Char Siew (BBQ Pork)',         12.00,  'Side Dish',   'Cantonese honey-glazed barbecue pork.'),
    item(id, 'Prawn Omelette (Har Gor)',      9.00,  'Side Dish',   'Fluffy egg omelette loaded with fresh prawns.'),
    item(id, 'Tofu with Minced Pork',         8.00,  'Side Dish',   'Silken tofu pan-fried and topped with seasoned minced pork.'),
    item(id, 'Kopi O',                         2.00,  'Drinks',      'Classic black Hainanese coffee.'),
    item(id, 'Kopi C Ais',                     3.00,  'Drinks',      'Iced coffee with evaporated milk.'),
    item(id, 'Teh Tarik',                      2.50,  'Drinks',      'Frothy pulled milk tea.'),
    item(id, 'Barley Water',                   3.50,  'Drinks',      'Refreshing chilled barley drink.'),
    item(id, 'Ais Kacang',                     4.50,  'Dessert',     'Shaved ice with red beans, corn, grass jelly, and rose syrup.'),
    item(id, 'Cendol',                          4.50,  'Dessert',     'Pandan jelly strips in coconut milk with gula melaka.'),
  ],

  // ── Indian Muslim / Mamak ──────────────────────────────────────────────────
  'Indian Muslim': (id) => [
    item(id, 'Nasi Kandar Biasa',              8.50,  'Main Course', 'Rice with your choice of curries and side dishes.'),
    item(id, 'Nasi Kandar Special',           12.00,  'Main Course', 'Rice with 3 curries, fried chicken, and papadom.'),
    item(id, 'Roti Canai',                     2.00,  'Main Course', 'Flaky flatbread with dhall and curry.'),
    item(id, 'Roti Telur',                     3.50,  'Main Course', 'Roti canai stuffed with egg.'),
    item(id, 'Roti Tissue',                    5.50,  'Main Course', 'Paper-thin crispy roti with condensed milk.'),
    item(id, 'Mee Goreng Mamak',               7.00,  'Main Course', 'Spicy stir-fried yellow noodles with egg, tofu, and tomato.'),
    item(id, 'Maggi Goreng',                   7.00,  'Main Course', 'Mamak-style stir-fried instant noodles.'),
    item(id, 'Murtabak Ayam',                  9.00,  'Main Course', 'Stuffed pan-fried bread with spiced minced chicken.'),
    item(id, 'Murtabak Kambing',              10.00,  'Main Course', 'Stuffed pan-fried bread with spiced mutton.'),
    item(id, 'Tosai',                           3.00,  'Main Course', 'Crispy fermented rice crepe with coconut chutney.'),
    item(id, 'Naan Butter',                    5.00,  'Main Course', 'Soft tandoor-baked naan with butter.'),
    item(id, 'Ayam Goreng Berempah',           5.50,  'Side Dish',   'Crispy spiced fried chicken.'),
    item(id, 'Ikan Goreng',                    5.00,  'Side Dish',   'Crispy deep-fried fish.'),
    item(id, 'Sotong Masak Hitam',             7.00,  'Side Dish',   'Squid cooked in rich black ink curry.'),
    item(id, 'Dhall Curry',                    2.50,  'Side Dish',   'Yellow lentil curry for dipping.'),
    item(id, 'Papadom',                         1.00,  'Side Dish',   'Crispy lentil wafer.'),
    item(id, 'Teh Tarik',                       2.50,  'Drinks',      'Classic frothy pulled tea.'),
    item(id, 'Kopi Tarik',                      3.00,  'Drinks',      'Pulled coffee with condensed milk.'),
    item(id, 'Milo Ais',                         3.50,  'Drinks',      'Iced chocolate malt drink.'),
    item(id, 'Teh O Ais Limau',                 3.00,  'Drinks',      'Iced black tea with fresh lime.'),
    item(id, 'Bandung Ais',                      3.00,  'Drinks',      'Iced rose milk.'),
  ],

  // ── Malay ──────────────────────────────────────────────────────────────────
  Malay: (id) => [
    item(id, 'Nasi Lemak Biasa',               4.50,  'Main Course', 'Coconut rice with sambal, anchovies, peanuts, and egg.'),
    item(id, 'Nasi Lemak Special',             8.00,  'Main Course', 'Nasi lemak with fried chicken and additional sides.'),
    item(id, 'Mee Rebus',                       7.50,  'Main Course', 'Yellow noodles in thick sweet-spicy gravy with egg and tofu.'),
    item(id, 'Mee Siam',                         6.50,  'Main Course', 'Rice vermicelli in sweet-tangy prawn gravy.'),
    item(id, 'Laksa Putih',                     7.50,  'Main Course', 'White coconut soup laksa with thick noodles.'),
    item(id, 'Asam Laksa',                       7.00,  'Main Course', 'Sour fish broth laksa with pineapple and mint.'),
    item(id, 'Nasi Campur',                      8.00,  'Main Course', 'Rice with 3 choices of Malay side dishes.'),
    item(id, 'Rendang Ayam',                     9.00,  'Main Course', 'Slow-cooked dry chicken rendang.'),
    item(id, 'Rendang Daging',                  12.00,  'Main Course', 'Classic beef rendang.'),
    item(id, 'Ikan Bakar Sambal',               10.00,  'Main Course', 'Grilled fish smothered in spicy sambal.'),
    item(id, 'Gulai Ayam',                       8.00,  'Main Course', 'Chicken in rich coconut curry.'),
    item(id, 'Sambal Udang',                     9.00,  'Side Dish',   'Prawns in fiery sambal.'),
    item(id, 'Ulam-Ulaman',                       3.00,  'Side Dish',   'Traditional herb salad with sambal belacan.'),
    item(id, 'Nasi Putih',                        2.00,  'Side Dish',   'Steamed white rice.'),
    item(id, 'Keropok Lekor',                     3.50,  'Side Dish',   'Soft fish crackers.'),
    item(id, 'Teh O Ais',                          2.50,  'Drinks',      'Iced black tea.'),
    item(id, 'Air Kelapa Muda',                    5.00,  'Drinks',      'Fresh young coconut water.'),
    item(id, 'Sirap Bandung',                      3.00,  'Drinks',      'Rose milk drink.'),
    item(id, 'Cendol',                              4.50,  'Dessert',     'Pandan jelly in coconut milk with gula melaka.'),
    item(id, 'Pengat Pisang',                       4.00,  'Dessert',     'Banana in sweet coconut milk.'),
  ],

  // ── Hainanese / Kopitiam ──────────────────────────────────────────────────
  Hainanese: (id) => [
    item(id, 'Roti Bakar Kaya',                 4.50,  'Breakfast',   'Charcoal-toasted bread with homemade coconut jam.'),
    item(id, 'Roti Bakar Mentega',               3.50,  'Breakfast',   'Butter toast grilled to perfection.'),
    item(id, 'Half-Boiled Eggs (2 pcs)',          3.00,  'Breakfast',   'Soft half-boiled eggs with soy sauce and pepper.'),
    item(id, 'Roti Kahwin',                        5.00,  'Breakfast',   'Kaya AND butter between thick toast slices.'),
    item(id, 'Nasi Lemak Set',                     7.00,  'Breakfast',   'Coconut rice with sambal, egg, and anchovies.'),
    item(id, 'Chicken Rice (Hainanese)',          10.00,  'Main Course', 'Steamed chicken with fragrant oiled rice and ginger sauce.'),
    item(id, 'Roast Chicken Rice',                10.00,  'Main Course', 'Roasted chicken over fragrant rice with dark sauce.'),
    item(id, 'Laksa',                              8.00,  'Main Course', 'Penang laksa in spiced fish broth.'),
    item(id, 'Curry Mee',                          8.00,  'Main Course', 'Coconut curry soup noodles with tofu and cockles.'),
    item(id, 'Wonton Noodle Soup',                 7.50,  'Main Course', 'Light broth with wontons and egg noodles.'),
    item(id, 'Chee Cheong Fun',                    5.00,  'Snacks',      'Silky rice rolls with sweet sauce.'),
    item(id, 'Curry Puff',                          2.50,  'Snacks',      'Flaky pastry with spiced potato filling.'),
    item(id, 'Kopi O',                              2.00,  'Drinks',      'Classic black Hainanese coffee.'),
    item(id, 'Kopi C',                              2.50,  'Drinks',      'Coffee with evaporated milk.'),
    item(id, 'Kopi Ais',                             3.00,  'Drinks',      'Iced Hainanese coffee.'),
    item(id, 'Teh O Ais',                            2.50,  'Drinks',      'Iced black tea.'),
    item(id, 'Horlicks',                             3.50,  'Drinks',      'Warm Horlicks malt drink.'),
    item(id, 'Milo Ais',                              3.50,  'Drinks',      'Iced Milo chocolate drink.'),
    item(id, 'Ais Kacang',                            4.50,  'Dessert',     'Shaved ice with beans and syrup.'),
    item(id, 'Cendol',                                4.50,  'Dessert',     'Green jelly noodles with coconut milk.'),
  ],

  // ── Dim Sum ────────────────────────────────────────────────────────────────
  'Dim Sum': (id) => [
    item(id, 'Har Gao (Prawn Dumpling)',         5.00,  'Dim Sum',     'Steamed translucent dumpling stuffed with fresh prawns.'),
    item(id, 'Siew Mai',                           5.00,  'Dim Sum',     'Open-top pork and prawn dumpling.'),
    item(id, 'Char Siew Pau',                       4.50,  'Dim Sum',     'Fluffy steamed bun stuffed with honey BBQ pork.'),
    item(id, 'Lo Bak Go (Radish Cake)',             4.50,  'Dim Sum',     'Pan-fried turnip cake — crispy outside, soft inside.'),
    item(id, 'Cheung Fun (Rice Roll)',              5.50,  'Dim Sum',     'Silky steamed rice rolls with prawn or char siew.'),
    item(id, 'Wu Kok (Taro Dumpling)',              4.50,  'Dim Sum',     'Deep-fried flaky taro shell with pork filling.'),
    item(id, 'Egg Tart',                             3.00,  'Dim Sum',     'Flaky pastry tart with smooth egg custard.'),
    item(id, 'Liu Sha Bao (Salted Egg Bun)',         5.50,  'Dim Sum',     'Steamed bun with molten salted egg yolk lava centre.'),
    item(id, 'Chee Cheong Fun',                      5.00,  'Dim Sum',     'Soft rice noodle rolls with sweet soy sauce.'),
    item(id, 'Chicken Feet (Phoenix Claws)',          5.00,  'Dim Sum',     'Braised chicken feet in black bean sauce — tender and sticky.'),
    item(id, 'Turnip Puff (Chai Kueh)',               4.00,  'Dim Sum',     'Crystal dumpling filled with turnip and dried shrimp.'),
    item(id, 'Crispy Spring Roll',                    4.50,  'Dim Sum',     'Deep-fried roll stuffed with vegetables and glass noodles.'),
    item(id, 'BBQ Pork Bun (Baked)',                  4.50,  'Dim Sum',     'Baked golden bun with char siew filling.'),
    item(id, 'Congee (Jook)',                         6.00,  'Main Course', 'Smooth rice porridge with century egg and pork.'),
    item(id, 'Dim Sum Set (4 items)',                16.00,  'Set Meal',    'Choose any 4 dim sum baskets.'),
    item(id, 'Chinese Tea (Pot)',                     6.00,  'Drinks',      'Pot of premium Chinese oolong or chrysanthemum tea.'),
    item(id, 'Kopi O',                                2.00,  'Drinks',      'Traditional black Hainanese coffee.'),
    item(id, 'Barley Water',                           3.50,  'Drinks',      'Chilled barley water.'),
  ],

  // ── Nyonya / Peranakan ────────────────────────────────────────────────────
  Nyonya: (id) => [
    item(id, 'Nasi Lemak Nyonya',                7.50,  'Main Course', 'Nyonya-style coconut rice with prawn sambal.'),
    item(id, 'Curry Kapitan',                    12.00,  'Main Course', 'Rich Nonya chicken curry with coconut milk and lemongrass.'),
    item(id, 'Assam Pedas Ikan',                 12.00,  'Main Course', 'Tangy-spicy tamarind fish curry.'),
    item(id, 'Inche Kabin',                      13.00,  'Main Course', 'Nyonya fried chicken marinated in coconut milk.'),
    item(id, 'Perut Ikan',                       11.00,  'Main Course', 'Fish stomach pickle curry — a rare Penang Nyonya specialty.'),
    item(id, 'Kerabu Beehoon',                    7.00,  'Main Course', 'Rice vermicelli salad with herbs, toasted coconut, and prawn.'),
    item(id, 'Jiu Hu Char',                       8.00,  'Side Dish',   'Stir-fried jicama with dried cuttlefish, served with lettuce.'),
    item(id, 'Acar Awak',                          4.00,  'Side Dish',   'Nyonya spiced vegetable pickle.'),
    item(id, 'Kaya Toast',                          4.50,  'Snacks',      'Toast with homemade pandan coconut jam.'),
    item(id, 'Kuih Lapis',                          3.00,  'Snacks',      'Layered steamed kuih with colourful pandan and coconut milk.'),
    item(id, 'Onde Onde',                           3.50,  'Snacks',      'Glutinous rice balls with gula melaka filling and coconut flakes.'),
    item(id, 'Kuih Bahulu',                          3.00,  'Snacks',      'Bite-sized sponge cakes baked in a mould.'),
    item(id, 'Apom Manis',                           3.50,  'Snacks',      'Soft pandan crumpets.'),
    item(id, 'Cendol Nyonya',                        5.00,  'Dessert',     'Pandan green jelly with thick coconut milk and gula melaka.'),
    item(id, 'Bubur Cha Cha',                         5.00,  'Dessert',     'Coconut milk dessert with yam, sweet potato, and sago pearls.'),
    item(id, 'Teh Tarik',                             2.50,  'Drinks',      'Pulled milk tea.'),
    item(id, 'Air Kelapa',                             5.00,  'Drinks',      'Fresh coconut water.'),
    item(id, 'Bandung Sejuk',                          3.00,  'Drinks',      'Iced rose milk.'),
  ],

  // ── Indian Vegetarian ─────────────────────────────────────────────────────
  'Indian Vegetarian': (id) => [
    item(id, 'Banana Leaf Rice',                  9.00,  'Main Course', 'Unlimited rice on banana leaf with rotating vegetable curries, rasam, and papadom.'),
    item(id, 'Tosai Biasa',                        3.00,  'Main Course', 'Crispy fermented rice-lentil crepe.'),
    item(id, 'Tosai Masala',                        5.50,  'Main Course', 'Crepe filled with spiced potato.'),
    item(id, 'Idli (2 pcs)',                         4.00,  'Main Course', 'Steamed rice-lentil cakes with sambar and chutney.'),
    item(id, 'Pongal',                               5.00,  'Main Course', 'Savoury rice and lentil porridge with ghee and cumin.'),
    item(id, 'Chapati with Curry',                   5.00,  'Main Course', 'Whole wheat flatbread with vegetable curry.'),
    item(id, 'Uthappam',                              5.00,  'Main Course', 'Thick soft pancake topped with onion and tomato.'),
    item(id, 'Vegetable Briyani',                    10.00,  'Main Course', 'Fragrant basmati rice with mixed vegetables and raita.'),
    item(id, 'Sambar',                                2.50,  'Side Dish',   'Lentil and vegetable curry for dipping.'),
    item(id, 'Coconut Chutney',                       1.50,  'Side Dish',   'Fresh coconut and green chili chutney.'),
    item(id, 'Papadom',                                1.00,  'Side Dish',   'Crispy lentil wafer.'),
    item(id, 'Raita',                                  2.50,  'Side Dish',   'Yogurt with cucumber and cumin.'),
    item(id, 'Gulab Jamun',                            4.00,  'Dessert',     'Soft milk-solid balls in rose sugar syrup.'),
    item(id, 'Payasam',                                4.50,  'Dessert',     'Sweet vermicelli pudding with coconut milk.'),
    item(id, 'Halwa',                                  4.00,  'Dessert',     'Semolina sweet pudding with cardamom.'),
    item(id, 'Teh Tarik',                              2.50,  'Drinks',      'Pulled milk tea.'),
    item(id, 'Lassi (Mango)',                           5.00,  'Drinks',      'Mango yogurt drink.'),
    item(id, 'Filter Coffee',                           3.00,  'Drinks',      'South Indian drip coffee with chicory.'),
  ],

  // ── Northern Indian ───────────────────────────────────────────────────────
  'Northern Indian': (id) => [
    item(id, 'Chicken Tikka Masala',             16.00,  'Main Course', 'Tender chicken in rich tomato and cream masala sauce.'),
    item(id, 'Lamb Rogan Josh',                   18.00,  'Main Course', 'Braised lamb in aromatic Kashmiri spices.'),
    item(id, 'Butter Chicken',                    16.00,  'Main Course', 'Creamy tomato-based chicken curry.'),
    item(id, 'Dal Makhani',                       11.00,  'Main Course', 'Black lentils slow-cooked overnight with butter and cream.'),
    item(id, 'Palak Paneer',                      12.00,  'Main Course', 'Cottage cheese in spiced spinach gravy.'),
    item(id, 'Tandoori Chicken (Half)',            16.00,  'Main Course', 'Half chicken marinated in yogurt and spices, roasted in tandoor.'),
    item(id, 'Seekh Kebab (4 pcs)',               14.00,  'Main Course', 'Minced lamb or chicken skewers grilled in tandoor.'),
    item(id, 'Vegetable Briyani',                  12.00,  'Main Course', 'Fragrant basmati rice with vegetables.'),
    item(id, 'Chicken Briyani',                    15.00,  'Main Course', 'Fragrant basmati rice layered with spiced chicken.'),
    item(id, 'Naan',                                3.50,  'Bread',       'Soft tandoor-baked flatbread.'),
    item(id, 'Garlic Naan',                          4.50,  'Bread',       'Naan topped with garlic and butter.'),
    item(id, 'Cheese Naan',                          5.50,  'Bread',       'Naan stuffed with melted cheese.'),
    item(id, 'Papadom (3 pcs)',                      2.50,  'Side Dish',   'Crispy lentil crackers with mint chutney.'),
    item(id, 'Raita',                                 3.00,  'Side Dish',   'Yogurt with cucumber and cumin.'),
    item(id, 'Mango Lassi',                           5.50,  'Drinks',      'Chilled mango yogurt drink.'),
    item(id, 'Chai',                                   3.00,  'Drinks',      'Spiced Indian milk tea.'),
    item(id, 'Gulab Jamun',                            4.50,  'Dessert',     'Milk solids in rose sugar syrup.'),
    item(id, 'Kheer',                                  5.00,  'Dessert',     'Creamy rice pudding with cardamom and saffron.'),
  ],

  // ── Western ───────────────────────────────────────────────────────────────
  Western: (id) => [
    item(id, 'Grilled Chicken Chop',              18.00,  'Main Course', 'Herb-marinated grilled chicken with mushroom sauce and fries.'),
    item(id, 'Beef Burger',                        22.00,  'Main Course', 'Juicy beef patty in brioche bun with lettuce, tomato, and cheese.'),
    item(id, 'Fish & Chips',                       20.00,  'Main Course', 'Beer-battered fish with chunky fries and tartare sauce.'),
    item(id, 'Pasta Carbonara',                    18.00,  'Main Course', 'Creamy egg and bacon sauce over al dente spaghetti.'),
    item(id, 'Pasta Bolognese',                    18.00,  'Main Course', 'Rich minced beef ragu over spaghetti.'),
    item(id, 'Aglio Olio',                          16.00,  'Main Course', 'Garlic and olive oil pasta with parsley and chili flakes.'),
    item(id, 'Caesar Salad',                         14.00,  'Starter',     'Romaine lettuce with croutons, parmesan, and Caesar dressing.'),
    item(id, 'Mushroom Soup',                        10.00,  'Starter',     'Creamy blended mushroom soup with bread.'),
    item(id, 'Garlic Bread (4 pcs)',                  6.00,  'Side Dish',   'Toasted bread with garlic butter.'),
    item(id, 'Coleslaw',                              4.00,  'Side Dish',   'Creamy shredded cabbage and carrot salad.'),
    item(id, 'Waffle with Ice Cream',                12.00,  'Dessert',     'Crispy Belgian waffle with vanilla ice cream and maple syrup.'),
    item(id, 'Chocolate Lava Cake',                  12.00,  'Dessert',     'Warm chocolate cake with molten centre and ice cream.'),
    item(id, 'Cheesecake',                           10.00,  'Dessert',     'Baked New York-style cheesecake with berry compote.'),
    item(id, 'Americano',                             6.00,  'Drinks',      'Double shot espresso with hot water.'),
    item(id, 'Latte',                                  7.00,  'Drinks',      'Espresso with steamed milk and microfoam.'),
    item(id, 'Iced Mocha',                             8.00,  'Drinks',      'Iced espresso with chocolate and milk.'),
    item(id, 'Fresh Orange Juice',                     7.00,  'Drinks',      'Freshly squeezed orange juice.'),
    item(id, 'Sparkling Water',                         3.50,  'Drinks',      'Chilled sparkling mineral water.'),
  ],

  // ── Cafe / Pastries & Cafe ─────────────────────────────────────────────────
  Cafe: (id) => [
    item(id, 'Eggs Benedict',                     18.00,  'Breakfast',   'Poached eggs on English muffin with hollandaise sauce.'),
    item(id, 'Full Breakfast',                     22.00,  'Breakfast',   'Eggs, bacon, sausage, baked beans, toast.'),
    item(id, 'Avocado Toast',                      16.00,  'Breakfast',   'Smashed avocado on sourdough with feta and poached egg.'),
    item(id, 'Acai Bowl',                           15.00,  'Breakfast',   'Blended acai with granola, fresh fruit, and honey.'),
    item(id, 'Smoked Salmon Bagel',                18.00,  'Breakfast',   'Toasted bagel with cream cheese and smoked salmon.'),
    item(id, 'Club Sandwich',                       16.00,  'Main Course', 'Triple-decker with chicken, bacon, egg, lettuce, and tomato.'),
    item(id, 'Croque Monsieur',                     15.00,  'Main Course', 'Ham and gruyère toasted sandwich with béchamel.'),
    item(id, 'Pasta of the Day',                    18.00,  'Main Course', "Chef's daily pasta creation."),
    item(id, 'Chicken Wrap',                         14.00,  'Main Course', 'Grilled chicken in flour tortilla with veggies and sauce.'),
    item(id, 'Flat White',                            8.00,  'Drinks',      'Espresso with velvety steamed milk.'),
    item(id, 'Cappuccino',                             8.00,  'Drinks',      'Espresso with steamed milk and thick foam.'),
    item(id, 'Cold Brew',                              9.00,  'Drinks',      '12-hour cold-steeped coffee, smooth and low-acid.'),
    item(id, 'Matcha Latte',                            9.00,  'Drinks',      'Japanese ceremonial matcha with steamed milk.'),
    item(id, 'Sparkling Lemonade',                      7.50,  'Drinks',      'Fresh lemon juice with sparkling water and mint.'),
    item(id, 'Croissant',                                5.00,  'Pastries',   'Flaky, buttery French croissant.'),
    item(id, 'Banana Bread',                             6.00,  'Pastries',   'Moist banana bread slice.'),
    item(id, 'Cheesecake Slice',                          9.00,  'Pastries',   'New York baked cheesecake with berry topping.'),
    item(id, 'Tiramisu',                                  10.00,  'Pastries',  "Espresso-soaked ladyfingers with mascarpone cream."),
  ],

  'Pastries & Cafe': (id) => [
    item(id, 'Butter Croissant',                      5.00,  'Pastries',   'Classic French flaky croissant.'),
    item(id, 'Almond Croissant',                       7.00,  'Pastries',   'Croissant filled and topped with almond frangipane.'),
    item(id, 'Cinnamon Roll',                           7.50,  'Pastries',   'Soft cinnamon swirl with cream cheese icing.'),
    item(id, 'Pain au Chocolat',                         6.00,  'Pastries',   'Flaky pastry encasing dark chocolate batons.'),
    item(id, 'Banana Bread Slice',                       5.50,  'Pastries',   'Moist banana bread with walnuts.'),
    item(id, 'Lemon Tart',                                7.50,  'Pastries',   'Buttery tart shell with tangy lemon curd.'),
    item(id, 'Chocolate Brownie',                         6.50,  'Pastries',   'Dense, fudgy chocolate brownie with sea salt.'),
    item(id, 'Scone with Jam & Cream',                    7.00,  'Pastries',   'Warm scone served with clotted cream and jam.'),
    item(id, 'Eggs Benny',                               18.00,  'Breakfast',  'Poached eggs with hollandaise on English muffin.'),
    item(id, 'Avocado Toast',                             16.00,  'Breakfast',  'Smashed avo on sourdough with poached egg.'),
    item(id, 'Granola Bowl',                              13.00,  'Breakfast',  'House granola with yogurt and seasonal fruit.'),
    item(id, 'Flat White',                                 8.00,  'Drinks',     'Double ristretto with velvety microfoam.'),
    item(id, 'Latte',                                       8.00,  'Drinks',     'Espresso with steamed milk.'),
    item(id, 'Cold Brew',                                    9.00,  'Drinks',     '12-hour cold steep, smooth and rich.'),
    item(id, 'Matcha Latte',                                  9.00,  'Drinks',    'Ceremonial matcha with steamed oat milk.'),
    item(id, 'Iced Americano',                                7.00,  'Drinks',    'Espresso over ice with cold water.'),
    item(id, 'Cheesecake',                                    9.00,  'Dessert',   'Baked New York cheesecake.'),
    item(id, 'Affogato',                                       8.00,  'Dessert',  'Vanilla ice cream drowned in hot espresso.'),
  ],

  // ── Dessert ────────────────────────────────────────────────────────────────
  Dessert: (id) => [
    item(id, 'Ais Kacang Biasa',                     4.50,  'Dessert',     'Shaved ice with red beans, corn, and rose syrup.'),
    item(id, 'Ais Kacang Special',                    7.00,  'Dessert',     'Premium shaved ice with durian, jackfruit, and ice cream.'),
    item(id, 'Cendol Biasa',                          4.50,  'Dessert',     'Green pandan jelly with coconut milk and gula melaka.'),
    item(id, 'Cendol Durian',                          8.00,  'Dessert',     'Cendol topped with fresh Penang durian pulp.'),
    item(id, 'Bubur Cha Cha',                           5.00,  'Dessert',     'Coconut milk dessert with yam, sweet potato, and sago.'),
    item(id, 'Ice Cream (Single Scoop)',                 4.00,  'Dessert',     'Scoop of flavour: vanilla, chocolate, or strawberry.'),
    item(id, 'Ice Cream Sundae',                         9.00,  'Dessert',     'Three scoops with chocolate sauce, nuts, and whipped cream.'),
    item(id, 'Pengat Pisang',                             5.00,  'Dessert',     'Banana in sweet pandan coconut milk.'),
    item(id, 'Pisang Goreng + Ice Cream',                 9.00,  'Dessert',     'Hot banana fritters with cold vanilla ice cream.'),
    item(id, 'Durian Ice Cream',                           8.00,  'Dessert',     'Creamy local durian ice cream.'),
    item(id, 'Mango Sticky Rice',                          9.00,  'Dessert',     'Thai-style sweet sticky rice with fresh mango and coconut cream.'),
    item(id, 'Pulut Hitam',                                5.00,  'Dessert',     'Black glutinous rice porridge in coconut milk.'),
    item(id, 'Kuih Talam',                                  3.00,  'Snacks',      'Two-layer steamed pandan and coconut cake.'),
    item(id, 'Onde Onde (5 pcs)',                           4.00,  'Snacks',      'Pandan glutinous balls with gula melaka filling.'),
    item(id, 'Teh Tarik',                                    2.50,  'Drinks',     'Frothy pulled tea.'),
    item(id, 'Barley Sejuk',                                  3.50,  'Drinks',    'Chilled barley water.'),
    item(id, 'Air Kelapa',                                     5.00,  'Drinks',   'Fresh coconut water.'),
    item(id, 'Sirap Bandung',                                   3.00,  'Drinks',  'Rose milk on ice.'),
  ],

  // ── Mixed / Hawker Centre ─────────────────────────────────────────────────
  Mixed: (id) => [
    item(id, 'Char Koay Teow',                        8.00,  'Main Course', 'Wok-fried flat rice noodles.'),
    item(id, 'Assam Laksa',                             7.50,  'Main Course', 'Sour fish broth with rice noodles.'),
    item(id, 'Hokkien Mee',                             8.00,  'Main Course', 'Thick prawn and pork broth noodles.'),
    item(id, 'Nasi Lemak',                               5.00,  'Main Course', 'Coconut rice with sambal and sides.'),
    item(id, 'Pasembur',                                  9.00,  'Main Course', 'Indian rojak salad in peanut sauce.'),
    item(id, 'Mee Goreng Mamak',                          7.00,  'Main Course', 'Spicy mamak fried noodles.'),
    item(id, 'Oyster Omelette',                           9.00,  'Main Course', 'Crispy egg omelette with fresh oysters.'),
    item(id, 'Satay (10 skewers)',                       12.00,  'Main Course', 'Grilled meat skewers with peanut sauce and ketupat.'),
    item(id, 'Fried Chicken (2 pcs)',                     7.50,  'Main Course', 'Crispy deep-fried spiced chicken.'),
    item(id, 'Popiah Basah',                               3.50,  'Snacks',      'Soft fresh spring roll with turnip and sweet paste.'),
    item(id, 'Cucur Udang',                                4.00,  'Snacks',      'Prawn fritters.'),
    item(id, 'Cendol',                                      4.50,  'Dessert',     'Pandan jelly in coconut milk with gula melaka.'),
    item(id, 'Ais Kacang',                                   4.50,  'Dessert',    'Shaved ice dessert.'),
    item(id, 'Teh Tarik',                                     2.50,  'Drinks',    'Pulled milk tea.'),
    item(id, 'Kopi O',                                         2.00,  'Drinks',   'Black Hainanese coffee.'),
    item(id, 'Coconut Water',                                   5.00,  'Drinks',  'Fresh coconut water.'),
    item(id, 'Milo Ais',                                         3.50,  'Drinks', 'Iced Milo.'),
    item(id, 'Sirap Limau',                                       3.00,  'Drinks', 'Rose syrup with lime on ice.'),
  ],

  // ── Middle Eastern ─────────────────────────────────────────────────────────
  'Middle Eastern': (id) => [
    item(id, 'Shawarma Chicken',                     9.00,  'Main Course', 'Rotisserie chicken wrap with garlic sauce and pickles.'),
    item(id, 'Shawarma Lamb',                        11.00,  'Main Course', 'Rotisserie lamb wrap with hummus and vegetables.'),
    item(id, 'Kebab Plate',                          16.00,  'Main Course', 'Mixed grilled skewers with rice, salad, and sauce.'),
    item(id, 'Lamb Kofta',                           14.00,  'Main Course', 'Spiced minced lamb patties grilled over charcoal.'),
    item(id, 'Falafel Wrap',                          8.00,  'Main Course', 'Crispy chickpea balls in pita with tahini and salad.'),
    item(id, 'Hummus with Pita',                      8.00,  'Starter',     'Creamy chickpea dip with warm pita bread.'),
    item(id, 'Fattoush Salad',                         8.00,  'Starter',     'Lebanese bread salad with pomegranate dressing.'),
    item(id, 'Tabbouleh',                               7.00,  'Starter',     'Parsley and bulgur salad with lemon.'),
    item(id, 'Pita Bread (3 pcs)',                      3.00,  'Side Dish',   'Warm soft pita bread.'),
    item(id, 'Garlic Sauce',                             2.00,  'Side Dish',   'Creamy toum (garlic whip).'),
    item(id, 'Pickled Turnip',                            2.00,  'Side Dish',   'Pink pickled turnip — classic Middle Eastern condiment.'),
    item(id, 'Nasi Arab Kabsa',                          14.00,  'Main Course', 'Fragrant basmati rice with spiced chicken.'),
    item(id, 'Mint Lemonade',                              6.50,  'Drinks',      'Fresh mint, lemon, and sugar blend on ice.'),
    item(id, 'Arabic Coffee (Qahwa)',                      4.00,  'Drinks',      'Cardamom-spiced Arabic coffee.'),
    item(id, 'Jallab',                                      5.00,  'Drinks',      'Rose water, grape juice, and pine nuts drink.'),
    item(id, 'Baklava (3 pcs)',                              7.00,  'Dessert',     'Layered filo pastry with nuts and honey syrup.'),
    item(id, 'Knafeh',                                       9.00,  'Dessert',     'Shredded pastry filled with cheese in sweet syrup.'),
    item(id, 'Umm Ali',                                       8.00,  'Dessert',     'Egyptian bread pudding with nuts and cream.'),
  ],

  // ── Thai ──────────────────────────────────────────────────────────────────
  Thai: (id) => [
    item(id, 'Tomyam Kung (Prawns)',                  14.00,  'Main Course', 'Spicy-sour prawn soup with lemongrass and kaffir lime.'),
    item(id, 'Tomyam Seafood',                         16.00,  'Main Course', 'Spicy-sour soup with mixed seafood.'),
    item(id, 'Pad Thai',                               11.00,  'Main Course', 'Stir-fried rice noodles with egg, tofu, bean sprouts, and tamarind.'),
    item(id, 'Shellout Mix (250g)',                    28.00,  'Main Course', 'Mixed shellfish cooked in spiced shellout sauce.'),
    item(id, 'Green Curry Chicken',                    13.00,  'Main Course', 'Aromatic green curry with chicken and coconut milk.'),
    item(id, 'Red Curry Prawn',                        15.00,  'Main Course', 'Rich red curry with juicy prawns.'),
    item(id, 'Basil Chicken (Pad Krapow)',              12.00,  'Main Course', 'Minced chicken stir-fried with Thai basil and chili.'),
    item(id, 'Mango Sticky Rice',                        9.00,  'Dessert',     'Sweet sticky rice with fresh mango and coconut cream.'),
    item(id, 'Coconut Milk Pudding',                     6.00,  'Dessert',     'Silky sweet coconut milk jelly.'),
    item(id, 'Som Tum (Papaya Salad)',                    8.00,  'Side Dish',   'Shredded green papaya with chili, lime, and fish sauce.'),
    item(id, 'Spring Roll (4 pcs)',                       6.00,  'Side Dish',   'Crispy fried spring rolls with sweet chili dip.'),
    item(id, 'Steamed Jasmine Rice',                       2.50,  'Side Dish',  'Fragrant Thai jasmine rice.'),
    item(id, 'Thai Iced Tea (Cha Yen)',                    5.00,  'Drinks',     'Sweet and creamy iced Thai tea.'),
    item(id, 'Pandan Juice',                               4.00,  'Drinks',     'Fresh pandan leaf extract on ice.'),
    item(id, 'Coconut Water',                               5.00,  'Drinks',    'Chilled fresh coconut water.'),
    item(id, 'Lime Soda',                                    4.00,  'Drinks',   'Sparkling water with fresh lime.'),
  ],

  // ── Fusion ────────────────────────────────────────────────────────────────
  Fusion: (id) => [
    item(id, 'Char Koay Teow Pizza',                  18.00,  'Main Course', 'Thin crust pizza topped with CKT noodles, cockles, and wok hei aioli.'),
    item(id, 'Laksa Carbonara',                         18.00,  'Main Course', 'Spaghetti carbonara with Penang laksa-spiced cream sauce.'),
    item(id, 'Nasi Lemak Burger',                        16.00,  'Main Course', 'Crispy rendang chicken burger with coconut rice bun.'),
    item(id, 'Satay Chicken Wings',                       14.00,  'Main Course', 'Satay-spiced fried chicken wings with peanut dip.'),
    item(id, 'Sambal Pasta',                               16.00,  'Main Course', 'Fettuccine tossed in spicy sambal belacan sauce.'),
    item(id, 'Penang Tacos',                               15.00,  'Main Course', 'Corn tortillas with char koay teow filling and pickled turnip.'),
    item(id, 'Rendang Quesadilla',                         14.00,  'Main Course', 'Beef rendang and cheese in a crispy tortilla.'),
    item(id, 'Kaya Toast Ice Cream Sandwich',               9.00,  'Dessert',     'Vanilla ice cream between two slices of kaya toast.'),
    item(id, 'Cendol Panna Cotta',                          10.00,  'Dessert',    'Italian panna cotta infused with pandan and gula melaka.'),
    item(id, 'Durian Cheesecake',                           12.00,  'Dessert',    'Creamy cheesecake with Musang King durian topping.'),
    item(id, 'Teh Tarik Latte',                               8.00,  'Drinks',    'Espresso with pulled tea instead of milk.'),
    item(id, 'Bandung Soda',                                   6.00,  'Drinks',   'Rose milk with sparkling water.'),
    item(id, 'Pandan Cold Brew',                                9.00,  'Drinks',  'Cold-brewed coffee infused with pandan leaf.'),
    item(id, 'Garlic Bread',                                    5.00,  'Side Dish','Toasted baguette with garlic butter.'),
    item(id, 'Sweet Potato Fries',                               6.00,  'Side Dish','Crispy sweet potato fries with aioli.'),
    item(id, 'Nachos with Sambal Salsa',                          9.00,  'Snacks',  'Tortilla chips with sambal-spiked tomato salsa and sour cream.'),
  ],

  // ── Snack ─────────────────────────────────────────────────────────────────
  Snack: (id) => [
    item(id, 'Goreng Pisang (5 pcs)',                  3.50,  'Snacks',      'Classic deep-fried banana fritters.'),
    item(id, 'Goreng Pisang Cheese',                    5.00,  'Snacks',      'Banana fritters with cheese drizzle.'),
    item(id, 'Cempedak Goreng (3 pcs)',                  4.50,  'Snacks',      'Battered deep-fried cempedak fruit.'),
    item(id, 'Ubi Kayu Goreng',                           3.00,  'Snacks',      'Crispy fried tapioca strips.'),
    item(id, 'Keledek Goreng',                             3.00,  'Snacks',      'Sweet potato fritters.'),
    item(id, 'Popiah Basah',                                3.50,  'Snacks',     'Fresh spring roll with turnip, egg, and sweet paste.'),
    item(id, 'Kuih Bahulu',                                  3.00,  'Snacks',    'Bite-sized sponge cake from mould.'),
    item(id, 'Tau Sar Pneah',                                 3.00,  'Snacks',   'Flaky Penang pastry with green mung bean filling.'),
    item(id, 'Kuih Talam',                                     2.50,  'Snacks',  'Layered pandan and coconut steamed cake.'),
    item(id, 'Onde Onde (5 pcs)',                               4.00,  'Snacks', 'Pandan rice balls with gula melaka.'),
    item(id, 'Curry Puff',                                       2.50,  'Snacks','Flaky pastry with spiced potato filling.'),
    item(id, 'Rojak Buah',                                        6.00,  'Snacks','Fruit rojak with prawn paste dressing.'),
    item(id, 'Goreng Pisang Ice Cream',                            8.00,  'Dessert','Hot banana fritters with vanilla ice cream.'),
    item(id, 'Ais Kacang',                                          4.50,  'Dessert','Shaved ice with beans and syrup.'),
    item(id, 'Cendol',                                               4.50,  'Dessert','Pandan jelly in coconut milk.'),
    item(id, 'Teh O Ais',                                             2.50,  'Drinks','Iced black tea.'),
    item(id, 'Kopi O',                                                 2.00,  'Drinks','Black Hainanese coffee.'),
    item(id, 'Air Kelapa',                                              5.00,  'Drinks','Fresh coconut water.'),
    item(id, 'Cincau Ais',                                               3.00,  'Drinks','Iced grass jelly drink.'),
  ],

  // ── Japanese ──────────────────────────────────────────────────────────────
  Japanese: (id) => [
    item(id, 'Salmon Sashimi (6 pcs)',                 18.00,  'Sashimi',     'Fresh Atlantic salmon, sliced thick.'),
    item(id, 'Tuna Sashimi (6 pcs)',                   20.00,  'Sashimi',     'Premium bluefin tuna sashimi.'),
    item(id, 'Salmon Nigiri (2 pcs)',                  12.00,  'Sushi',       'Hand-pressed rice topped with fresh salmon.'),
    item(id, 'California Roll (6 pcs)',                14.00,  'Sushi',       'Crab, avocado, and cucumber inside out roll.'),
    item(id, 'Dragon Roll (8 pcs)',                    22.00,  'Sushi',       'Prawn tempura roll topped with avocado and unagi.'),
    item(id, 'Tonkotsu Ramen',                         18.00,  'Ramen',       'Rich pork bone broth with chashu, ajitsuke tamago, and nori.'),
    item(id, 'Shoyu Ramen',                             16.00,  'Ramen',       'Soy-based broth with chicken chashu and bamboo shoots.'),
    item(id, 'Chicken Teriyaki Don',                    16.00,  'Donburi',     'Teriyaki chicken over steamed Japanese rice.'),
    item(id, 'Unagi Don',                                22.00,  'Donburi',    'Grilled eel in teriyaki sauce over rice.'),
    item(id, 'Gyoza (6 pcs)',                             9.00,  'Side Dish',  'Pan-fried pork and cabbage dumplings.'),
    item(id, 'Edamame',                                    5.00,  'Side Dish', 'Salted steamed soy beans.'),
    item(id, 'Miso Soup',                                   4.00,  'Side Dish','Tofu, wakame, and spring onion in dashi broth.'),
    item(id, 'Matcha Latte',                                  9.00,  'Drinks',  'Japanese ceremonial matcha with steamed milk.'),
    item(id, 'Ramune',                                          5.00,  'Drinks', 'Japanese marble-sealed soda.'),
    item(id, 'Japanese Green Tea',                               4.00,  'Drinks','Premium sencha green tea.'),
    item(id, 'Mochi Ice Cream (2 pcs)',                           8.00,  'Dessert','Glutinous rice cakes with ice cream filling.'),
    item(id, 'Matcha Cheesecake',                                  10.00,  'Dessert','Baked cheesecake with ceremonial matcha.'),
  ],

  // ── Indian (catch-all) ────────────────────────────────────────────────────
  Indian: (id) => [
    item(id, 'Banana Leaf Rice',                        9.00,  'Main Course', 'Unlimited rice with rotating curries and papadom.'),
    item(id, 'Chicken Briyani',                         14.00,  'Main Course', 'Aromatic basmati rice with spiced chicken.'),
    item(id, 'Mutton Briyani',                           16.00,  'Main Course', 'Fragrant rice with tender spiced mutton.'),
    item(id, 'Fish Curry',                                10.00,  'Main Course', 'Fresh fish in rich tamarind curry.'),
    item(id, 'Chicken Curry',                              9.00,  'Main Course', 'Aromatic chicken curry.'),
    item(id, 'Prawn Masala',                               14.00,  'Main Course','Spiced prawn in onion-tomato masala.'),
    item(id, 'Tosai',                                        3.00,  'Main Course','Crispy fermented crepe with chutneys.'),
    item(id, 'Roti Canai',                                    2.00,  'Main Course','Flaky flatbread with dhall.'),
    item(id, 'Sambar',                                         2.50,  'Side Dish', 'Vegetable lentil curry.'),
    item(id, 'Coconut Chutney',                                1.50,  'Side Dish', 'Fresh coconut and chili chutney.'),
    item(id, 'Papadom',                                         1.00,  'Side Dish', 'Crispy lentil wafer.'),
    item(id, 'Raita',                                            2.50,  'Side Dish', 'Yogurt with cucumber.'),
    item(id, 'Teh Tarik',                                         2.50,  'Drinks',   'Pulled milk tea.'),
    item(id, 'Filter Coffee',                                      3.00,  'Drinks',  'South Indian drip coffee.'),
    item(id, 'Lassi Mango',                                         5.00,  'Drinks', 'Mango yogurt drink.'),
    item(id, 'Gulab Jamun',                                          4.00,  'Dessert','Milk-solid balls in rose syrup.'),
    item(id, 'Halwa',                                                 4.50,  'Dessert','Semolina pudding with ghee and cashews.'),
    item(id, 'Payasam',                                               4.50,  'Dessert','Vermicelli pudding in coconut milk.'),
  ],

  // ── Jawi Peranakan ─────────────────────────────────────────────────────────
  'Jawi Peranakan': (id) => [
    item(id, 'Nasi Lemuni',                              10.00,  'Main Course', 'Vitex-leaf-scented rice with chicken and herbs.'),
    item(id, 'Bamiyah (Lamb Stew)',                       18.00,  'Main Course', 'Slow-cooked lamb with okra in aromatic stew.'),
    item(id, 'Nasi Dagang Jawi',                          10.00,  'Main Course', 'Coconut-scented glutinous rice with fish curry.'),
    item(id, 'Gulai Ikan Tongkol',                         12.00,  'Main Course','Tuna in rich Jawi-spiced coconut curry.'),
    item(id, 'Acar Timun Jawi',                             4.50,  'Side Dish',  'Jawi-style cucumber pickle with turmeric.'),
    item(id, 'Sambal Belacan',                               2.50,  'Side Dish', 'Shrimp paste sambal with lime.'),
    item(id, 'Kuih Cara Berlauk',                            4.00,  'Snacks',    'Savoury spiced coconut milk cupcakes.'),
    item(id, 'Dodol',                                         4.00,  'Snacks',   'Sticky sweet jaggery and coconut toffee.'),
    item(id, 'Cendol Jawi',                                   5.50,  'Dessert',  'Pandan jelly with coconut milk and gula kabung.'),
    item(id, 'Pengat Durian Jawi',                             9.00,  'Dessert', 'Durian in pandan coconut milk.'),
    item(id, 'Teh Bunga (Flower Tea)',                          5.00,  'Drinks',  'Dried flower blend hot tea.'),
    item(id, 'Air Asam Jawa',                                    3.50,  'Drinks', 'Tamarind refresher with palm sugar.'),
    item(id, 'Kopi Jawi',                                         3.00,  'Drinks','Traditional Jawi-style coffee.'),
    item(id, 'Air Mata Kucing',                                     4.00,  'Drinks','Longan and winter melon herbal drink.'),
    item(id, 'Nasi Putih',                                           2.00,  'Side Dish','Steamed white rice.'),
    item(id, 'Roti Bengali',                                          2.50,  'Side Dish','Crusty Bengali bread.'),
  ],

  // ── Malay/Indonesian ──────────────────────────────────────────────────────
  'Malay/Indonesian': (id) => [
    item(id, 'Nasi Padang Campur',                        10.00,  'Main Course', 'Rice with 3 Minangkabau side dishes.'),
    item(id, 'Rendang Daging Minang',                      14.00,  'Main Course','Authentic dry beef rendang.'),
    item(id, 'Ayam Pop',                                     8.00,  'Main Course','Steamed then fried Padang-style chicken.'),
    item(id, 'Gulai Kambing',                                13.00,  'Main Course','Mutton in coconut milk curry.'),
    item(id, 'Sate Padang (10 skewers)',                     12.00,  'Main Course','Beef skewers with thick curry sauce.'),
    item(id, 'Gulai Pakis',                                    6.00,  'Side Dish', 'Jungle fern in coconut curry.'),
    item(id, 'Telur Balado',                                    4.50,  'Side Dish','Hard egg in red sambal.'),
    item(id, 'Perkedel Kentang',                                 3.00,  'Side Dish','Potato fritters with minced meat.'),
    item(id, 'Daun Singkong',                                     3.00,  'Side Dish','Boiled cassava leaves.'),
    item(id, 'Kerupuk Udang',                                      2.50,  'Side Dish','Prawn crackers.'),
    item(id, 'Nasi Putih',                                          2.00,  'Side Dish','Steamed white rice.'),
    item(id, 'Es Teh Manis',                                         3.00,  'Drinks',   'Iced sweet tea.'),
    item(id, 'Es Jeruk',                                              3.50,  'Drinks',  'Iced fresh orange juice.'),
    item(id, 'Es Kelapa Muda',                                         5.00,  'Drinks', 'Iced young coconut water.'),
    item(id, 'Bubur Hitam',                                             5.00,  'Dessert','Black glutinous rice pudding.'),
    item(id, 'Kolak Pisang',                                             4.50,  'Dessert','Banana in sweet coconut palm sugar syrup.'),
    item(id, 'Es Cincau',                                                 3.00,  'Drinks','Iced grass jelly drink.'),
  ],

  // ── Default fallback ──────────────────────────────────────────────────────
  Default: (id) => [
    item(id, 'Main Dish',                                10.00,  'Main Course', "Chef's signature main dish."),
    item(id, 'Special of the Day',                        12.00,  'Main Course', "Today's special — ask our staff."),
    item(id, 'Rice Set',                                   8.00,  'Main Course', 'Rice with two side dishes.'),
    item(id, 'Noodle Dish',                                 8.00,  'Main Course', 'Stir-fried or soup noodles.'),
    item(id, 'Soup of the Day',                              8.00,  'Starter',    "Today's hot soup."),
    item(id, 'Mixed Vegetables',                              6.00,  'Side Dish', 'Stir-fried seasonal vegetables.'),
    item(id, 'Steamed Rice',                                   2.00,  'Side Dish', 'Steamed white rice.'),
    item(id, 'Fried Egg',                                       2.50,  'Side Dish', 'Simple fried egg.'),
    item(id, 'Sambal',                                           2.00,  'Side Dish', 'House sambal condiment.'),
    item(id, 'Kopi O',                                            2.00,  'Drinks',   'Black coffee.'),
    item(id, 'Teh Tarik',                                          2.50,  'Drinks',  'Pulled milk tea.'),
    item(id, 'Milo Ais',                                            3.50,  'Drinks', 'Iced Milo.'),
    item(id, 'Air Kosong',                                           1.00,  'Drinks','Plain water.'),
    item(id, 'Ais Kacang',                                            4.50,  'Dessert','Shaved ice dessert.'),
    item(id, 'Cendol',                                                 4.50,  'Dessert','Pandan jelly in coconut milk.'),
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🔎 Fetching all stalls...');
  const stallsSnap = await db.collection('FoodStalls').get();
  const allStalls  = stallsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log('Total stalls:', allStalls.length);

  // Find stalls that already have menus
  console.log('🔎 Checking existing menus...');
  const menuSnap = await db.collection('menu').get();
  const stallsWithMenus = new Set();
  menuSnap.docs.forEach(d => stallsWithMenus.add(d.data().stallID));
  console.log('Stalls already with menus:', stallsWithMenus.size);

  const toSeed = allStalls.filter(s => !stallsWithMenus.has(s.id));
  console.log('Stalls to seed:', toSeed.length, '\n');

  let totalWritten = 0;
  const BATCH_LIMIT = 400;
  let batch = db.batch();
  let batchCount = 0;

  for (const stall of toSeed) {
    // Normalise cuisine type to find the right template
    const rawCuisine = Array.isArray(stall.cuisineType)
      ? stall.cuisineType[0]
      : (stall.cuisineType || '');

    const templateFn = TEMPLATES[rawCuisine] || TEMPLATES.Default;
    const items = templateFn(stall.id);

    console.log(`  🍽  [${rawCuisine || 'Default'}] ${stall.stallName} — ${items.length} items`);

    for (const menuItem of items) {
      const ref = db.collection('menu').doc();
      batch.set(ref, menuItem);
      batchCount++;
      totalWritten++;

      if (batchCount >= BATCH_LIMIT) {
        await batch.commit();
        console.log(`    ✅ Committed batch of ${batchCount}`);
        batch = db.batch();
        batchCount = 0;
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Final batch of ${batchCount} committed`);
  }

  console.log(`\n🎉 Done! Total menu items written: ${totalWritten}`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
