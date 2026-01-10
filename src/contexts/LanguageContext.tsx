import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'menux_language';

// Translations
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Menu UI
        'menu.title': 'Menu',
        'menu.search': 'Search menu...',
        'menu.categories': 'Categories',
        'menu.allItems': 'All Items',
        'menu.vegetarian': 'Vegetarian',
        'menu.nonVeg': 'Non-Vegetarian',
        'menu.vegan': 'Vegan',
        'menu.spicyLevel': 'Spice Level',
        'menu.calories': 'Calories',
        'menu.addToCart': 'Add to Cart',
        'menu.viewDetails': 'View Details',
        'menu.bestseller': 'Bestseller',
        'menu.new': 'New',
        'menu.chefSpecial': "Chef's Special",

        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.close': 'Close',
        'common.share': 'Share',
        'common.download': 'Download',

        // Food categories
        'category.starters': 'Starters',
        'category.mainCourse': 'Main Course',
        'category.desserts': 'Desserts',
        'category.beverages': 'Beverages',
        'category.breads': 'Breads',
        'category.rice': 'Rice',
        'category.snacks': 'Snacks',

        // Dietary
        'dietary.veg': 'Vegetarian',
        'dietary.nonVeg': 'Non-Vegetarian',
        'dietary.vegan': 'Vegan',
        'dietary.glutenFree': 'Gluten Free',
        'dietary.dairyFree': 'Dairy Free',

        // Spice levels
        'spice.mild': 'Mild',
        'spice.medium': 'Medium',
        'spice.hot': 'Hot',
        'spice.extraHot': 'Extra Hot',

        // Admin
        'admin.dashboard': 'Dashboard',
        'admin.editMenu': 'Edit Menu',
        'admin.settings': 'Settings',
        'admin.analytics': 'Analytics',
        'admin.logout': 'Logout',

        // Share
        'share.title': 'Share Menu',
        'share.whatsapp': 'Share on WhatsApp',
        'share.facebook': 'Share on Facebook',
        'share.twitter': 'Share on Twitter',
        'share.copyLink': 'Copy Link',
        'share.copied': 'Link copied!',
    },

    hi: {
        // Menu UI
        'menu.title': 'मेनू',
        'menu.search': 'मेनू खोजें...',
        'menu.categories': 'श्रेणियाँ',
        'menu.allItems': 'सभी आइटम',
        'menu.vegetarian': 'शाकाहारी',
        'menu.nonVeg': 'मांसाहारी',
        'menu.vegan': 'शुद्ध शाकाहारी',
        'menu.spicyLevel': 'मसाला स्तर',
        'menu.calories': 'कैलोरी',
        'menu.addToCart': 'कार्ट में जोड़ें',
        'menu.viewDetails': 'विवरण देखें',
        'menu.bestseller': 'बेस्टसेलर',
        'menu.new': 'नया',
        'menu.chefSpecial': 'शेफ स्पेशल',

        // Common
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'त्रुटि',
        'common.success': 'सफलता',
        'common.cancel': 'रद्द करें',
        'common.save': 'सहेजें',
        'common.delete': 'हटाएं',
        'common.edit': 'संपादित करें',
        'common.close': 'बंद करें',
        'common.share': 'शेयर करें',
        'common.download': 'डाउनलोड करें',

        // Food categories
        'category.starters': 'स्टार्टर्स',
        'category.mainCourse': 'मुख्य व्यंजन',
        'category.desserts': 'मिठाइयाँ',
        'category.beverages': 'पेय पदार्थ',
        'category.breads': 'रोटियाँ',
        'category.rice': 'चावल',
        'category.snacks': 'नाश्ता',

        // Dietary
        'dietary.veg': 'शाकाहारी',
        'dietary.nonVeg': 'मांसाहारी',
        'dietary.vegan': 'शुद्ध शाकाहारी',
        'dietary.glutenFree': 'ग्लूटेन मुक्त',
        'dietary.dairyFree': 'डेयरी मुक्त',

        // Spice levels
        'spice.mild': 'हल्का',
        'spice.medium': 'मध्यम',
        'spice.hot': 'तीखा',
        'spice.extraHot': 'बहुत तीखा',

        // Admin
        'admin.dashboard': 'डैशबोर्ड',
        'admin.editMenu': 'मेनू संपादित करें',
        'admin.settings': 'सेटिंग्स',
        'admin.analytics': 'विश्लेषण',
        'admin.logout': 'लॉगआउट',

        // Share
        'share.title': 'मेनू शेयर करें',
        'share.whatsapp': 'व्हाट्सएप पर शेयर करें',
        'share.facebook': 'फेसबुक पर शेयर करें',
        'share.twitter': 'ट्विटर पर शेयर करें',
        'share.copyLink': 'लिंक कॉपी करें',
        'share.copied': 'लिंक कॉपी हो गया!',
    },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    // Load saved language on mount
    useEffect(() => {
        const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(LANGUAGE_KEY, lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
