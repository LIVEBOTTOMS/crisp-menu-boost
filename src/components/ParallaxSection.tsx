import React from 'react';
import { useParallax } from '@/hooks/useParallax';

interface ParallaxSectionProps {
    children: React.ReactNode;
    speed?: number;
    direction?: 'up' | 'down';
    className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
    children,
    speed = 0.5,
    direction = 'up',
    className = '',
}) => {
    const { elementRef, style } = useParallax({ speed, direction });

    return (
        <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className} style={style}>
            {children}
        </div>
    );
};
