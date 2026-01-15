// Animation Library - Reusable configurations for beautiful mobile interactions

import { Variants } from "framer-motion";

// ============================================
// ANIMATION PRESETS
// ============================================

export const animationPresets = {
    // Page Transitions
    pageSlide: {
        initial: { x: 20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 }
    },

    pageFade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },

    // Stagger Animations
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    },

    staggerItem: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 }
    },

    // Scale Animations
    scaleIn: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 }
    },

    scaleBounce: {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2
            }
        }
    },

    // Floating Elements
    float: {
        animate: {
            y: [-2, 2, -2],
            transition: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity
            }
        }
    },

    // Pulse Effects
    pulseGlow: {
        animate: {
            boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.3)",
                "0 0 40px rgba(34, 211, 238, 0.6)",
                "0 0 20px rgba(34, 211, 238, 0.3)"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Ripple Effects
    ripple: {
        initial: { scale: 0, opacity: 0.5 },
        animate: { scale: 2, opacity: 0 }
    },

    // Morphing Shapes
    morph: {
        animate: {
            borderRadius: ["50%", "20%", "50%"],
            rotate: [0, 180, 360],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Gradient Shifts
    gradientShift: {
        animate: {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }
        }
    },

    // Parallax Effects
    parallax: {
        initial: { y: 0 },
        animate: { y: 0 }
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const createStaggerContainer = (delay: number = 0.1): Variants => ({
    animate: {
        transition: {
            staggerChildren: delay,
            delayChildren: 0.1
        }
    }
});

export const createStaggerItem = (): Variants => ({
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
});

export const createMagneticEffect = (strength: number = 0.3) => ({
    whileHover: {
        scale: 1 + strength,
        transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    whileTap: {
        scale: 1 - strength * 0.5,
        transition: { type: "spring", stiffness: 400, damping: 17 }
    }
});

export const createBreathingAnimation = (intensity: number = 0.05) => ({
    animate: {
        scale: [1, 1 + intensity, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
});

// ============================================
// THEME-BASED ANIMATIONS
// ============================================

export const createTimeBasedAnimation = (currentHour: number) => {
    const isMorning = currentHour >= 6 && currentHour < 12;
    const isAfternoon = currentHour >= 12 && currentHour < 18;
    const isEvening = currentHour >= 18 || currentHour < 6;

    if (isMorning) {
        return {
            gradient: "from-amber-400 via-orange-500 to-yellow-500",
            intensity: 0.8,
            speed: 1.2
        };
    } else if (isAfternoon) {
        return {
            gradient: "from-blue-400 via-cyan-500 to-teal-500",
            intensity: 1.0,
            speed: 1.0
        };
    } else {
        return {
            gradient: "from-purple-500 via-pink-500 to-indigo-500",
            intensity: 0.6,
            speed: 0.8
        };
    }
};

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

export const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
export const isReducedMotion = reducedMotionQuery.matches;

export const getSafeAnimation = (animation: Variants, fallback?: Variants): Variants => {
    if (isReducedMotion && fallback) {
        return fallback;
    }
    return animation;
};

export const gpuAccelerate = {
    willChange: "transform",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden"
};

// ============================================
// ADVANCED INTERACTION PATTERNS
// ============================================

export const createGestureAnimation = {
    swipeLeft: {
        x: -100,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    swipeRight: {
        x: 100,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    tapFeedback: {
        scale: [1, 0.95, 1],
        transition: { duration: 0.15, ease: "easeInOut" }
    },
    longPress: {
        scale: 0.9,
        boxShadow: "0 0 0 4px rgba(34, 211, 238, 0.3)",
        transition: { duration: 0.2, ease: "easeInOut" }
    }
};

export const createLoadingAnimation = (type: 'spinner' | 'pulse' | 'shimmer' = 'spinner') => {
    switch (type) {
        case 'spinner':
            return {
                animate: { rotate: 360 },
                transition: { duration: 1, repeat: Infinity, ease: "linear" }
            };
        case 'pulse':
            return {
                animate: { opacity: [0.5, 1, 0.5] },
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            };
        case 'shimmer':
            return {
                animate: { x: ["-100%", "100%"] },
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            };
        default:
            return {};
    }
};

// ============================================
// EXPORT UTILITIES
// ============================================

export const springConfig = {
    gentle: { stiffness: 300, damping: 30 },
    wobbly: { stiffness: 180, damping: 12 },
    stiff: { stiffness: 400, damping: 40 },
    slow: { stiffness: 280, damping: 60 }
};

export const easingFunctions = {
    smooth: "easeInOut",
    bounce: "easeOut",
    snap: "easeOut",
    linear: "linear"
};
