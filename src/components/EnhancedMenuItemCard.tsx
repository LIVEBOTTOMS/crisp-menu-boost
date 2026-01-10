import { Badge } from '@/components/ui/badge';
import { type MenuItem, badges, spiceLevels, dietaryTypes, calculateDiscount, formatCaloriesDisplay } from '@/types/menuItem';
import { Flame, Leaf } from 'lucide-react';

interface EnhancedMenuItemCardProps {
    item: MenuItem;
    onClick?: () => void;
}

export const EnhancedMenuItemCard = ({ item, onClick }: EnhancedMenuItemCardProps) => {
    const hasDiscount = item.discount_percent && item.discount_percent > 0;
    const finalPrice = hasDiscount && item.original_price
        ? calculateDiscount(item.original_price, item.discount_percent!)
        : item.price;

    return (
        <div
            onClick={onClick}
            className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] transition-all duration-300 hover:scale-[1.02]"
        >
            {/* Image Section */}
            {item.image_url && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                        {/* Badge (New, Bestseller, etc.) */}
                        {item.badge && (
                            <Badge className={`${badges[item.badge].bgColor} ${badges[item.badge].color} text-xs font-bold`}>
                                {badges[item.badge].label}
                            </Badge>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                            <Badge className="bg-red-500 text-white text-xs font-bold animate-pulse">
                                {item.discount_percent}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* Dietary Indicator */}
                    {item.dietary && (
                        <div className="absolute top-2 right-2">
                            <div className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-lg border-2 ${item.dietary === 'veg' ? 'border-green-500' :
                                    item.dietary === 'non-veg' ? 'border-red-500' :
                                        'border-emerald-500'
                                }`}>
                                {dietaryTypes[item.dietary].icon}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-4">
                {/* Name & Spice Level */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-white leading-tight flex-1">
                        {item.name}
                    </h3>

                    {/* Spice Level Indicator */}
                    {item.spice_level && item.spice_level !== 'none' && (
                        <div className={`flex items-center gap-1 ${spiceLevels[item.spice_level].color}`}>
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {spiceLevels[item.spice_level].emoji}
                            </span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {item.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                    </p>
                )}

                {/* Bottom Row: Dietary + Calories + Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Dietary Label */}
                        {item.dietary && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Leaf className="w-3 h-3" />
                                <span>{dietaryTypes[item.dietary].label}</span>
                            </div>
                        )}

                        {/* Calories */}
                        {item.calories && (
                            <div className="text-xs text-gray-400">
                                {formatCaloriesDisplay(item.calories)}
                            </div>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col items-end">
                        {hasDiscount && item.original_price && (
                            <span className="text-xs text-gray-500 line-through">
                                ₹{item.original_price}
                            </span>
                        )}
                        <div className="flex items-center gap-2">
                            <span className={`font-bold text-lg ${hasDiscount ? 'text-red-400' : 'text-cyan-400'}`}>
                                ₹{finalPrice}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};
