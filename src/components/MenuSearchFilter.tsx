import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Leaf, Flame, DollarSign } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MenuFilters {
    searchQuery: string;
    dietary: string[];
    spiceLevel: string[];
    priceRange: { min: number; max: number } | null;
    badges: string[];
}

interface MenuSearchFilterProps {
    onFiltersChange: (filters: MenuFilters) => void;
    totalItems: number;
    filteredCount: number;
}

export const MenuSearchFilter = ({ onFiltersChange, totalItems, filteredCount }: MenuSearchFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedSpice, setSelectedSpice] = useState<string[]>([]);
    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

    const dietaryOptions = [
        { value: "veg", label: "Vegetarian", icon: "🥬" },
        { value: "non-veg", label: "Non-Veg", icon: "🍖" },
        { value: "vegan", label: "Vegan", icon: "🌱" },
        { value: "gluten-free", label: "Gluten Free", icon: "🌾" },
    ];

    const spiceLevels = [
        { value: "none", label: "No Spice", icon: "❄️" },
        { value: "mild", label: "Mild", icon: "🌶️" },
        { value: "medium", label: "Medium", icon: "🌶️🌶️" },
        { value: "hot", label: "Hot", icon: "🌶️🌶️🌶️" },
        { value: "extra-hot", label: "Extra Hot", icon: "🔥" },
    ];

    const badgeOptions = [
        { value: "bestseller", label: "Best Seller" },
        { value: "chef-special", label: "Chef's Special" },
        { value: "new", label: "New" },
        { value: "premium", label: "Premium" },
    ];

    const priceRanges = [
        { label: "Under ₹200", min: 0, max: 200 },
        { label: "₹200 - ₹500", min: 200, max: 500 },
        { label: "₹500 - ₹1000", min: 500, max: 1000 },
        { label: "Above ₹1000", min: 1000, max: 999999 },
    ];

    const updateFilters = (updates: Partial<MenuFilters>) => {
        const newFilters: MenuFilters = {
            searchQuery,
            dietary: selectedDietary,
            spiceLevel: selectedSpice,
            priceRange,
            badges: selectedBadges,
            ...updates,
        };
        onFiltersChange(newFilters);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        updateFilters({ searchQuery: value });
    };

    const toggleDietary = (value: string) => {
        const newDietary = selectedDietary.includes(value)
            ? selectedDietary.filter(d => d !== value)
            : [...selectedDietary, value];
        setSelectedDietary(newDietary);
        updateFilters({ dietary: newDietary });
    };

    const toggleSpice = (value: string) => {
        const newSpice = selectedSpice.includes(value)
            ? selectedSpice.filter(s => s !== value)
            : [...selectedSpice, value];
        setSelectedSpice(newSpice);
        updateFilters({ spiceLevel: newSpice });
    };

    const toggleBadge = (value: string) => {
        const newBadges = selectedBadges.includes(value)
            ? selectedBadges.filter(b => b !== value)
            : [...selectedBadges, value];
        setSelectedBadges(newBadges);
        updateFilters({ badges: newBadges });
    };

    const setPriceFilter = (range: { min: number; max: number } | null) => {
        setPriceRange(range);
        updateFilters({ priceRange: range });
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedDietary([]);
        setSelectedSpice([]);
        setSelectedBadges([]);
        setPriceRange(null);
        onFiltersChange({
            searchQuery: "",
            dietary: [],
            spiceLevel: [],
            priceRange: null,
            badges: [],
        });
    };

    const activeFiltersCount =
        selectedDietary.length +
        selectedSpice.length +
        selectedBadges.length +
        (priceRange ? 1 : 0);

    return (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-white/10 p-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
                {searchQuery && (
                    <button
                        onClick={() => handleSearchChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
                {/* Dietary Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Leaf className="w-4 h-4 mr-2" />
                            Dietary
                            {selectedDietary.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-neon-cyan text-black">
                                    {selectedDietary.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                        <DropdownMenuLabel className="text-white">Dietary Preferences</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {dietaryOptions.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.value}
                                checked={selectedDietary.includes(option.value)}
                                onCheckedChange={() => toggleDietary(option.value)}
                                className="text-white focus:bg-slate-800"
                            >
                                <span className="mr-2">{option.icon}</span>
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Spice Level Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Flame className="w-4 h-4 mr-2" />
                            Spice
                            {selectedSpice.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-neon-cyan text-black">
                                    {selectedSpice.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                        <DropdownMenuLabel className="text-white">Spice Level</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {spiceLevels.map((level) => (
                            <DropdownMenuCheckboxItem
                                key={level.value}
                                checked={selectedSpice.includes(level.value)}
                                onCheckedChange={() => toggleSpice(level.value)}
                                className="text-white focus:bg-slate-800"
                            >
                                <span className="mr-2">{level.icon}</span>
                                {level.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Price Range Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Price
                            {priceRange && (
                                <Badge variant="secondary" className="ml-2 bg-neon-cyan text-black">
                                    1
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                        <DropdownMenuLabel className="text-white">Price Range</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {priceRanges.map((range, idx) => (
                            <DropdownMenuCheckboxItem
                                key={idx}
                                checked={priceRange?.min === range.min && priceRange?.max === range.max}
                                onCheckedChange={() =>
                                    setPriceFilter(priceRange?.min === range.min ? null : range)
                                }
                                className="text-white focus:bg-slate-800"
                            >
                                {range.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Badges Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Filter className="w-4 h-4 mr-2" />
                            Tags
                            {selectedBadges.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-neon-cyan text-black">
                                    {selectedBadges.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                        <DropdownMenuLabel className="text-white">Special Tags</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {badgeOptions.map((badge) => (
                            <DropdownMenuCheckboxItem
                                key={badge.value}
                                checked={selectedBadges.includes(badge.value)}
                                onCheckedChange={() => toggleBadge(badge.value)}
                                className="text-white focus:bg-slate-800"
                            >
                                {badge.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear ({activeFiltersCount})
                    </Button>
                )}

                {/* Results Count */}
                <div className="ml-auto text-sm text-muted-foreground">
                    Showing {filteredCount} of {totalItems} items
                </div>
            </div>
        </div>
    );
};
