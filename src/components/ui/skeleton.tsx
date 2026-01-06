import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer';
}

function Skeleton({ className, variant = 'shimmer', ...props }: SkeletonProps) {
  const variantStyles = variant === 'shimmer'
    ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer'
    : 'animate-pulse bg-muted';

  return <div className={cn("rounded-md", variantStyles, className)} {...props} />;
}

export { Skeleton };
