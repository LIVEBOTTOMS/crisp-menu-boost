// Enhanced menu item types with new features

export type SpiceLevel = 'none' | 'mild' | 'medium' | 'hot' | 'extra-hot';
export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'gluten-free' | 'dairy-free';

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category: string;
    section: string;
    available: boolean;

    // NEW: Dietary & Spice
    dietary?: DietaryType;
    spice_level?: SpiceLevel;

    // NEW: Nutritional Info
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;

    // NEW: Discount & Badges
    discount_percent?: number;
    original_price?: number;
    badge?: 'new' | 'bestseller' | 'chef-special' | 'limited';

    // Existing
    created_at?: string;
    updated_at?: string;
    venue_id?: string;
}

// Spice level configuration
export const spiceLevels: Record<SpiceLevel, { label: string; emoji: string; color: string }> = {
    'none': { label: 'No Spice', emoji: '', color: 'text-gray-400' },
    'mild': { label: 'Mild', emoji: '🌶️', color: 'text-green-500' },
    'medium': { label: 'Medium', emoji: '🌶️🌶️', color: 'text-yellow-500' },
    'hot': { label: 'Hot', emoji: '🌶️🌶️🌶️', color: 'text-orange-500' },
    'extra-hot': { label: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️', color: 'text-red-500' },
};

// Dietary type configuration
export const dietaryTypes: Record<DietaryType, { label: string; icon: string; color: string }> = {
    'veg': { label: 'Vegetarian', icon: '🥬', color: 'text-green-600' },
    'non-veg': { label: 'Non-Vegetarian', icon: '🍗', color: 'text-red-600' },
    'vegan': { label: 'Vegan', icon: '🌱', color: 'text-emerald-600' },
    'gluten-free': { label: 'Gluten Free', icon: '🌾', color: 'text-amber-600' },
    'dairy-free': { label: 'Dairy Free', icon: '🥛', color: 'text-blue-600' },
};

// Badge configuration
export const badges: Record<string, { label: string; color: string; bgColor: string }> = {
    'new': { label: 'New', color: 'text-white', bgColor: 'bg-blue-500' },
    'bestseller': { label: 'Bestseller', color: 'text-white', bgColor: 'bg-amber-500' },
    'chef-special': { label: "Chef's Special", color: 'text-white', bgColor: 'bg-purple-500' },
    'limited': { label: 'Limited Time', color: 'text-white', bgColor: 'bg-red-500' },
};

// Helper function to calculate discount
export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
    return originalPrice - (originalPrice * discountPercent / 100);
};

// Helper function to format calori display
export const formatCaloriesDisplay = (calories?: number): string => {
    if (!calories) return '';
    return `${calories} cal`;
};

// Helper function to get spice level display
export const getSpiceLevelDisplay = (level?: SpiceLevel): string => {
    if (!level || level === 'none') return '';
    return spiceLevels[level].emoji;
};
