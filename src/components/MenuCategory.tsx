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
      className="relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Premium Category Card */}
      <div className="border border-border/60 bg-card/40 backdrop-blur-sm rounded-sm overflow-hidden">
        {/* Category Header */}
        <div className="relative px-5 py-4 border-b border-border/40 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/30" />
          
          <div className="flex items-center justify-center gap-3">
            {category.icon && <span className="text-lg">{category.icon}</span>}
            <h3 className="font-cinzel text-base md:text-lg font-semibold tracking-[0.2em] uppercase text-primary">
              {category.title}
            </h3>
          </div>
          
          {/* Size labels for drinks */}
          {category.items[0]?.sizes && (
            <div className="flex justify-end gap-4 mt-3 pr-2 text-[10px] text-muted-foreground font-montserrat uppercase tracking-[0.15em]">
              <span>30ml</span>
              <span>60ml</span>
              <span>90ml</span>
              <span>180ml</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="p-4 space-y-0.5">
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
              <div className="py-3 px-4 rounded-sm bg-card/80 border border-primary/30 mt-3">
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
                      className="h-9 w-24 text-sm bg-background/50 border-border/40"
                    />
                    <button 
                      onClick={handleAddItem} 
                      className="p-2 hover:bg-primary/20 rounded-sm transition-colors"
                      disabled={!newItem.name || !newItem.price}
                    >
                      <Check className="w-4 h-4 text-primary" />
                    </button>
                    <button 
                      onClick={() => { setIsAdding(false); setNewItem({ name: "", price: "", description: "" }); }} 
                      className="p-2 hover:bg-destructive/20 rounded-sm transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full mt-3 py-2.5 px-4 rounded-sm border border-dashed border-primary/30 text-primary/70 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-montserrat tracking-wide"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            )
          )}
        </div>
        
        {/* Bottom border accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
};
