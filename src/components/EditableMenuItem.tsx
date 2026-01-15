import { useState } from "react";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { Input } from "@/components/ui/input";
import { VoteButton } from "@/components/VoteButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X, Trash2, Flame, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { type SpiceLevel, type DietaryType, spiceLevels, dietaryTypes, badges, calculateDiscount, formatCaloriesDisplay } from "@/types/menuItem";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { Info } from "lucide-react";

interface EditableMenuItemProps {
  item: MenuItemType;
  index: number;
  accentColor: "cyan" | "magenta";
  sectionKey: string;
  categoryIndex: number;
  itemIndex: number;
  showNutritional?: boolean;
}

export const EditableMenuItem = ({
  item,
  index,
  accentColor,
  sectionKey,
  categoryIndex,
  itemIndex,
  showNutritional
}: EditableMenuItemProps) => {
  const { isEditMode, updateMenuItem, deleteMenuItem, venueData } = useMenu();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [imageError, setImageError] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const { playClick, playShimmer } = useSound();
  const haptics = useHaptics();

  const hasMultiplePrices = item.halfPrice && item.fullPrice;
  const hasSizes = item.sizes && item.sizes.length > 0;

  const handleSave = async () => {
    try {
      await updateMenuItem(sectionKey, categoryIndex, itemIndex, editedItem);
      setIsEditing(false);
      toast.success("Menu item updated successfully!");
    } catch (error) {
      console.error("Failed to save menu item:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMenuItem(sectionKey, categoryIndex, itemIndex);
  };

  if (isEditMode && isEditing) {
    return (
      <div className="py-3 px-4 rounded-sm bg-card/80 border border-primary/30">
        <div className="flex flex-col gap-3">
          <Input
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            placeholder="Item name"
            className="h-9 text-sm font-medium bg-background/50 border-border/40 text-white"
          />
          <Input
            value={editedItem.description || ""}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            placeholder="Description (e.g., Artisan preparation with house-made spices)"
            className="h-9 text-sm bg-background/50 border-border/40 text-white"
          />
          <div className="flex items-center gap-2">
            <ImageUpload
              currentImage={editedItem.image}
              onImageChange={(url) => setEditedItem({ ...editedItem, image: url })}
              itemName={editedItem.name}
            />
            {editedItem.image && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Image set
              </span>
            )}
          </div>


          {/* Tags / Badges Toggles */}
          <div className="space-y-4 border-y border-white/10 py-4 my-1">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`chef-${index}`}
                  checked={editedItem.isChefSpecial}
                  onCheckedChange={(c) => setEditedItem({ ...editedItem, isChefSpecial: c as boolean })}
                  className="border-secondary data-[state=checked]:bg-secondary"
                />
                <Label htmlFor={`chef-${index}`} className="text-[10px] uppercase tracking-wider text-secondary font-bold cursor-pointer">Chef's Special</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`best-${index}`}
                  checked={editedItem.isBestSeller}
                  onCheckedChange={(c) => setEditedItem({ ...editedItem, isBestSeller: c as boolean })}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`best-${index}`} className="text-[10px] uppercase tracking-wider text-primary font-bold cursor-pointer">Best Seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`premium-${index}`}
                  checked={editedItem.isPremium}
                  onCheckedChange={(c) => setEditedItem({ ...editedItem, isPremium: c as boolean })}
                  className="border-accent data-[state=checked]:bg-accent"
                />
                <Label htmlFor={`premium-${index}`} className="text-[10px] uppercase tracking-wider text-accent font-bold cursor-pointer">Premium</Label>
              </div>
            </div>

            {/* New Enhanced Fields Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Dietary</Label>
                <Select
                  value={editedItem.dietary || 'bg-transparent'}
                  onValueChange={(value) => setEditedItem({ ...editedItem, dietary: value as DietaryType })}
                >
                  <SelectTrigger className="h-8 bg-black/20 border-white/10 text-xs">
                    <SelectValue placeholder="Dietary" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {Object.entries(dietaryTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="focus:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Spice Level</Label>
                <Select
                  value={editedItem.spice_level || 'none'}
                  onValueChange={(value) => setEditedItem({ ...editedItem, spice_level: value as SpiceLevel })}
                >
                  <SelectTrigger className="h-8 bg-black/20 border-white/10 text-xs text-white">
                    <SelectValue placeholder="Spice" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {Object.entries(spiceLevels).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="focus:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span>{config.emoji}</span>
                          <span>{config.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Calories</Label>
                <Input
                  type="number"
                  value={editedItem.calories || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, calories: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="250"
                  className="h-8 bg-black/20 border-white/10 text-xs text-white px-2"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Orig. Price</Label>
                <Input
                  type="number"
                  value={editedItem.original_price || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, original_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="500"
                  className="h-8 bg-black/20 border-white/10 text-xs text-white px-2"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Discount %</Label>
                <Input
                  type="number"
                  value={editedItem.discount_percent || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, discount_percent: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="20"
                  className="h-8 bg-black/20 border-white/10 text-xs text-white px-2"
                />
              </div>
            </div>

            {editedItem.discount_percent && (
              <div className="text-xs text-green-400 bg-green-900/20 p-2 rounded flex justify-between items-center">
                <span>{editedItem.discount_percent}% OFF</span>
                {editedItem.original_price && (
                  <span className="opacity-70">
                    Calc: ₹{Math.round(editedItem.original_price * (1 - (editedItem.discount_percent || 0) / 100))}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {hasSizes ? (
              editedItem.sizes?.map((size, i) => (
                <Input
                  key={i}
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...(editedItem.sizes || [])];
                    newSizes[i] = e.target.value;
                    setEditedItem({ ...editedItem, sizes: newSizes });
                  }}
                  className="h-9 w-20 text-sm bg-background/50 border-border/40 text-white"
                />
              ))
            ) : hasMultiplePrices ? (
              <>
                <Input
                  value={editedItem.halfPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, halfPrice: e.target.value })}
                  placeholder="Half"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
                />
                <Input
                  value={editedItem.fullPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, fullPrice: e.target.value })}
                  placeholder="Full"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
                />
              </>
            ) : (
              <Input
                value={editedItem.price || ""}
                onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                placeholder="Price"
                className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
              />
            )}
            <button onClick={handleSave} className="p-2 hover:bg-primary/20 rounded-sm transition-colors ml-auto">
              <Check className="w-4 h-4 text-primary" />
            </button>
            <button onClick={handleCancel} className="p-2 hover:bg-destructive/20 rounded-sm transition-colors">
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => {
        haptics.light();
      }}
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-500 overflow-hidden",
        "border border-transparent hover:border-white/5",
        "hover:bg-card/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.2)]",
        "backdrop-blur-sm",
        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]",
        isEditMode && "cursor-pointer ring-1 ring-transparent hover:ring-primary/40"
      )}
      onClick={() => {
        if (isEditMode) {
          setIsEditing(true);
        } else {
          setShowIngredients(!showIngredients);
          playClick();
          haptics.light();
        }
      }}
    >
      {/* Scanline Animation for Nutritional Mode */}
      <AnimatePresence>
        {showNutritional && (
          <motion.div
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-cyan-500/30 blur-[2px] z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>
      {/* Subtle Tech Background Pattern on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className={`absolute top-0 left-0 w-8 h-8 border-l border-t ${accentColor === 'cyan' ? 'border-primary/20' : 'border-secondary/20'}`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-r border-b ${accentColor === 'cyan' ? 'border-primary/20' : 'border-secondary/20'}`} />
      </div>

      {/* Delete button in edit mode */}
      {isEditMode && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/30 opacity-0 group-hover:opacity-100 transition-all z-20"
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </button>
      )}

      {/* Row layout - name/description on left, prices on right */}
      <div className="flex items-start gap-6 relative z-10">

        {/* Item Image */}
        {item.image && !imageError && (
          <div className={cn(
            "w-32 h-32 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40 shadow-2xl relative group-hover:shadow-[0_0_20px_-5px_var(--accent-color)]",
            accentColor === "cyan" ? "group-hover:border-primary/50 shadow-primary/10" : "group-hover:border-secondary/50 shadow-secondary/10",
            "transition-all duration-500 group-hover:scale-[1.02]"
          )}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="flex-1 flex justify-between gap-4 min-w-0 pt-1">
          {/* Item name and description */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={cn(
                "w-1.5 h-1.5 rounded-sm rotate-45 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_8px_currentColor] flex-shrink-0",
                accentColor === "cyan"
                  ? "bg-primary shadow-primary/20 text-primary"
                  : "bg-secondary shadow-secondary/20 text-secondary"
              )} />
              <span className="font-orbitron text-base font-medium tracking-wide text-foreground group-hover:text-white transition-colors">
                {item.name}
              </span>

              {/* Popularity Heatmap */}
              {!isEditMode && (
                <div className="flex items-center gap-1 ml-auto md:ml-0 overflow-hidden" title="Social Pulse: Popularity">
                  <div className="flex gap-[1px]">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 h-3 rounded-full transition-all duration-700 delay-150",
                          i <= (index % 5 + 1) ? "bg-cyan-500/60 shadow-[0_0_5px_rgba(6,182,212,0.5)]" : "bg-white/5"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.isChefSpecial && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary/10 text-secondary tracking-widest uppercase border border-secondary/20">
                    {t('menu.chef-special')}
                  </span>
                )}
                {item.isBestSeller && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary tracking-widest uppercase border border-primary/20">
                    {t('menu.bestseller')}
                  </span>
                )}
                {item.isPremium && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent tracking-widest uppercase border border-accent/20">
                    {t('menu.premium')}
                  </span>
                )}
                {item.isTopShelf && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 tracking-widest uppercase border border-purple-500/20">
                    {t('menu.top-shelf')}
                  </span>
                )}
                {item.badge && badges[item.badge] && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase border ${badges[item.badge].bgColor} bg-opacity-10 text-white border-white/20`}>
                    {t(`menu.${item.badge}`) || badges[item.badge].label}
                  </span>
                )}
                {item.discount_percent && item.discount_percent > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 tracking-widest uppercase border border-red-500/30 animate-pulse">
                    {item.discount_percent}% OFF
                  </span>
                )}
                {item.isBestSeller && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 tracking-[0.2em] uppercase border border-orange-500/30 flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 animate-pulse" />
                    TRENDING
                  </span>
                )}
              </div>
              {/* Description & New Indicators */}
              <div className="mt-1.5 space-y-1">
                {item.description && (
                  <p className="text-sm text-muted-foreground/80 font-montserrat leading-relaxed tracking-wide group-hover:text-muted-foreground transition-colors">
                    {item.description}
                  </p>
                )}

                {/* Meta Row: Dietary, Spice, Calories */}
                {(item.dietary || item.spice_level !== 'none' || item.calories) && (
                  <div className="flex items-center gap-3 pt-1">
                    {item.dietary && (
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70" title={t(`dietary.${item.dietary}`)}>
                        <span className="text-xs">{dietaryTypes[item.dietary].icon}</span>
                        <span>{t(`dietary.${item.dietary}`)}</span>
                      </div>
                    )}
                    {item.spice_level && item.spice_level !== 'none' && (
                      <div className={`flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${spiceLevels[item.spice_level].color}`} title={t(`spice.${item.spice_level}`)}>
                        <Flame className="w-3 h-3" />
                        <span>{spiceLevels[item.spice_level].emoji}</span>
                      </div>
                    )}
                    {item.calories && (
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
                        <span>{formatCaloriesDisplay(item.calories)}</span>
                        {showNutritional && (
                          <div className="flex gap-2 ml-2 text-[8px] animate-in fade-in slide-in-from-left-1">
                            <span className="text-orange-400/80">P: 12g</span>
                            <span className="text-blue-400/80">C: 34g</span>
                            <span className="text-emerald-400/80">F: 8g</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Vote Button (Beverages Only) */}
                {venueData?.id && !isEditMode && sectionKey.toLowerCase().includes('beverages') && (
                  <div className="mt-2 max-w-[180px]">
                    <VoteButton
                      itemId={item.id || `${sectionKey}_${categoryIndex}_${itemIndex}`}
                      venueId={venueData.id}
                      itemName={item.name}
                      originalPrice={parseFloat(String(item.price || item.fullPrice || '0').replace(/[^\d.]/g, '')) || 0}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Price(s) - SEPARATE COLUMN */}
            <div className="flex-shrink-0 text-right self-start pt-0.5">
              {hasSizes ? (
                <div className={`flex items-center gap-4 text-sm font-orbitron font-semibold ${accentColor === 'cyan' ? 'text-primary' : 'text-secondary'}`}>
                  {item.sizes!.map((size, i) => (
                    <div key={i} className="flex flex-col items-end group/price">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 opacity-60">
                        {i === 0 ? '30ml' : i === 1 ? '60ml' : i === 2 ? '90ml' : '180ml'}
                      </span>
                      <span className="tracking-wide text-base group-hover:text-white transition-colors">{size}</span>
                    </div>
                  ))}
                </div>
              ) : hasMultiplePrices ? (
                <div className="flex items-center gap-4 font-orbitron">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Half</span>
                    <span className="text-accent font-bold tracking-wide text-base">{item.halfPrice}</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Full</span>
                    <span className="text-accent font-bold tracking-wide text-base">{item.fullPrice}</span>
                  </div>
                </div>
              ) : (
                item.discount_percent && item.price ? (
                  <div className="flex flex-col items-end">
                    {item.original_price && (
                      <span className="text-xs text-muted-foreground line-through decoration-red-500/50 mr-1">
                        ₹{item.original_price}
                      </span>
                    )}
                    <span className="font-orbitron text-lg font-bold text-red-400 tracking-wide whitespace-nowrap drop-shadow-[0_0_8px_rgba(248,113,113,0.3)] group-hover:scale-105 transition-transform inline-block">
                      {item.price}
                    </span>
                  </div>
                ) : (
                  <span className="font-orbitron text-lg font-bold text-accent tracking-wide whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,215,0,0.3)] group-hover:scale-105 transition-transform inline-block">
                    {item.price}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Peek Overlay */}
      <AnimatePresence>
        {showIngredients && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/5 relative z-20"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Flavor Profile & Origins</span>
              </div>
              <p className="text-xs text-muted-foreground/90 italic font-montserrat pr-8">
                {item.description ? `Crafted with ${item.description.split(' ').slice(0, 3).join(', ')} and other artisanal elements across a meticulous process.` : "A harmonious blend of premium ingredients selected for their quality and specific flavor profile."}
              </p>

              <div className="flex gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 uppercase tracking-tighter">Preparation</span>
                  <span className="text-[10px] text-white font-medium">12-15 Minutes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 uppercase tracking-tighter">Freshness</span>
                  <span className="text-[10px] text-green-400 font-medium">Made to order</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
