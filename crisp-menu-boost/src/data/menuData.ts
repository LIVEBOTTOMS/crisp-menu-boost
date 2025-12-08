export interface MenuItem {
  name: string;
  price?: string;
  description?: string;
  halfPrice?: string;
  fullPrice?: string;
  sizes?: string[];
  image?: string;
}

export interface MenuCategory {
  title: string;
  icon?: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  categories: MenuCategory[];
}

export const snacksAndStarters: MenuSection = {
  title: "ARTISAN APPETIZERS",
  categories: [
    {
      title: "VEG",
      items: [
        { name: "Fried Peanuts", price: "₹150", description: "Crispy salted peanuts roasted to golden perfection" },
        { name: "Fried Papad", price: "₹116", description: "Traditional crispy lentil wafers, lightly spiced" },
        { name: "Masala Papad", price: "₹126", description: "Topped with fresh onions, tomatoes & tangy chaat masala" },
        { name: "Veg Pakoda", price: "₹180", description: "Assorted vegetables in chickpea batter, golden fried" },
        { name: "Veg Crispie", price: "₹150", description: "Crunchy vegetable fritters with house-made green chutney" },
        { name: "Paneer Pakoda", price: "₹194", description: "Cottage cheese cubes in spiced gram flour coating" },
        { name: "Veg Cutlet", price: "₹180", description: "Hand-pressed mixed vegetable patties, herb-crusted" },
        { name: "Cheese Pakoda", price: "₹213", description: "Melting cheese encased in crispy golden batter" },
        { name: "Cheese Balls", price: "₹200", description: "Creamy cheese spheres with a crunchy breadcrumb shell" },
        { name: "French Fries", price: "₹160", description: "Hand-cut potatoes, twice-fried for extra crispiness" },
        { name: "Corn Crisipie", price: "₹140", description: "Sweet corn kernels flash-fried with aromatic spices" },
        { name: "Matki Fry", price: "₹150", description: "Sprouted moth beans sautéed with fresh herbs" },
        { name: "Kaju Masala Fry", price: "₹309", description: "Premium cashews tossed in aromatic spices" },
        { name: "Onion Rings", price: "₹173", description: "Crispy beer-battered onion rings with tangy dip" },
        { name: "Cheese Nachos", price: "₹290", description: "Tortilla chips loaded with melted cheese & jalapeños" },
        { name: "Peri Peri Fries", price: "₹212", description: "Spicy peri-peri seasoned crispy fries" },
        { name: "Cheese French Fries", price: "₹241", description: "Golden fries smothered in melted cheese sauce" },
      ],
    },
    {
      title: "NON-VEG",
      items: [
        { name: "Fried Chicken", price: "₹220", description: "Succulent pieces marinated overnight, deep-fried crispy" },
        { name: "Chicken Lollypop", price: "₹250", description: "Frenched drumettes in spicy Indo-Chinese glaze" },
        { name: "Chicken Cutlet", price: "₹250", description: "Minced chicken patties with caramelized onions" },
        { name: "Tandoori Chicken (Full)", price: "₹350", description: "Whole bird marinated in yogurt & 24 spices, clay-oven roasted" },
        { name: "Tandoori Chicken (Half)", price: "₹200", description: "Half portion of our signature clay-oven specialty" },
        { name: "Chicken Tikka", price: "₹280", description: "Boneless chunks in saffron-kissed tikka marinade" },
        { name: "Chicken Kabab", price: "₹260", description: "Hand-ground seekh kababs with fresh mint" },
        { name: "Chicken Chatpata", price: "₹240", description: "Tangy spiced chicken bites with tamarind drizzle" },
        { name: "Chicken Rara", price: "₹250", description: "Keema-coated chicken in rich tomato gravy" },
        { name: "Chicken Khara", price: "₹240", description: "Dry-rubbed with crushed peppercorns & whole spices" },
        { name: "Chicken Tawa", price: "₹280", description: "Griddle-seared with bell peppers & onions" },
        { name: "Paneer 65", price: "₹220", description: "Cottage cheese in fiery Hyderabadi-style batter" },
        { name: "Paneer & Chillie", price: "₹230", description: "Wok-tossed with fresh chilies & soy glaze" },
        { name: "Boiled Eggs (2 Pcs)", price: "₹76", description: "Perfectly boiled farm-fresh eggs" },
        { name: "Egg Pakoda", price: "₹183", description: "Boiled eggs in spiced chickpea batter, deep-fried" },
        { name: "Chicken Nachos", price: "₹309", description: "Loaded nachos with spiced chicken & cheese" },
        { name: "Chicken Nuggets", price: "₹338", description: "Crispy breaded chicken bites with dipping sauce" },
        { name: "Fish Finger", price: "₹357", description: "Tender fish strips in golden breadcrumb coating" },
        { name: "Chicken 65", price: "₹452", description: "Spicy South Indian-style fried chicken" },
      ],
    },
  ],
};

