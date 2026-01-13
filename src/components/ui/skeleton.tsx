import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

/**
 * Skeleton loading placeholder component
 * Use for content placeholders while data loads
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const baseClasses = "bg-slate-800/50 rounded";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  };

  const animationClass = animate
    ? "animate-pulse"
    : "";

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], animationClass, className)}
      style={style}
    />
  );
}

/**
 * Menu Item Skeleton - for loading menu items
 */
export function MenuItemSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-card/40 border border-white/5">
      <div className="flex items-start gap-4">
        {/* Image placeholder */}
        <Skeleton className="w-24 h-24 flex-shrink-0" variant="card" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-3/4" />

          {/* Description */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />

          {/* Tags */}
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/**
 * Menu Category Skeleton - for loading categories
 */
export function MenuCategorySkeleton() {
  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
      </div>
    </div>
  );
}

/**
 * Menu Section Skeleton - for loading sections
 */
export function MenuSectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {/* Categories */}
      <div className="space-y-8">
        <MenuCategorySkeleton />
        <MenuCategorySkeleton />
      </div>
    </div>
  );
}

/**
 * Full Page Skeleton - for initial page load
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Hero */}
      <Skeleton className="h-40 w-full" variant="card" />

      {/* Content */}
      <MenuSectionSkeleton />
    </div>
  );
}

export default Skeleton;
