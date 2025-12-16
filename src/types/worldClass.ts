// WORLD-CLASS FEATURES TYPES

// AR Menu Experience Types
export interface MenuItemArAsset {
    id: string;
    menu_item_id: string;
    asset_type: '3d_model' | 'video' | '360_photo' | 'animation';
    asset_url: string;
    thumbnail_url?: string;
    file_size_bytes?: number;
    format: string; // gltf, glb, mp4, jpg, etc.
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Customer Reviews & Ratings Types
export interface Customer {
    id: string;
    phone_number?: string;
    email?: string;
    name?: string;
    preferred_language: string;
    dietary_preferences: string[]; // vegetarian, vegan, gluten-free, etc.
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: string;
    customer_id: string;
    menu_item_id: string;
    rating: number; // 1-5
    review_text?: string;
    photo_urls: string[]; // Array of uploaded photo URLs
    is_verified: boolean;
    helpful_votes: number;
    created_at: string;
    updated_at: string;
    // Populated fields
    customer?: Customer;
    menu_item?: {
        id: string;
        name: string;
        image?: string;
    };
}

// Loyalty Program Types
export interface LoyaltyAccount {
    id: string;
    customer_id: string;
    total_points: number;
    current_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    points_to_next_tier: number;
    member_since: string;
    last_activity: string;
    is_active: boolean;
    // Populated fields
    customer?: Customer;
}

export interface LoyaltyTransaction {
    id: string;
    account_id: string;
    transaction_type: 'earn' | 'redeem' | 'bonus' | 'expiry';
    points: number;
    reason: string; // "Order placed", "Review submitted", "Birthday bonus", etc.
    order_reference?: string; // Link to order if applicable
    expires_at?: string;
    created_at: string;
}

export interface LoyaltyReward {
    id: string;
    title: string;
    description: string;
    points_required: number;
    reward_type: 'discount' | 'free_item' | 'vip_access' | 'custom';
    reward_value: string; // "10% off", "Free appetizer", etc.
    is_active: boolean;
    max_claims_per_customer?: number;
    valid_until?: string;
    created_at: string;
}

// Customer Preferences & Recommendations Types
export interface CustomerPreferences {
    id: string;
    customer_id: string;
    favorite_categories: string[];
    disliked_ingredients: string[];
    spice_tolerance: 'mild' | 'medium' | 'hot' | 'very_hot';
    budget_range: 'budget' | 'medium' | 'premium';
    created_at: string;
    updated_at: string;
}

export interface RecommendationInteraction {
    id: string;
    customer_id: string;
    menu_item_id: string;
    interaction_type: 'viewed' | 'ordered' | 'liked' | 'disliked' | 'shared';
    recommendation_source: string; // "loyalty_tier", "past_orders", "popular", "similar_taste"
    created_at: string;
}

// QR Code Sessions Types
export interface QrSession {
    id: string;
    session_token: string;
    customer_id?: string;
    device_info: {
        userAgent?: string;
        platform?: string;
        language?: string;
        screenSize?: string;
        location?: {
            latitude?: number;
            longitude?: number;
        };
    };
    purpose: 'menu_view' | 'ar_experience' | 'feedback' | 'loyalty_check';
    expires_at: string;
    created_at: string;
    // Populated fields
    customer?: Customer;
}

// Component Props Types
export interface ArExperienceProps {
    menuItemId: string;
    onClose: () => void;
}

export interface ReviewFormProps {
    menuItemId: string;
    customerPhone?: string;
    onSubmit: (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    onClose: () => void;
}

export interface LoyaltyDashboardProps {
    customerPhone: string;
    onClose: () => void;
}

export interface RecommendationsProps {
    customerId: string;
    limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// AR Experience Configuration
export interface ArConfig {
    enableWebXR: boolean;
    enableFallback: boolean;
    supportedFormats: string[];
    maxFileSize: number; // in bytes
}

// Feature Flags
export interface FeatureFlags {
    arExperience: boolean;
    customerReviews: boolean;
    loyaltyProgram: boolean;
    personalizedRecommendations: boolean;
    qrSessions: boolean;
}