export const foodMenu: MenuSection = {
  title: "GLOBAL MAINS",
  categories: [
    {
      title: "Non-Vegetarian Handi & Firepot",
      icon: "🍲",
      items: [
        { name: "Chicken Kolhapuri Firepot", price: "₹379", description: "Intensely spiced with dried red chilies & coconut" },
        {
          name: "Solapuri Chicken Handi",
          halfPrice: "₹459",
          fullPrice: "₹799",
          description: "Rustic preparation with black stone flower & wild spices"
        },
        { name: "Slow-Cooked Butter Chicken Handi", halfPrice: "₹529", fullPrice: "₹899", description: "Velvety tomato-cream gravy with charred chicken" },
        { name: "Royal Murgh Musallam Handi", halfPrice: "₹579", fullPrice: "₹949", description: "Whole chicken stuffed with aromatic rice & eggs" },
      ],
    },
    {
      title: "Slow-Cooked Mutton Specialities",
      icon: "🍖",
      items: [
        { name: "Mutton Ukkad Handi", halfPrice: "₹699", fullPrice: "₹1,199", description: "Traditional bone-in curry simmered for 6 hours" },
        { name: "Solapuri Mutton Handi", halfPrice: "₹739", fullPrice: "₹1,249", description: "Authentic Solapur-style with kala masala" },
        { name: "Kolhapuri Mutton Handi", halfPrice: "₹739", fullPrice: "₹1,249", description: "Fiery red gravy with freshly ground masala" },
        { name: "Rustic Mutton Curry", price: "₹399", description: "Home-style preparation with caramelized onions" },
        { name: "Signature Mutton Masala", price: "₹419", description: "Chef's special blend of 18 hand-roasted spices" },
      ],
    },
    {
      title: "The Live Thali Experience",
      icon: "🍽️",
      items: [
        {
          name: "Luxe Veg Thali",
          price: "₹249",
          description: "Seasonal vegetables, signature gravy, dal fry, rice, salad, papad & assorted breads"
        },
        { name: "Egg Thali", price: "₹279", description: "Masala egg preparation, rassa, dal, rice, salad & assorted breads" },
        { name: "Classic Chicken Thali", price: "₹339", description: "Chicken fry, rassa, soup, rice, salad & assorted breads" },
        { name: "Royal Mutton Thali", price: "₹499", description: "Mutton fry, Solapuri rassa, soup, wajdi, rice, salad & assorted breads" },
      ],
    },
    {
      title: "Vegetarian Chef's Mains",
      icon: "🥗",
      items: [
        { name: "Paneer Patiyala Royal", price: "₹359", description: "Creamy cottage cheese in rich cashew-tomato gravy" },
        { name: "Paneer Handi Signature", price: "₹349", description: "Slow-cooked in earthen pot with whole spices" },
        { name: "Paneer Tikka Masala / Lajawab Masala", price: "₹359", description: "Charred paneer cubes in smoky tomato sauce" },
        { name: "Classic Paneer Butter Masala", price: "₹369", description: "Silky makhani gravy with farm-fresh paneer" },
        { name: "Paneer Kadai Karari", price: "₹359", description: "Bell peppers & cottage cheese with kadai spices" },
        { name: "Diwani Paneer Handi", price: "₹379", description: "Mixed vegetables & paneer in aromatic curry" },
        { name: "Homestyle Paneer Masala", price: "₹339", description: "Simple, comforting preparation with onion-tomato base" },
        { name: "Paneer Bhurji Scramble", price: "₹329", description: "Crumbled cottage cheese with peppers & fresh herbs" },
        { name: "Kaju Rich Masala", price: "₹399", description: "Premium cashews in velvety saffron cream" },
        { name: "Kaju Cream Curry", price: "₹399", description: "Whole cashews swimming in delicate white gravy" },
        { name: "Veg Patiyala", price: "₹329", description: "Garden vegetables in royal Punjabi-style sauce" },
        { name: "Veg Kolhapuri Pot", price: "₹329", description: "Seasonal vegetables in spicy Kolhapuri masala" },
        { name: "Paneer Chilli", price: "₹452", description: "Indo-Chinese style paneer with bell peppers & soy sauce" },
        { name: "Mushroom Chilli", price: "₹376", description: "Button mushrooms in spicy garlic chilli sauce" },
        { name: "Gobi Manchurian", price: "₹418", description: "Crispy cauliflower in tangy Manchurian sauce" },
        { name: "Veg Spring Roll", price: "₹418", description: "Crispy rolls filled with fresh vegetables" },
        { name: "Honey Chilli Potato", price: "₹384", description: "Crispy potato fingers in sweet & spicy glaze" },
      ],
    },
  ],
};

