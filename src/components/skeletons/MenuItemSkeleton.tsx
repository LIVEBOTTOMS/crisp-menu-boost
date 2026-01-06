import { Skeleton } from "@/components/ui/skeleton";

export const MenuItemSkeleton = () => {
    return (
        <div className="p-4 space-y-3">
            {/* Item name */}
            <Skeleton className="h-6 w-3/4" variant="shimmer" />

            {/* Description */}
            <Skeleton className="h-4 w-full" variant="shimmer" />
            <Skeleton className="h-4 w-5/6" variant="shimmer" />

            {/* Price */}
            <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-5 w-20" variant="shimmer" />
                <Skeleton className="h-8 w-8 rounded-full" variant="shimmer" />
            </div>
        </div>
    );
};

export const MenuCategorySkeleton = () => {
    return (
        <div className="space-y-4">
            {/* Category header */}
            <Skeleton className="h-8 w-48" variant="shimmer" />

            {/* Menu items */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <MenuItemSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export const MenuSectionSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Section header */}
            <div className="text-center space-y-2">
                <Skeleton className="h-10 w-64 mx-auto" variant="shimmer" />
                <Skeleton className="h-4 w-96 mx-auto" variant="shimmer" />
            </div>

            {/* Categories */}
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <MenuCategorySkeleton key={i} />
                ))}
            </div>
        </div>
    );
};
