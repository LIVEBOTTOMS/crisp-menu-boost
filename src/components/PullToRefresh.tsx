import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
    const [isPulling, setIsPulling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    const PULL_THRESHOLD = 80;
    const MAX_PULL = 120;

    // Map pull distance to rotation (0 to 360 degrees)
    const rotation = useTransform(y, [0, MAX_PULL], [0, 360]);
    const scale = useTransform(y, [0, MAX_PULL], [0.5, 1]);
    const opacity = useTransform(y, [0, PULL_THRESHOLD], [0, 1]);

    const handleTouchStart = (e: TouchEvent) => {
        const scrollTop = containerRef.current?.scrollTop || 0;
        if (scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const scrollTop = containerRef.current?.scrollTop || 0;
        if (scrollTop !== 0 || isRefreshing) return;

        const touchY = e.touches[0].clientY;
        const diff = touchY - touchStartY.current;

        if (diff > 0) {
            setIsPulling(true);
            const pullDistance = Math.min(diff * 0.5, MAX_PULL);
            y.set(pullDistance);

            // Prevent default scroll when pulling down
            if (diff > 10) {
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = async () => {
        if (!isPulling) return;

        const pullDistance = y.get();

        if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            animate(y, PULL_THRESHOLD, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            });

            try {
                await onRefresh();
            } finally {
                setTimeout(() => {
                    animate(y, 0, {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                    });
                    setIsRefreshing(false);
                    setIsPulling(false);
                }, 500);
            }
        } else {
            animate(y, 0, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            });
            setIsPulling(false);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, isRefreshing]);

    return (
        <div ref={containerRef} className="relative h-full overflow-auto">
            {/* Pull-to-Refresh Indicator */}
            <motion.div
                className="absolute top-0 left-0 right-0 flex items-center justify-center z-50"
                style={{ y: y.get() - 60 }}
            >
                <motion.div
                    className="bg-neon-cyan rounded-full p-3 shadow-lg"
                    style={{
                        rotate: rotation,
                        scale,
                        opacity,
                    }}
                >
                    <RefreshCw className="w-6 h-6 text-black" />
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </div>
    );
};
