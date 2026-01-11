import { MenuItem } from "@/data/menuData";
import { MenuFilters } from "@/components/MenuSearchFilter";

export const filterMenuItems = (items: MenuItem[], filters: MenuFilters): MenuItem[] => {
    return items.filter(item => {
        // Search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const matchesName = item.name.toLowerCase().includes(query);
            const matchesDescription = item.description?.toLowerCase().includes(query);
            if (!matchesName && !matchesDescription) return false;
        }

        // Dietary filter
        if (filters.dietary.length > 0) {
            if (!item.dietary || !filters.dietary.includes(item.dietary)) {
                return false;
            }
        }

        // Spice level filter
        if (filters.spiceLevel.length > 0) {
            if (!item.spice_level || !filters.spiceLevel.includes(item.spice_level)) {
                return false;
            }
        }

        // Price range filter
        if (filters.priceRange) {
            const itemPrice = extractPrice(item);
            if (itemPrice === null) return false;
            if (itemPrice < filters.priceRange.min || itemPrice > filters.priceRange.max) {
                return false;
            }
        }

        // Badges filter
        if (filters.badges.length > 0) {
            const hasMatchingBadge = filters.badges.some(badge => {
                if (badge === 'bestseller' && item.isBestSeller) return true;
                if (badge === 'chef-special' && item.isChefSpecial) return true;
                if (badge === 'new' && item.isNew) return true;
                if (badge === 'premium' && item.isPremium) return true;
                if (item.badge === badge) return true;
                return false;
            });
            if (!hasMatchingBadge) return false;
        }

        return true;
    });
};

// Helper function to extract numeric price from item
const extractPrice = (item: MenuItem): number | null => {
    let priceStr: string | undefined;

    if (item.price) {
        priceStr = item.price;
    } else if (item.fullPrice) {
        priceStr = item.fullPrice;
    } else if (item.sizes && item.sizes.length > 0) {
        // For items with sizes, use the first size price
        priceStr = item.sizes[0];
    }

    if (!priceStr) return null;

    // Extract number from string like "₹500" or "500"
    const match = priceStr.match(/[\d,]+/);
    if (!match) return null;

    return parseFloat(match[0].replace(/,/g, ''));
};
