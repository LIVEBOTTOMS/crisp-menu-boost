import { useEffect, useState, useRef } from 'react';

interface UseParallaxOptions {
    speed?: number;
    direction?: 'up' | 'down';
    disabled?: boolean;
}

export const useParallax = (options: UseParallaxOptions = {}) => {
    const { speed = 0.5, direction = 'up', disabled = false } = options;
    const [offset, setOffset] = useState(0);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (disabled) return;

        const handleScroll = () => {
            const element = elementRef.current;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Only apply parallax when element is in viewport
            if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
                const parallaxOffset = (scrolled - elementTop) * speed;
                setOffset(direction === 'up' ? -parallaxOffset : parallaxOffset);
            }
        };

        // Use requestAnimationFrame for smooth 60fps scrolling
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', onScroll);
    }, [speed, direction, disabled]);

    const style = {
        transform: `translateY(${offset}px)`,
        willChange: 'transform',
    };

    return { elementRef, offset, style };
};
