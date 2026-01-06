import { Skeleton } from "@/components/ui/skeleton";

export const VenueCardSkeleton = () => {
    return (
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
            {/* Logo/Image */}
            <Skeleton className="h-16 w-16 rounded-xl" variant="shimmer" />

            {/* Venue name */}
            <Skeleton className="h-7 w-3/4" variant="shimmer" />

            {/* Tagline */}
            <Skeleton className="h-4 w-full" variant="shimmer" />

            {/* Location */}
            <Skeleton className="h-3 w-1/2" variant="shimmer" />

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 flex-1 rounded-lg" variant="shimmer" />
                <Skeleton className="h-10 flex-1 rounded-lg" variant="shimmer" />
            </div>
        </div>
    );
};

export const VenueListSkeleton = () => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <VenueCardSkeleton key={i} />
            ))}
        </div>
    );
};
