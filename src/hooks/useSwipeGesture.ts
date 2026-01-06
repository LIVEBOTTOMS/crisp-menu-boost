import { useState, useEffect, useRef, TouchEvent } from 'react';

interface SwipeGestureOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
}

interface SwipeGestureReturn {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
}

export const useSwipeGesture = ({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 75
}: SwipeGestureOptions): SwipeGestureReturn => {
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchEnd = () => {
        const deltaX = touchStart.x - touchEnd.x;
        const deltaY = touchStart.y - touchEnd.y;

        // Determine if horizontal or vertical swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > threshold && onSwipeLeft) {
                onSwipeLeft();
            } else if (deltaX < -threshold && onSwipeRight) {
                onSwipeRight();
            }
        } else {
            // Vertical swipe
            if (deltaY > threshold && onSwipeUp) {
                onSwipeUp();
            } else if (deltaY < -threshold && onSwipeDown) {
                onSwipeDown();
            }
        }
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
    };
};

// Hook for long press detection
interface LongPressOptions {
    onLongPress: () => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, delay = 500 }: LongPressOptions) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        timeoutRef.current = setTimeout(() => {
            onLongPress();
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, delay);
    };

    const clear = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
    };
};
