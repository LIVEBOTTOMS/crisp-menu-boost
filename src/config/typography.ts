// Typography scale using fluid sizing with clamp()
export const typographyScale = {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
    base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
    '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
    '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
    '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',
};

// Line heights optimized for readability
export const lineHeights = {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
};

// Font weights
export const fontWeights = {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
};

// Letter spacing
export const letterSpacing = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
};

// Typography presets for common use cases
export const typographyPresets = {
    h1: {
        fontSize: typographyScale['5xl'],
        fontWeight: fontWeights.black,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tighter,
    },
    h2: {
        fontSize: typographyScale['4xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },
    h3: {
        fontSize: typographyScale['3xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.snug,
        letterSpacing: letterSpacing.tight,
    },
    h4: {
        fontSize: typographyScale['2xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.snug,
    },
    body: {
        fontSize: typographyScale.base,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.relaxed,
    },
    bodyLarge: {
        fontSize: typographyScale.lg,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.relaxed,
    },
    bodySmall: {
        fontSize: typographyScale.sm,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
    },
    caption: {
        fontSize: typographyScale.xs,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.wide,
    },
    price: {
        fontSize: typographyScale['2xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        fontFamily: 'Cinzel, serif',
    },
    menuItem: {
        fontSize: typographyScale.lg,
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.snug,
        fontFamily: 'Cinzel, serif',
    },
};

// Helper function to apply typography preset
export const applyTypography = (preset: keyof typeof typographyPresets) => {
    return typographyPresets[preset];
};
