import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type MenuItem, type SpiceLevel, type DietaryType, spiceLevels, dietaryTypes, badges } from '@/types/menuItem';

interface EnhancedMenuItemFieldsProps {
    item: Partial<MenuItem>;
    onChange: (updates: Partial<MenuItem>) => void;
}

export const EnhancedMenuItemFields = ({ item, onChange }: EnhancedMenuItemFieldsProps) => {
    return (
        <div className="space-y-6">
            {/* Dietary Type */}
            <div className="space-y-2">
                <Label>Dietary Type</Label>
                <Select
                    value={item.dietary || 'veg'}
                    onValueChange={(value) => onChange({ dietary: value as DietaryType })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select dietary type" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(dietaryTypes).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                                <span className="flex items-center gap-2">
                                    <span>{config.icon}</span>
                                    <span>{config.label}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Spice Level */}
            <div className="space-y-2">
                <Label>Spice Level</Label>
                <Select
                    value={item.spice_level || 'none'}
                    onValueChange={(value) => onChange({ spice_level: value as SpiceLevel })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select spice level" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(spiceLevels).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                                <span className="flex items-center gap-2">
                                    <span>{config.emoji}</span>
                                    <span>{config.label}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Nutritional Information */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">Nutritional Information (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Calories</Label>
                        <Input
                            type="number"
                            value={item.calories || ''}
                            onChange={(e) => onChange({ calories: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="250"
                            className="bg-white/5"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Protein (g)</Label>
                        <Input
                            type="number"
                            value={item.protein || ''}
                            onChange={(e) => onChange({ protein: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="15"
                            className="bg-white/5"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Carbs (g)</Label>
                        <Input
                            type="number"
                            value={item.carbs || ''}
                            onChange={(e) => onChange({ carbs: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="30"
                            className="bg-white/5"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Fat (g)</Label>
                        <Input
                            type="number"
                            value={item.fat || ''}
                            onChange={(e) => onChange({ fat: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="10"
                            className="bg-white/5"
                        />
                    </div>
                </div>
            </div>

            {/* Discount & Special Pricing */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">Discount & Promotions</Label>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Original Price (₹)</Label>
                        <Input
                            type="number"
                            value={item.original_price || ''}
                            onChange={(e) => onChange({ original_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                            placeholder="350"
                            className="bg-white/5"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-400">Discount (%)</Label>
                        <Input
                            type="number"
                            value={item.discount_percent || ''}
                            onChange={(e) => onChange({ discount_percent: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="20"
                            min="0"
                            max="100"
                            className="bg-white/5"
                        />
                    </div>
                </div>

                {item.original_price && item.discount_percent && (
                    <div className="text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                        Final Price: ₹{item.original_price - (item.original_price * item.discount_percent / 100)}
                        <span className="text-xs text-gray-400 ml-2">
                            (Save ₹{(item.original_price * item.discount_percent / 100).toFixed(0)})
                        </span>
                    </div>
                )}
            </div>

            {/* Badge Selection */}
            <div className="space-y-2">
                <Label>Special Badge (Optional)</Label>
                <Select
                    value={item.badge || ''}
                    onValueChange={(value) => onChange({ badge: value as any })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="No badge" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">No badge</SelectItem>
                        {Object.entries(badges).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                                <span className={`inline-flex items-center px-2 py-1 rounded ${config.bgColor} ${config.color} text-xs font-bold`}>
                                    {config.label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
