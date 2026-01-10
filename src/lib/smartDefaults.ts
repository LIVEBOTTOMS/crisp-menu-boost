// Smart defaults based on location and industry detection

export interface LocationData {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    currency?: string;
    language?: string;
}

export interface IndustryTemplate {
    name: string;
    category: string;
    suggestedCategories: string[];
    sampleItems: Array<{
        name: string;
        category: string;
        price?: number;
        description?: string;
    }>;
    theme: string;
    venueName: string;
}

// Detect user's location using IP geolocation API
export const detectLocation = async (): Promise<LocationData> => {
    try {
        // Using ipapi.co for free IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        return {
            country: data.country_name,
            city: data.city,
            region: data.region,
            timezone: data.timezone,
            currency: data.currency,
            language: data.languages?.split(',')[0] || 'en',
        };
    } catch (error) {
        console.error('Failed to detect location:', error);
        // Return defaults
        return {
            country: 'India',
            currency: 'INR',
            language: 'en',
            timezone: 'Asia/Kolkata',
        };
    }
};

// Get currency symbol from code
export const getCurrencySymbol = (code?: string): string => {
    const symbols: Record<string, string> = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'AUD': 'A$',
        'CAD': 'C$',
        'AED': 'د.إ',
        'SAR': '﷼',
    };
    return symbols[code || 'INR'] || code || '₹';
};

// Industry templates with smart defaults
export const industryTemplates: Record<string, IndustryTemplate> = {
    'fine-dining': {
        name: 'Fine Dining Restaurant',
        category: 'restaurant',
        suggestedCategories: ['Appetizers', 'Soups', 'Mains', 'Desserts', 'Beverages', 'Wine'],
        sampleItems: [
            {
                name: 'Truffle Risotto',
                category: 'Mains',
                price: 850,
                description: 'Creamy arborio rice with black truffle and parmesan',
            },
            {
                name: 'Grilled Salmon',
                category: 'Mains',
                price: 1200,
                description: 'Atlantic salmon with lemon butter sauce',
            },
            {
                name: 'Caesar Salad',
                category: 'Appetizers',
                price: 450,
                description: 'Romaine lettuce, croutons, parmesan, classic dressing',
            },
            {
                name: 'Tiramisu',
                category: 'Desserts',
                price: 380,
                description: 'Classic Italian coffee-flavored dessert',
            },
        ],
        theme: 'elegant-classic',
        venueName: 'Fine Dining Restaurant',
    },

    'cafe': {
        name: 'Café',
        category: 'cafe',
        suggestedCategories: ['Coffee', 'Tea', 'Snacks', 'Pastries', 'Sandwiches'],
        sampleItems: [
            {
                name: 'Cappuccino',
                category: 'Coffee',
                price: 120,
                description: 'Espresso with steamed milk and foam',
            },
            {
                name: 'Croissant',
                category: 'Pastries',
                price: 80,
                description: 'Buttery, flaky French pastry',
            },
            {
                name: 'Club Sandwich',
                category: 'Sandwiches',
                price: 250,
                description: 'Triple-decker with chicken, bacon, lettuce, tomato',
            },
            {
                name: 'Cheesecake',
                category: 'Pastries',
                price: 180,
                description: 'New York style cheesecake with berry compote',
            },
        ],
        theme: 'minimal-modern',
        venueName: 'The Coffee House',
    },

    'bar': {
        name: 'Bar & Lounge',
        category: 'bar',
        suggestedCategories: ['Cocktails', 'Beer', 'Wine', 'Spirits', 'Snacks'],
        sampleItems: [
            {
                name: 'Old Fashioned',
                category: 'Cocktails',
                price: 450,
                description: 'Bourbon, bitters, sugar, orange twist',
            },
            {
                name: 'Craft Beer',
                category: 'Beer',
                price: 300,
                description: 'Local craft brewery selection',
            },
            {
                name: 'Nachos Supreme',
                category: 'Snacks',
                price: 380,
                description: 'Loaded nachos with cheese, jalapeños, salsa',
            },
            {
                name: 'Buffalo Wings',
                category: 'Snacks',
                price: 420,
                description: 'Spicy chicken wings with blue cheese dip',
            },
        ],
        theme: 'cyberpunk-tech',
        venueName: 'The Lounge',
    },

    'fast-food': {
        name: 'Fast Food',
        category: 'fast-food',
        suggestedCategories: ['Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'],
        sampleItems: [
            {
                name: 'Classic Burger',
                category: 'Burgers',
                price: 180,
                description: 'Beef patty, cheese, lettuce, tomato, special sauce',
            },
            {
                name: 'Margherita Pizza',
                category: 'Pizza',
                price: 350,
                description: 'Fresh mozzarella, tomato sauce, basil',
            },
            {
                name: 'French Fries',
                category: 'Sides',
                price: 80,
                description: 'Crispy golden fries with ketchup',
            },
            {
                name: 'Soft Drink',
                category: 'Drinks',
                price: 50,
                description: 'Choice of cola, lemon, or orange',
            },
        ],
        theme: 'vibrant-playful',
        venueName: 'Quick Bites',
    },

    'indian': {
        name: 'Indian Restaurant',
        category: 'restaurant',
        suggestedCategories: ['Starters', 'Curries', 'Breads', 'Rice', 'Desserts', 'Beverages'],
        sampleItems: [
            {
                name: 'Paneer Tikka',
                category: 'Starters',
                price: 280,
                description: 'Grilled cottage cheese with spices',
            },
            {
                name: 'Butter Chicken',
                category: 'Curries',
                price: 350,
                description: 'Creamy tomato-based chicken curry',
            },
            {
                name: 'Garlic Naan',
                category: 'Breads',
                price: 60,
                description: 'Tandoor-baked flatbread with garlic',
            },
            {
                name: 'Biryani',
                category: 'Rice',
                price: 320,
                description: 'Fragrant basmati rice with spices and meat',
            },
            {
                name: 'Gulab Jamun',
                category: 'Desserts',
                price: 80,
                description: 'Sweet dumplings in sugar syrup',
            },
        ],
        theme: 'vibrant-playful',
        venueName: 'Spice Garden',
    },
};

