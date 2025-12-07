import { useState } from "react";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { Input } from "@/components/ui/input";
import { Check, X, Trash2 } from "lucide-react";

interface EditableMenuItemProps {
  item: MenuItemType;
  index: number;
  accentColor: "cyan" | "magenta";
  sectionKey: string;
  categoryIndex: number;
  itemIndex: number;
}

export const EditableMenuItem = ({ 
  item, 
  index, 
  sectionKey, 
  categoryIndex, 
  itemIndex 
}: EditableMenuItemProps) => {
  const { isEditMode, updateMenuItem, deleteMenuItem } = useMenu();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const hasMultiplePrices = item.halfPrice && item.fullPrice;
  const hasSizes = item.sizes && item.sizes.length > 0;

  const handleSave = () => {
    updateMenuItem(sectionKey, categoryIndex, itemIndex, editedItem);
    setIsEditing(false);
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
            className="h-9 text-sm font-medium bg-background/50 border-border/40"
          />
          <Input
            value={editedItem.description || ""}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            placeholder="Description (e.g., Artisan preparation with house-made spices)"
            className="h-9 text-sm bg-background/50 border-border/40"
          />
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
                  className="h-9 w-20 text-sm bg-background/50 border-border/40"
                />
              ))
            ) : hasMultiplePrices ? (
              <>
                <Input
                  value={editedItem.halfPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, halfPrice: e.target.value })}
                  placeholder="Half"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40"
                />
                <Input
                  value={editedItem.fullPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, fullPrice: e.target.value })}
                  placeholder="Full"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40"
                />
              </>
            ) : (
              <Input
                value={editedItem.price || ""}
                onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                placeholder="Price"
                className="h-9 w-24 text-sm bg-background/50 border-border/40"
              />
            )}
            <button onClick={handleSave} className="p-2 hover:bg-primary/20 rounded-sm transition-colors">
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
    <div 
      className={cn(
        "group relative py-2.5 px-3 rounded-sm transition-all duration-300",
        "hover:bg-primary/5",
        index % 2 === 0 ? "bg-transparent" : "bg-card/30",
        isEditMode && "cursor-pointer hover:ring-1 hover:ring-primary/30"
      )}
      onClick={() => isEditMode && setIsEditing(true)}
    >
      {/* Delete button in edit mode */}
      {isEditMode && (
        <button 
          onClick={handleDelete}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-sm bg-destructive/10 hover:bg-destructive/30 opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </button>
      )}

      {/* Row layout */}
      <div className="flex items-start justify-between gap-4">
        {/* Item name and description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-cormorant text-base md:text-lg tracking-wide text-foreground font-medium leading-tight">
              {item.name}
            </span>
            {/* Dotted line filler */}
            <span className="flex-1 border-b border-dotted border-border/40 min-w-8 mb-1" />
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5 italic font-cormorant leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price(s) */}
        <div className="flex-shrink-0 text-right">
          {hasSizes ? (
            <div className="flex gap-3 justify-end text-sm font-montserrat font-medium text-primary">
              {item.sizes!.map((size, i) => (
                <span key={i} className="tracking-wide whitespace-nowrap min-w-[3rem] text-center">{size}</span>
              ))}
            </div>
          ) : hasMultiplePrices ? (
            <div className="text-sm font-montserrat flex gap-3 justify-end">
              <span className="whitespace-nowrap">
                <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">H </span>
                <span className="text-primary font-medium tracking-wide">{item.halfPrice}</span>
              </span>
              <span className="whitespace-nowrap">
                <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">F </span>
                <span className="text-primary font-medium tracking-wide">{item.fullPrice}</span>
              </span>
            </div>
          ) : (
            <span className="font-montserrat text-sm md:text-base font-semibold text-primary tracking-wide whitespace-nowrap">
              {item.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
