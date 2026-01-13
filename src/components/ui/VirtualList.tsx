import { useRef, useState, useEffect, useCallback, ReactNode } from 'react';

interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    renderItem: (item: T, index: number) => ReactNode;
    overscan?: number;
    className?: string;
    containerHeight?: number | string;
}

/**
 * VirtualList - Renders only visible items for large lists
 * Significantly improves performance for menus with 100+ items
 */
export function VirtualList<T>({
    items,
    itemHeight,
    renderItem,
    overscan = 3,
    className = '',
    containerHeight = '100vh',
}: VirtualListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeightPx, setContainerHeightPx] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerHeightPx(containerRef.current.clientHeight);
        }

        const handleResize = () => {
            if (containerRef.current) {
                setContainerHeightPx(containerRef.current.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    // Calculate visible range
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeightPx) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return (
        <div
            ref={containerRef}
            className={`overflow-auto ${className}`}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: offsetY,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map((item, index) => (
                        <div key={startIndex + index} style={{ height: itemHeight }}>
                            {renderItem(item, startIndex + index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Simple virtualized list hook for custom implementations
 */
export function useVirtualList<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    overscan = 3
) {
    const [scrollTop, setScrollTop] = useState(0);

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return {
        visibleItems,
        totalHeight,
        offsetY,
        startIndex,
        endIndex,
        setScrollTop,
    };
}

export default VirtualList;
