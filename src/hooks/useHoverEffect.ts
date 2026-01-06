import { useEffect, useRef, useState } from 'react';

interface UseHoverEffectOptions {
    scale?: number;
    translateY?: number;
    duration?: number;
    easing?: string;
}

export const useHoverEffect = (options: UseHoverEffectOptions = {}) => {
    const {
        scale = 1.02,
        translateY = -2,
        duration = 200,
        easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
    } = options;

    const [isHovered, setIsHovered] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const style = {
        transform: isHovered
            ? `scale(${scale}) translateY(${translateY}px)`
            : 'scale(1) translateY(0)',
        transition: `transform ${duration}ms ${easing}`,
    };

    return { elementRef, isHovered, style };
};

interface UsePressEffectOptions {
    scale?: number;
    duration?: number;
}

export const usePressEffect = (options: UsePressEffectOptions = {}) => {
    const { scale = 0.95, duration = 100 } = options;
    const [isPressed, setIsPressed] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp = () => setIsPressed(false);
        const handleMouseLeave = () => setIsPressed(false);

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseup', handleMouseUp);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseup', handleMouseUp);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const style = {
        transform: isPressed ? `scale(${scale})` : 'scale(1)',
        transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };

    return { elementRef, isPressed, style };
};
