export const getSmartTranslatedTitle = (title: string, t: (key: string) => string): string => {
    if (!title) return title;

    // Normalize: remove special chars, lowercase
    const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '');

    const map: Record<string, string> = {
        // Standard Categories
        'starters': 'category.starters',
        'appetizers': 'category.starters',
        'smallplates': 'category.starters',

        'maincourse': 'category.mainCourse',
        'mains': 'category.mainCourse',
        'entrees': 'category.mainCourse',

        'desserts': 'category.desserts',
        'sweets': 'category.desserts',

        'beverages': 'category.beverages',
        'drinks': 'category.beverages',

        // Indian Specific
        'breads': 'category.breads',
        'roti': 'category.breads',
        'naan': 'category.breads',
        'rice': 'category.rice',
        'biryani': 'category.rice',
        'curries': 'category.curries',
        'curry': 'category.curries',
        'sabzi': 'category.curries',

        // Fast Food / Cafe
        'snacks': 'category.snacks',
        'burgers': 'category.burgers',
        'pizza': 'category.pizza',
        'pasta': 'category.pasta',
        'soups': 'category.soups',
        'salad': 'category.starters', // Fallback? Or add Salad?
        'salads': 'category.starters',
        'sides': 'category.sides',

        // Drinks specific
        'coffee': 'category.coffee',
        'tea': 'category.tea',
        'chai': 'category.tea',
        'cocktails': 'category.cocktails',
        'wine': 'category.wine',
        'beer': 'category.beer',

        // Generic
        'food': 'category.food',
    };

    // Try exact match first
    let key = map[normalized];

    // If no match, try partials for common suffixes
    if (!key) {
        if (normalized.includes('curry') || normalized.includes('masala')) key = 'category.curries';
        else if (normalized.includes('bread') || normalized.includes('nan') || normalized.includes('kulcha')) key = 'category.breads';
        else if (normalized.includes('rice') || normalized.includes('pulao')) key = 'category.rice';
        else if (normalized.includes('drink') || normalized.includes('beverage')) key = 'category.beverages';
    }

    return key ? t(key) : title;
};
