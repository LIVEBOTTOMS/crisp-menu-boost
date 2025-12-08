import { useState } from "react";
import { MenuCategory as MenuCategoryType } from "@/data/menuData";
import { EditableMenuItem } from "./EditableMenuItem";
import { useMenu } from "@/contexts/MenuContext";
import { Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuCategoryProps {
  category: MenuCategoryType;
  index: number;
  sectionKey: string;
}

export const MenuCategory = ({ category, index, sectionKey }: MenuCategoryProps) => {
  const { isEditMode, addMenuItem } = useMenu();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      addMenuItem(sectionKey, index, {
        name: newItem.name,
        price: newItem.price,
        description: newItem.description || undefined,
      });
      setNewItem({ name: "", price: "", description: "" });
      setIsAdding(false);
    }
  };
  
  return (
    <div 
      className="relative card-hover"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Premium Category Card */}
      <div className="relative border border-primary/25 bg-gradient-to-b from-card/60 via-card/40 to-card/30 backdrop-blur-sm overflow-hidden">
        {/* Ornate double border effect */}
        <div className="absolute inset-[3px] border border-primary/15 pointer-events-none" />
        
        {/* Decorative corner ornaments */}
        <div className="absolute top-0 left-0 w-6 h-6">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-primary/60 to-transparent" />
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>
        <div className="absolute top-0 right-0 w-6 h-6">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary/60 to-transparent" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-primary/60 to-transparent" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>
        <div className="absolute bottom-0 left-0 w-6 h-6">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary/60 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>

        {/* Category Header */}
        <div className="relative px-6 py-5 border-b border-primary/20 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-primary/[0.06]">
          <div className="flex items-center justify-center gap-4">
            {category.icon && (
              <span className="text-xl opacity-80">{category.icon}</span>
            )}
            <h3 className="font-cinzel text-base md:text-lg font-semibold tracking-[0.25em] uppercase text-primary">
              {category.title}
            </h3>
          </div>
          
          {/* Elegant underline */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          {/* Size labels for drinks */}
          {category.items[0]?.sizes && (
            <div className="flex justify-end gap-3 mt-4 pr-2">
              {['30ml', '60ml', '90ml', '180ml'].map((size) => (
                <span key={size} className="text-[10px] text-muted-foreground/70 font-montserrat uppercase tracking-[0.15em] min-w-[3rem] text-center">
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="p-5 space-y-0.5">
          {category.items.map((item, itemIndex) => (
            <EditableMenuItem 
              key={`${item.name}-${itemIndex}`} 
              item={item} 
              index={itemIndex}
              accentColor="cyan"
              sectionKey={sectionKey}
              categoryIndex={index}
              itemIndex={itemIndex}
            />
          ))}

          {/* Add Item Button/Form */}
          {isEditMode && (
            isAdding ? (
              <div className="py-4 px-4 mt-4 bg-card/80 border border-primary/30">
                <div className="flex flex-col gap-3">
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                    className="h-9 text-sm bg-background/50 border-border/40"
                    autoFocus
                  />
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description (optional)"
                    className="h-9 text-sm bg-background/50 border-border/40"
                  />
                  <div className="flex gap-2 items-center">
                    <Input
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      placeholder="₹ Price"
                      className="h-9 w-28 text-sm bg-background/50 border-border/40"
                    />
                    <button 
                      onClick={handleAddItem} 
                      className="p-2 hover:bg-primary/20 transition-colors"
                      disabled={!newItem.name || !newItem.price}
                    >
                      <Check className="w-4 h-4 text-primary" />
                    </button>
                    <button 
                      onClick={() => { setIsAdding(false); setNewItem({ name: "", price: "", description: "" }); }} 
                      className="p-2 hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full mt-4 py-3 px-4 border border-dashed border-primary/30 text-primary/70 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-montserrat tracking-wide"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            )
          )}
        </div>
        
        {/* Bottom accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>
    </div>
  );
};