export const beveragesMenu: MenuSection = {
  title: "CRAFT LIBATIONS",
  categories: [
    {
      title: "Craft & Classic Brews - Large (650 ml)",
      icon: "🍺",
      items: [
        { name: "Kingfisher Premium", price: "₹289", description: "India's favorite crisp, refreshing lager" },
        { name: "Budweiser Mild", price: "₹319", description: "Smooth American-style pale lager" },
        { name: "Budweiser Magnum Strong", price: "₹349", description: "Bold & full-bodied with rich malt character" },
        { name: "Tuborg Strong", price: "₹279", description: "Danish heritage with robust flavor profile" },
        { name: "Carlsberg Smooth", price: "₹299", description: "Exceptionally smooth Scandinavian brew" },
        { name: "Heineken", price: "₹329", description: "Iconic Dutch pilsner with balanced bitterness" },
        { name: "Breezer Cranberry (275 ml)", price: "₹269", description: "Light & fruity with tart cranberry notes" },
        { name: "Breezer Blackberry (275 ml)", price: "₹269", description: "Sweet berry refreshment, perfectly chilled" },
      ],
    },
    {
      title: "Craft & Classic Brews - Pint",
      icon: "🍺",
      items: [
        { name: "Kingfisher Premium", price: "₹199", description: "India's favorite crisp, refreshing lager" },
        { name: "Budweiser Mild", price: "₹219", description: "Smooth American-style pale lager" },
        { name: "Budweiser Magnum Strong", price: "₹239", description: "Bold & full-bodied with rich malt character" },
        { name: "Tuborg Strong", price: "₹189", description: "Danish heritage with robust flavor profile" },
        { name: "Carlsberg Smooth", price: "₹209", description: "Exceptionally smooth Scandinavian brew" },
        { name: "Heineken", price: "₹229", description: "Iconic Dutch pilsner with balanced bitterness" },
      ],
    },
    {
      title: "Crystal Clear Vodkas",
      icon: "🍸",
      items: [
        {
          name: "Magic Moments (Plain)",
          sizes: ["₹154", "₹271", "₹399", "₹749"],
          description: "Triple-distilled smoothness with clean finish"
        },
        { name: "Magic Moments Apple / Orange", sizes: ["₹164", "₹290", "₹429", "₹799"], description: "Fruit-infused with natural flavor essences" },
        { name: "Romanov Vodka (Plain / Apple)", sizes: ["₹139", "₹239", "₹339", "₹649"], description: "Classic Russian-style with subtle sweetness" },
        { name: "Smirnoff", sizes: ["₹213", "₹387", "₹579", "₹1,099"], description: "World-renowned purity, filtered ten times" },
      ],
    },
    {
      title: "Aged & Spiced Rums",
      icon: "🥃",
      items: [
        { name: "Old Monk", sizes: ["₹169", "₹289", "₹399", "₹749"], description: "Legendary 7-year aged dark rum with vanilla notes" },
        { name: "Bacardi White", sizes: ["₹183", "₹319", "₹469", "₹899"], description: "Light & crisp, perfect for cocktails" },
        { name: "Bacardi Black", sizes: ["₹199", "₹349", "₹499", "₹949"], description: "Rich molasses flavor with oak undertones" },
        { name: "Bacardi Lemon", sizes: ["₹209", "₹369", "₹529", "₹979"], description: "Zesty citrus twist on classic rum" },
        { name: "McDowell's Rum", sizes: ["₹144", "₹251", "₹369", "₹699"], description: "Smooth Caribbean-inspired blend" },
      ],
    },
    {
      title: "Indian Reserve Whiskies",
      icon: "🥃",
      items: [
        { name: "Imperial Blue", sizes: ["₹154", "₹271", "₹399", "₹749"], description: "Smooth blend with hints of oak & spice" },
        { name: "Royal Challenge", sizes: ["₹183", "₹319", "₹455", "₹899"], description: "Premium grain whisky with mellow character" },
        { name: "Royal Green", sizes: ["₹193", "₹339", "₹484", "₹929"], description: "Distinctively smooth with herbal notes" },
      ],
    },
    {
      title: "World Whisky Collection",
      icon: "🥃",
      items: [
        { name: "Ballantine's Finest (30 ml)", price: "₹387", description: "Scottish blend with honey & apple notes" },
        { name: "Black & White", price: "₹359", description: "Smoky Highland character with gentle peat" },
        { name: "Black Dog", price: "₹449", description: "Triple gold matured for exceptional smoothness" },
        { name: "Jameson Irish Whiskey", price: "₹449", description: "Triple-distilled with signature Irish smoothness" },
        { name: "Johnnie Walker Red Label", price: "₹429", description: "Bold & vibrant with cinnamon spice" },
      ],
    },
    {
      title: "Celebration Bottles (750 ml)",
      icon: "🍾",
      items: [
        { name: "Blender's Pride", price: "₹2,799", description: "Rare malt whisky for special occasions" },
        { name: "Antiquity Blue", price: "₹3,199", description: "Ultra-premium blend with distinguished character" },
        { name: "Royal Challenge", price: "₹2,699", description: "Full bottle of our refined grain whisky" },
        { name: "Royal Green", price: "₹3,199", description: "Complete bottle for sharing with friends" },
        { name: "Oak Smith Gold", price: "₹3,099", description: "Japanese-inspired craft with delicate oak finish" },
        { name: "Old Monk", price: "₹2,049", description: "Full bottle of the iconic dark rum" },
        { name: "Magic Moments (Plain / Apple)", price: "₹2,599", description: "Party-sized premium vodka" },
        { name: "Smirnoff", price: "₹3,399", description: "Celebration-ready international vodka" },
      ],
    },
  ],
};

