import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    threshold = 80,
}) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Only start if at top of page
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    }, []);

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (startY === 0 || window.scrollY > 0) return;

            const currentY = e.touches[0].clientY;
            const distance = currentY - startY;

            if (distance > 0) {
                setPullDistance(Math.min(distance, threshold * 1.5));
            }
        },
        [startY, threshold]
    );

    const handleTouchEnd = useCallback(async () => {
        if (pullDistance >= threshold && !isRefreshing) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
            }
        }
        setPullDistance(0);
        setStartY(0);
    }, [pullDistance, threshold, isRefreshing, onRefresh]);

    const rotation = (pullDistance / threshold) * 360;
    const opacity = Math.min(pullDistance / threshold, 1);

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative"
        >
            {/* Pull indicator */}
            <AnimatePresence>
                {(pullDistance > 0 || isRefreshing) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
                        style={{ height: pullDistance }}
                    >
                        <div className="bg-black/80 backdrop-blur-xl rounded-full p-3 border border-white/10">
                            <RefreshCw
                                className={`w-6 h-6 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`}
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    opacity: opacity,
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
                animate={{
                    y: isRefreshing ? 60 : pullDistance > 0 ? pullDistance * 0.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        </div>
    );
};
