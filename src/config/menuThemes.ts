// Menu Theme System
// Allows venues to choose from different visual styles

export type MenuTheme =
    | 'cyberpunk-tech'      // Current LIVE style - neon, tech, premium
    | 'elegant-classic'     // Traditional fine dining - serif fonts, gold accents
    | 'modern-minimal'      // Clean, minimalist - lots of white space
    | 'rustic-organic'      // Warm, natural - earth tones, handwritten feel
    | 'vibrant-playful';    // Colorful, fun - bold colors, rounded corners

export interface ThemeConfig {
    id: MenuTheme;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        border: string;
    };
    fonts: {
        heading: string;
        body: string;
        accent: string;
    };
    borderStyle: 'tech' | 'classic' | 'minimal' | 'organic' | 'rounded';
    spacing: 'compact' | 'normal' | 'spacious';
}

export const menuThemes: Record<MenuTheme, ThemeConfig> = {
    'cyberpunk-tech': {
        id: 'cyberpunk-tech',
        name: 'Cyberpunk Tech',
        description: 'Futuristic neon aesthetic with premium tech vibes',
        colors: {
            primary: '#00f0ff',
            secondary: '#ff00ff',
            accent: '#ffd700',
            background: '#0a0a0f',
            text: '#ffffff',
            border: '#00f0ff40'
        },
        fonts: {
            heading: "'Orbitron', sans-serif",
            body: "'Rajdhani', sans-serif",
            accent: "'Cinzel', serif"
        },
        borderStyle: 'tech',
        spacing: 'normal'
    },

    'elegant-classic': {
        id: 'elegant-classic',
        name: 'Elegant Classic',
        description: 'Timeless sophistication with traditional fine dining aesthetics',
        colors: {
            primary: '#d4af37',
            secondary: '#8b7355',
            accent: '#c9a961',
            background: '#faf8f3',
            text: '#2c2416',
            border: '#d4af3760'
        },
        fonts: {
            heading: "'Playfair Display', serif",
            body: "'Lora', serif",
            accent: "'Cormorant Garamond', serif"
        },
        borderStyle: 'classic',
        spacing: 'spacious'
    },

    'modern-minimal': {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Clean and contemporary with focus on content',
        colors: {
            primary: '#000000',
            secondary: '#666666',
            accent: '#ff6b35',
            background: '#ffffff',
            text: '#1a1a1a',
            border: '#e5e5e5'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif",
            accent: "'Space Grotesk', sans-serif"
        },
        borderStyle: 'minimal',
        spacing: 'spacious'
    },

    'rustic-organic': {
        id: 'rustic-organic',
        name: 'Rustic Organic',
        description: 'Warm and natural with handcrafted charm',
        colors: {
            primary: '#8b4513',
            secondary: '#d2691e',
            accent: '#228b22',
            background: '#f5f1e8',
            text: '#3e2723',
            border: '#8b451360'
        },
        fonts: {
            heading: "'Merriweather', serif",
            body: "'Open Sans', sans-serif",
            accent: "'Caveat', cursive"
        },
        borderStyle: 'organic',
        spacing: 'normal'
    },

    'vibrant-playful': {
        id: 'vibrant-playful',
        name: 'Vibrant Playful',
        description: 'Bold and energetic with fun, modern vibes',
        colors: {
            primary: '#ff6b9d',
            secondary: '#4ecdc4',
            accent: '#ffe66d',
            background: '#f7f7f7',
            text: '#2d3436',
            border: '#ff6b9d60'
        },
        fonts: {
            heading: "'Poppins', sans-serif",
            body: "'Nunito', sans-serif",
            accent: "'Fredoka One', cursive"
        },
        borderStyle: 'rounded',
        spacing: 'compact'
    }
};

export const getThemeForVenue = (venueSlug?: string, customTheme?: MenuTheme): ThemeConfig => {
    // Default theme based on venue
    if (customTheme) {
        return menuThemes[customTheme];
    }

    // LIVE uses cyberpunk-tech by default
    if (!venueSlug || venueSlug === 'live') {
        return menuThemes['cyberpunk-tech'];
    }

    // Other venues default to elegant-classic
    return menuThemes['elegant-classic'];
};
