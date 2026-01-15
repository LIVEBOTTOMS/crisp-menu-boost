// Dynamic Theme Hook - Time-based and context-aware theming

import { useState, useEffect, useCallback } from 'react';
import { createTimeBasedAnimation } from '@/lib/animations';

interface ThemeConfig {
    gradient: string;
    intensity: number;
    speed: number;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
}

export const useDynamicTheme = () => {
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>({
        gradient: "from-violet-400 via-fuchsia-500 to-amber-500",
        intensity: 1.0,
        speed: 1.0,
        colors: {
            primary: "#8b5cf6",
            secondary: "#ec4899",
            accent: "#f59e0b",
            background: "#09090b"
        }
    });

    // Get current time-based theme
    const getTimeBasedTheme = useCallback((): ThemeConfig => {
        const now = new Date();
        const currentHour = now.getHours();
        const animation = createTimeBasedAnimation(currentHour);

        switch (true) {
            case (currentHour >= 6 && currentHour < 12): // Morning
                return {
                    ...animation,
                    colors: {
                        primary: "#f59e0b",
                        secondary: "#f97316",
                        accent: "#eab308",
                        background: "#09090b"
                    }
                };

            case (currentHour >= 12 && currentHour < 18): // Afternoon
                return {
                    ...animation,
                    colors: {
                        primary: "#06b6d4",
                        secondary: "#0891b2",
                        accent: "#0ea5e9",
                        background: "#09090b"
                    }
                };

            case (currentHour >= 18 || currentHour < 6): // Evening/Night
                return {
                    ...animation,
                    colors: {
                        primary: "#a855f7",
                        secondary: "#d946ef",
                        accent: "#c084fc",
                        background: "#09090b"
                    }
                };

            default:
                return currentTheme;
        }
    }, [currentTheme]);

    // Update theme based on time
    useEffect(() => {
        const updateTheme = () => {
            const newTheme = getTimeBasedTheme();
            setCurrentTheme(newTheme);
        };

        // Update immediately
        updateTheme();

        // Update every minute
        const interval = setInterval(updateTheme, 60000);

        return () => clearInterval(interval);
    }, [getTimeBasedTheme]);

    // Theme transition utilities
    const createThemeTransition = useCallback((duration: number = 0.5) => ({
        transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`
    }), []);

    const getThemeGradient = useCallback((opacity: number = 1) => {
        const colors = currentTheme.colors;
        return `linear-gradient(135deg, ${colors.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${colors.secondary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${colors.accent}${Math.round(opacity * 255).toString(16).padStart(2, '0')})`;
    }, [currentTheme.colors]);

    const getThemeShadow = useCallback((intensity: number = 0.3) => {
        const color = currentTheme.colors.primary;
        return `0 4px 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;
    }, [currentTheme.colors.primary]);

    // Context-aware theme adjustments
    const adjustThemeForContext = useCallback((context: 'success' | 'error' | 'warning' | 'info') => {
        const baseColors = currentTheme.colors;

        switch (context) {
            case 'success':
                return {
                    ...currentTheme,
                    colors: {
                        ...baseColors,
                        primary: "#10b981",
                        accent: "#34d399"
                    }
                };

            case 'error':
                return {
                    ...currentTheme,
                    colors: {
                        ...baseColors,
                        primary: "#ef4444",
                        accent: "#f87171"
                    }
                };

            case 'warning':
                return {
                    ...currentTheme,
                    colors: {
                        ...baseColors,
                        primary: "#f59e0b",
                        accent: "#fbbf24"
                    }
                };

            case 'info':
                return {
                    ...currentTheme,
                    colors: {
                        ...baseColors,
                        primary: "#06b6d4",
                        accent: "#22d3ee"
                    }
                };

            default:
                return currentTheme;
        }
    }, [currentTheme]);

    return {
        currentTheme,
        getTimeBasedTheme,
        createThemeTransition,
        getThemeGradient,
        getThemeShadow,
        adjustThemeForContext,
        setCurrentTheme
    };
};
