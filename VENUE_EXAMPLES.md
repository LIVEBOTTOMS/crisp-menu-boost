# 🎯 Example Venue Configurations

This file contains ready-to-use configuration examples for different types of venues. Simply copy and paste into `src/config/venueConfig.ts`.

---

## 1. Fine Dining Restaurant

```typescript
export const venueConfig: VenueConfig = {
  name: "THE GARDEN",
  tagline: "Farm to Fork Excellence",
  subtitle: "FINE DINING • MUMBAI",
  establishedYear: "2020",
  
  logoText: "GARDEN",
  logoSubtext: "Fresh • Organic • Exquisite",
  
  city: "Mumbai",
  address: "Bandra West, Mumbai, Maharashtra 400050",
  googleMapsUrl: "https://maps.google.com/?q=Bandra+West+Mumbai",
  
  phone: "+91 22 2345 6789",
  email: "reservations@thegarden.com",
  website: "https://thegarden.com",
  
  instagram: "https://instagram.com/thegardenrestaurant",
  facebook: "https://facebook.com/thegardenrestaurant",
  
  qrCodeLabel: "Scan to Reserve",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: true,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: true,
  },
  
  copyrightText: "© 2020 THE GARDEN • Fine Dining & Farm Fresh Ingredients",
};
```

---

## 2. Sports Bar

```typescript
export const venueConfig: VenueConfig = {
  name: "CHAMPIONS SPORTS BAR",
  tagline: "Where Legends Are Made",
  subtitle: "SPORTS BAR • BANGALORE",
  establishedYear: "2022",
  
  logoText: "CHAMPIONS",
  logoSubtext: "Sports • Drinks • Entertainment",
  
  city: "Bangalore",
  address: "Koramangala, Bangalore, Karnataka 560034",
  googleMapsUrl: "https://maps.google.com/?q=Koramangala+Bangalore",
  
  phone: "+91 80 4567 8901",
  email: "info@championsbar.com",
  website: "https://championsbar.com",
  
  instagram: "https://instagram.com/championsbar",
  
  qrCodeLabel: "Scan for Today's Matches",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: false,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: false,
  },
  
  copyrightText: "© 2022 CHAMPIONS SPORTS BAR • Where Every Game Matters",
};
```

---

## 3. Hotel Restaurant

```typescript
export const venueConfig: VenueConfig = {
  name: "THE PALACE CAFE",
  tagline: "Luxury Dining Experience",
  subtitle: "HOTEL RESTAURANT • DELHI",
  establishedYear: "2015",
  
  logoText: "PALACE",
  logoSubtext: "Elegance • Comfort • Cuisine",
  
  city: "Delhi",
  address: "Hotel Grand Palace, Connaught Place, New Delhi 110001",
  googleMapsUrl: "https://maps.google.com/?q=Connaught+Place+Delhi",
  
  phone: "+91 11 2345 6789",
  email: "dining@palacehotel.com",
  website: "https://palacehotel.com/dining",
  
  instagram: "https://instagram.com/palacehotel",
  facebook: "https://facebook.com/palacehotel",
  twitter: "https://twitter.com/palacehotel",
  
  qrCodeLabel: "Scan for Room Service",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: true,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: true,
  },
  
  copyrightText: "© 2015 THE PALACE CAFE • A Grand Palace Hotels Property",
};
```

---

## 4. Cafe / Coffee Shop

```typescript
export const venueConfig: VenueConfig = {
  name: "BREW HAVEN",
  tagline: "Coffee, Code & Conversations",
  subtitle: "SPECIALTY CAFE • HYDERABAD",
  establishedYear: "2023",
  
  logoText: "BREW",
  logoSubtext: "Coffee • Pastries • WiFi",
  
  city: "Hyderabad",
  address: "Hitech City, Hyderabad, Telangana 500081",
  googleMapsUrl: "https://maps.google.com/?q=Hitech+City+Hyderabad",
  
  phone: "+91 40 1234 5678",
  email: "hello@brewhaven.com",
  website: "https://brewhaven.com",
  
  instagram: "https://instagram.com/brewhaven",
  
  qrCodeLabel: "Scan for WiFi Password",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: false,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: false,
  },
  
  copyrightText: "© 2023 BREW HAVEN • Premium Coffee Experience",
};
```

---

## 5. Rooftop Bar

```typescript
export const venueConfig: VenueConfig = {
  name: "SKY LOUNGE",
  tagline: "Above It All",
  subtitle: "ROOFTOP BAR • GOA",
  establishedYear: "2021",
  
  logoText: "SKY",
  logoSubtext: "Drinks • Views • Vibes",
  
  city: "Goa",
  address: "Candolim Beach, Goa 403515",
  googleMapsUrl: "https://maps.google.com/?q=Candolim+Beach+Goa",
  
  phone: "+91 832 123 4567",
  email: "reservations@skylounge.com",
  website: "https://skylounge.com",
  
  instagram: "https://instagram.com/skyloun gegoa",
  facebook: "https://facebook.com/skyloungegoa",
  
  qrCodeLabel: "Scan for Cocktail Menu",
  
  features: {
    enableOnlineOrdering: false,
    enableReservations: true,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: true,
  },
  
  copyrightText: "© 2021 SKY LOUNGE • Sunset Views & Craft Cocktails",
};
```