export const sideItems: MenuSection = {
  title: "ARTISAN SIDES",
  categories: [
    {
      title: "Refresh & Rehydrate",
      icon: "💧",
      items: [
        { name: "Premium Packaged Water", price: "₹59", description: "Purified mineral water, ice-cold" },
        { name: "Fresh Lime Soda (Sweet/Salted)", price: "₹119", description: "Hand-squeezed lime with sparkling soda" },
        { name: "Iced Tea (Lemon/Peach)", price: "₹149", description: "Freshly brewed, served over crushed ice" },
      ],
    },
    {
      title: "Gourmet Bar Bites",
      icon: "🍿",
      items: [
        { name: "Veg Manchow Bowl", price: "₹219", description: "Hearty Indo-Chinese soup with crispy noodles" },
        { name: "Chicken Lollipop", price: "₹299", description: "Classic drumettes with spicy Schezwan glaze" },
        { name: "Crispy Corn Kernels", price: "₹199", description: "Flash-fried with garlic butter & herbs" },
      ],
    },
    {
      title: "Artisanal Rice & Grains",
      icon: "🍚",
      items: [
        { name: "Egg Dum Biryani", halfPrice: "₹179", fullPrice: "₹259", description: "Slow-cooked with boiled eggs & fragrant basmati" },
        { name: "Chicken Biryani", halfPrice: "₹249", fullPrice: "₹399", description: "Layered dum-style with saffron & caramelized onions" },
        { name: "Veg Pulao", price: "₹189", description: "Aromatic rice studded with seasonal vegetables" },
      ],
    },
  ],
};