// Detect industry/category based on user input
export const suggestIndustry = (venueName: string): IndustryTemplate => {
    const name = venueName.toLowerCase();

    if (name.includes('cafe') || name.includes('coffee') || name.includes('brew')) {
        return industryTemplates['cafe'];
    }

    if (name.includes('bar') || name.includes('pub') || name.includes('lounge')) {
        return industryTemplates['bar'];
    }

    if (name.includes('fast') || name.includes('quick') || name.includes('burger') || name.includes('pizza')) {
        return industryTemplates['fast-food'];
    }

    if (name.includes('indian') || name.includes('spice') || name.includes('curry')) {
        return industryTemplates['indian'];
    }

    if (name.includes('fine') || name.includes('gourmet') || name.includes('bistro')) {
        return industryTemplates['fine-dining'];
    }

    // Default to cafe for general venues
    return industryTemplates['cafe'];
};

// Generate venue slug from name
export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
};

// Get time-based greeting
export const getGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Welcome';
};

// Progressive onboarding steps
export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    optional: boolean;
    completed: boolean;
}

export const getOnboardingSteps = (): OnboardingStep[] => [
    {
        id: 'venue-name',
        title: 'Name your venue',
        description: 'What should we call your restaurant?',
        optional: false,
        completed: false,
    },
    {
        id: 'industry',
        title: 'Choose your category',
        description: 'Help us suggest the right menu structure',
        optional: false,
        completed: false,
    },
    {
        id: 'location',
        title: 'Add location',
        description: 'Where is your venue located?',
        optional: true,
        completed: false,
    },
    {
        id: 'theme',
        title: 'Pick a theme',
        description: 'Choose a visual style for your menu',
        optional: true,
        completed: false,
    },
    {
        id: 'menu-items',
        title: 'Add menu items',
        description: 'Start with a few items or use our suggestions',
        optional: false,
        completed: false,
    },
    {
        id: 'publish',
        title: 'Publish your menu',
        description: 'Make your menu live and get your QR code',
        optional: false,
        completed: false,
    },
];