---

## 6. Quick Service Restaurant (QSR)

```typescript
export const venueConfig: VenueConfig = {
  name: "FAST FEAST",
  tagline: "Quick Bites, Big Flavor",
  subtitle: "QUICK SERVICE • CHENNAI",
  establishedYear: "2024",
  
  logoText: "FEAST",
  logoSubtext: "Fast • Fresh • Delicious",
  
  city: "Chennai",
  address: "T Nagar, Chennai, Tamil Nadu 600017",
  googleMapsUrl: "https://maps.google.com/?q=T+Nagar+Chennai",
  
  phone: "+91 44 2345 6789",
  email: "orders@fastfeast.com",
  website: "https://fastfeast.com",
  
  instagram: "https://instagram.com/fastfeast",
  
  qrCodeLabel: "Scan to Order",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: false,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: false,
  },
  
  copyrightText: "© 2024 FAST FEAST • Your Neighborhood Quick Bites",
};
```

---

## 7. Bistro / Gastropub

```typescript
export const venueConfig: VenueConfig = {
  name: "THE CRAFTED TABLE",
  tagline: "Artisan Food & Craft Beers",
  subtitle: "GASTROPUB • KOLKATA",
  establishedYear: "2019",
  
  logoText: "CRAFTED",
  logoSubtext: "Food • Beer • Community",
  
  city: "Kolkata",
  address: "Park Street, Kolkata, West Bengal 700016",
  googleMapsUrl: "https://maps.google.com/?q=Park+Street+Kolkata",
  
  phone: "+91 33 2345 6789",
  email: "hello@craftedtable.com",
  website: "https://craftedtable.com",
  
  instagram: "https://instagram.com/craftedtable",
  facebook: "https://facebook.com/craftedtable",
  
  qrCodeLabel: "Scan for Today's Specials",
  
  features: {
    enableOnlineOrdering: true,
    enableReservations: true,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: false,
  },
  
  copyrightText: "© 2019 THE CRAFTED TABLE • Where Craft Beer Meets Artisan Food",
};
```

---

## 8. Beach Shack / Casual Dining

```typescript
export const venueConfig: VenueConfig = {
  name: "WAVE RIDER SHACK",
  tagline: "Toes in the Sand, Drink in Hand",
  subtitle: "BEACH SHACK • VARKALA",
  establishedYear: "2023",
  
  logoText: "WAVE",
  logoSubtext: "Beach • Food • Chill",
  
  city: "Varkala",
  address: "Varkala Beach, Kerala 695141",
  googleMapsUrl: "https://maps.google.com/?q=Varkala+Beach+Kerala",
  
  phone: "+91 470 123 4567",
  email: "info@waveridershack.com",
  
  instagram: "https://instagram.com/waveridershack",
  
  qrCodeLabel: "Scan for Beach Vibes",
  
  features: {
    enableOnlineOrdering: false,
    enableReservations: false,
    enableLoyaltyProgram: false,
    enableReviews: true,
    enableARExperience: false,
  },
  
  copyrightText: "© 2023 WAVE RIDER SHACK • Life's a Beach",
};
```

---

## How to Use

1. **Choose a template** that matches your venue type
2. **Copy the entire config block**
3. **Paste into** `src/config/venueConfig.ts`
4. **Customize** the values to match your actual venue
5. **Save** and run `npm run dev`

---

## Customization Tips

### For Each Venue Type:

**Fine Dining:**
- Use elegant, sophisticated language
- Enable all features for premium experience
- Professional imagery required

**Sports Bar:**
- Bold, energetic taglines
- Disable reservations (walk-ins encouraged)
- Focus on live events

**Hotel Restaurant:**
- Emphasize luxury and comfort
- Enable full feature set
- Include hotel branding

**Cafe:**
- Friendly, casual tone
- Highlight WiFi and ambiance
- Community-focused

**Rooftop/Beach:**
- Emphasize atmosphere and views
- Seasonal/sunset hours important
- Photo-worthy experiences

---

## Need Custom Colors?

Add theme config to your venue:

```typescript
theme: {
  primaryColor: "#00f0ff",    // Cyan - Modern tech vibe
  secondaryColor: "#ff00ff",  // Magenta - Creative energy
  accentColor: "#ffd700",     // Gold - Premium touch
},
```

**Color Suggestions by Venue:**
- **Fine Dining**: Gold, Deep Purple, Burgundy
- **Sports Bar**: Bold Red, Electric Blue, Neon Green
- **Cafe**: Warm Brown, Cream, Soft Orange
- **Beach**: Turquoise, Coral, Sandy Beige

---

**Ready to deploy?** Pick your template and launch in 5 minutes! 🚀
