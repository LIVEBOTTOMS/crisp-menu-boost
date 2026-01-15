/**
 * useHaptics - A hook for tactile feedback on supported devices.
 */
export const useHaptics = () => {
    const vibrate = (pattern: number | number[]) => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore if not supported or blocked
            }
        }
    };

    return {
        light: () => vibrate(10),
        medium: () => vibrate(20),
        heavy: () => vibrate(40),
        success: () => vibrate([10, 30, 10]),
        error: () => vibrate([50, 30, 50]),
        warning: () => vibrate([30, 30, 30]),
        doubleTap: () => vibrate([10, 40, 10]),
    };
};
