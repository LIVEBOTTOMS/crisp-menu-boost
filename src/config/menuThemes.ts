// Enhanced Menu Theme System with Premium Aesthetics
// All themes designed for maximum visual impact and readability

export type MenuTheme =
    | 'cyberpunk-tech'      // Neon futuristic - current default
    | 'dark-luxury'         // Premium dark with gold accents
    | 'midnight-blue'       // Deep blue with silver highlights
    | 'forest-premium'      // Dark green with copper accents
    | 'royal-purple'        // Deep purple with gold
    | 'crimson-elite'       // Dark red with champagne gold
    | 'slate-modern';       // Sophisticated gray with teal

export interface ThemeConfig {
    id: MenuTheme;
    name: string;
    description: string;
    colors: {
        primary: string;        // Main accent color
        secondary: string;      // Secondary accent
        accent: string;         // Highlight color
        background: string;     // Main background
        cardBg: string;         // Card/section background
        text: string;           // Primary text
        textMuted: string;      // Secondary text
        border: string;         // Border color
    };
    fonts: {
        heading: string;
        body: string;
        accent: string;
    };
    borderStyle: 'tech' | 'elegant' | 'modern' | 'organic' | 'rounded';
    spacing: 'compact' | 'normal' | 'spacious';
    effects: {
        glow: boolean;          // Neon glow effects
        gradient: boolean;      // Gradient backgrounds
        shadow: 'soft' | 'hard' | 'none';
    };
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
            cardBg: '#1a1a2e',
            text: '#ffffff',
            textMuted: '#a0a0b0',
            border: '#00f0ff40'
        },
        fonts: {
            heading: "'Orbitron', sans-serif",
            body: "'Rajdhani', sans-serif",
            accent: "'Cinzel', serif"
        },
        borderStyle: 'tech',
        spacing: 'normal',
        effects: {
            glow: true,
            gradient: true,
            shadow: 'hard'
        }
    },

    'dark-luxury': {
        id: 'dark-luxury',
        name: 'Dark Luxury',
        description: 'Premium dark theme with sophisticated gold accents',
        colors: {
            primary: '#d4af37',      // Gold
            secondary: '#c9a961',    // Light gold
            accent: '#ffd700',       // Bright gold
            background: '#0d0d0d',   // Almost black
            cardBg: '#1a1a1a',       // Dark gray
            text: '#f5f5f5',         // Off-white
            textMuted: '#a8a8a8',    // Gray
            border: '#d4af3740'
        },
        fonts: {
            heading: "'Playfair Display', serif",
            body: "'Lora', serif",
            accent: "'Cormorant Garamond', serif"
        },
        borderStyle: 'elegant',
        spacing: 'spacious',
        effects: {
            glow: false,
            gradient: true,
            shadow: 'soft'
        }
    },

    'midnight-blue': {
        id: 'midnight-blue',
        name: 'Midnight Blue',
        description: 'Deep ocean blue with silver and cyan highlights',
        colors: {
            primary: '#4fc3f7',      // Cyan blue
            secondary: '#29b6f6',    // Light blue
            accent: '#e0e0e0',       // Silver
            background: '#0a1929',   // Deep blue-black
            cardBg: '#132f4c',       // Dark blue
            text: '#ffffff',
            textMuted: '#b0bec5',
            border: '#4fc3f740'
        },
        fonts: {
            heading: "'Montserrat', sans-serif",
            body: "'Roboto', sans-serif",
            accent: "'Raleway', sans-serif"
        },
        borderStyle: 'modern',
        spacing: 'normal',
        effects: {
            glow: true,
            gradient: true,
            shadow: 'soft'
        }
    },

    'forest-premium': {
        id: 'forest-premium',
        name: 'Forest Premium',
        description: 'Rich forest green with warm copper and gold',
        colors: {
            primary: '#4caf50',      // Forest green
            secondary: '#81c784',    // Light green
            accent: '#d4a574',       // Copper/bronze
            background: '#0d1b0e',   // Very dark green
            cardBg: '#1b2f1d',       // Dark forest
            text: '#f1f8f4',         // Light mint
            textMuted: '#a5d6a7',    // Muted green
            border: '#4caf5040'
        },
        fonts: {
            heading: "'Merriweather', serif",
            body: "'Open Sans', sans-serif",
            accent: "'Libre Baskerville', serif"
        },
        borderStyle: 'organic',
        spacing: 'normal',
        effects: {
            glow: false,
            gradient: true,
            shadow: 'soft'
        }
    },

    'royal-purple': {
        id: 'royal-purple',
        name: 'Royal Purple',
        description: 'Majestic purple with gold accents for luxury dining',
        colors: {
            primary: '#9c27b0',      // Deep purple
            secondary: '#ba68c8',    // Light purple
            accent: '#ffd700',       // Gold
            background: '#1a0a1f',   // Very dark purple
            cardBg: '#2d1b3d',       // Dark purple
            text: '#f3e5f5',         // Light lavender
            textMuted: '#ce93d8',    // Muted purple
            border: '#9c27b040'
        },
        fonts: {
            heading: "'Cinzel', serif",
            body: "'Crimson Text', serif",
            accent: "'Philosopher', sans-serif"
        },
        borderStyle: 'elegant',
        spacing: 'spacious',
        effects: {
            glow: true,
            gradient: true,
            shadow: 'soft'
        }
    },

    'crimson-elite': {
        id: 'crimson-elite',
        name: 'Crimson Elite',
        description: 'Bold dark red with champagne gold for premium steakhouses',
        colors: {
            primary: '#c62828',      // Deep red
            secondary: '#e57373',    // Light red
            accent: '#f4e4c1',       // Champagne
            background: '#1a0a0a',   // Almost black with red tint
            cardBg: '#2d1414',       // Dark burgundy
            text: '#fff5f5',         // Off-white
            textMuted: '#ef9a9a',    // Muted red
            border: '#c6282840'
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Roboto Slab', serif",
            accent: "'Oswald', sans-serif"
        },
        borderStyle: 'modern',
        spacing: 'normal',
        effects: {
            glow: false,
            gradient: true,
            shadow: 'hard'
        }
    },

    'slate-modern': {
        id: 'slate-modern',
        name: 'Slate Modern',
        description: 'Sophisticated charcoal with teal and silver accents',
        colors: {
            primary: '#26a69a',      // Teal
            secondary: '#4db6ac',    // Light teal
            accent: '#b0bec5',       // Silver gray
            background: '#0f1419',   // Dark slate
            cardBg: '#1e272e',       // Charcoal
            text: '#eceff1',         // Light gray
            textMuted: '#90a4ae',    // Muted gray
            border: '#26a69a40'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Source Sans Pro', sans-serif",
            accent: "'Space Grotesk', sans-serif"
        },
        borderStyle: 'modern',
        spacing: 'compact',
        effects: {
            glow: false,
            gradient: false,
            shadow: 'soft'
        }
    }
};

export const getThemeForVenue = (venueSlug?: string, customTheme?: MenuTheme): ThemeConfig => {
    // Custom theme override - allows users to change theme
    if (customTheme) {
        return menuThemes[customTheme];
    }

    // All venues use cyberpunk-tech by default
    return menuThemes['cyberpunk-tech'];
};
