import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const Skeleton = ({ className = "", variant = "rectangular" }: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg h-48",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: "shimmer 2s infinite",
      }}
    />
  );
};

export const MenuItemSkeleton = () => (
  <div className="flex gap-4 p-4 border-b border-white/5">
    <Skeleton variant="rectangular" className="w-20 h-20 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-full h-3" />
      <Skeleton variant="text" className="w-2/3 h-3" />
      <div className="flex gap-2 mt-2">
        <Skeleton variant="text" className="w-16 h-6" />
        <Skeleton variant="text" className="w-20 h-6" />
      </div>
    </div>
    <Skeleton variant="text" className="w-16 h-8" />
  </div>
);

export const MenuCategorySkeleton = () => (
  <div className="space-y-4 mb-8">
    <Skeleton variant="text" className="w-48 h-8" />
    <div className="space-y-0 border border-white/10 rounded-lg overflow-hidden">
      <MenuItemSkeleton />
      <MenuItemSkeleton />
      <MenuItemSkeleton />
    </div>
  </div>
);

export const MenuSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-8">
    <div className="text-center space-y-4">
      <Skeleton variant="text" className="w-64 h-12 mx-auto" />
      <Skeleton variant="text" className="w-96 h-6 mx-auto" />
    </div>
    <MenuCategorySkeleton />
    <MenuCategorySkeleton />
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6 space-y-4">
    <Skeleton variant="text" className="w-32 h-6" />
    <Skeleton variant="rectangular" className="w-full h-40" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
  </div>
);

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}
