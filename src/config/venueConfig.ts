/**
 * Venue Configuration
 * 
 * This is the SINGLE SOURCE OF TRUTH for all venue-specific information.
 * Update this file when deploying for a new restaurant/bar/hotel.
 */

export interface VenueConfig {
    // Basic Information
    name: string;
    tagline: string;
    subtitle: string;
    establishedYear: string;

    // Branding
    logoText: string;
    logoSubtext: string;

    // Location
    city: string;
    address: string;
    googleMapsUrl?: string;

    // Contact
    phone?: string;
    email?: string;
    website?: string;

    // Social Media
    instagram?: string;
    facebook?: string;
    twitter?: string;

    // QR Code
    qrCodeUrl?: string; // Path to QR code image (location/menu/payment)
    qrCodeLabel?: string;

    // Theme Colors (optional - uses defaults if not specified)
    theme?: {
        primaryColor?: string; // e.g., '#00f0ff' for cyan
        secondaryColor?: string; // e.g., '#ff00ff' for magenta
        accentColor?: string; // e.g., '#ffd700' for gold
    };

    // Features
    features?: {
        enableOnlineOrdering?: boolean;
        enableReservations?: boolean;
        enableLoyaltyProgram?: boolean;
        enableReviews?: boolean;
        enableARExperience?: boolean;
    };

    // Footer Copyright
    copyrightText?: string;
}

/**
 * ⚠️ EDIT THIS SECTION FOR YOUR VENUE ⚠️
 * 
 * Replace the values below with your restaurant/bar/hotel information
 */
export const venueConfig: VenueConfig = {
    // Basic Information
    name: "LIVE BAR",
    tagline: "Eat.Drink.Code.Repeat",
    subtitle: "FINE DINING • PUNE",
    establishedYear: "2024",

    // Branding
    logoText: "LIVE",
    logoSubtext: "Eat • Drink • Code • Repeat",

    // Location
    city: "Pune",
    address: "Wakad, Pune, Maharashtra 411057",
    googleMapsUrl: "https://maps.google.com/?q=Wakad+Pune",

    // Contact (optional)
    phone: "+91 1234567890",
    email: "hello@livebar.com",
    website: "https://livebar.com",

    // Social Media (optional)
    instagram: "https://instagram.com/livebar",
    facebook: "https://facebook.com/livebar",

    // QR Code
    qrCodeLabel: "Scan for Location",

    // Features (set to false to disable)
    features: {
        enableOnlineOrdering: false,
        enableReservations: false,
        enableLoyaltyProgram: true,
        enableReviews: true,
        enableARExperience: true,
    },

    // Footer
    copyrightText: "© 2024 LIVE BAR • Fine Dining & Premium Spirits",
};

/**
 * VENUE CONFIGURATION EXAMPLES
 * 
 * Copy and modify one of these templates for different types of venues:
 */

// Example 1: Fine Dining Restaurant
export const fineDiningExample: VenueConfig = {
    name: "THE GARDEN",
    tagline: "Farm to Fork Excellence",
    subtitle: "FINE DINING • MUMBAI",
    establishedYear: "2020",
    logoText: "GARDEN",
    logoSubtext: "Fresh • Organic • Exquisite",
    city: "Mumbai",
    address: "Bandra West, Mumbai",
    qrCodeLabel: "Scan to Reserve",
    features: {
        enableOnlineOrdering: true,
        enableReservations: true,
        enableLoyaltyProgram: true,
    },
};

// Example 2: Sports Bar
export const sportsBarExample: VenueConfig = {
    name: "CHAMPIONS SPORTS BAR",
    tagline: "Where Legends Are Made",
    subtitle: "SPORTS BAR • BANGALORE",
    establishedYear: "2022",
    logoText: "CHAMPIONS",
    logoSubtext: "Sports • Drinks • Entertainment",
    city: "Bangalore",
    address: "Koramangala, Bangalore",
    qrCodeLabel: "Scan for Today's Matches",
    features: {
        enableOnlineOrdering: true,
        enableReservations: false,
        enableLoyaltyProgram: true,
    },
};

// Example 3: Hotel Restaurant
export const hotelRestaurantExample: VenueConfig = {
    name: "THE PALACE CAFE",
    tagline: "Luxury Dining Experience",
    subtitle: "HOTEL RESTAURANT • DELHI",
    establishedYear: "2015",
    logoText: "PALACE",
    logoSubtext: "Elegance • Comfort • Cuisine",
    city: "Delhi",
    address: "Connaught Place, New Delhi",
    qrCodeLabel: "Scan for Room Service",
    features: {
        enableOnlineOrdering: true,
        enableReservations: true,
        enableLoyaltyProgram: true,
    },
};

// Example 4: Cafe/Coffee Shop
export const cafeExample: VenueConfig = {
    name: "BREW HAVEN",
    tagline: "Coffee, Code & Conversations",
    subtitle: "SPECIALTY CAFE • HYDERABAD",
    establishedYear: "2023",
    logoText: "BREW",
    logoSubtext: "Coffee • Pastries • WiFi",
    city: "Hyderabad",
    address: "Hitech City, Hyderabad",
    qrCodeLabel: "Scan for WiFi",
    features: {
        enableOnlineOrdering: true,
        enableReservations: false,
        enableLoyaltyProgram: true,
    },
};

/**
 * Helper function to get venue config
 */
export const getVenueConfig = (): VenueConfig => venueConfig;
