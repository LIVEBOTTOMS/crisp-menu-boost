import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem, MenuSection, snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";

interface MenuData {
  snacksAndStarters: MenuSection;
  foodMenu: MenuSection;
  beveragesMenu: MenuSection;
  sideItems: MenuSection;
}

interface MenuContextType {
  menuData: MenuData;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  updateMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => void;
  addMenuItem: (sectionKey: string, categoryIndex: number, newItem: MenuItem) => void;
  deleteMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number) => void;
  adjustPrices: (percentage: number, sectionKey?: string, categoryIndex?: number) => void;
  resetToOriginal: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEY = "livebar-menu-data";

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[₹,]/g, "")) || 0;
};

const getInitialMenuData = (): MenuData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as MenuData;
    }
  } catch (e) {
    console.error("Failed to load menu from localStorage", e);
  }
  return {
    snacksAndStarters: deepClone(snacksAndStarters),
    foodMenu: deepClone(foodMenu),
    beveragesMenu: deepClone(beveragesMenu),
    sideItems: deepClone(sideItems),
  };
};

const saveMenuData = (data: MenuData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save menu to localStorage", e);
  }
};

const formatPrice = (value: number): string => {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const adjustItemPrices = (item: MenuItem, multiplier: number): MenuItem => {
  const newItem = { ...item };
  if (item.price) {
    newItem.price = formatPrice(parsePrice(item.price) * multiplier);
  }
  if (item.halfPrice) {
    newItem.halfPrice = formatPrice(parsePrice(item.halfPrice) * multiplier);
  }
  if (item.fullPrice) {
    newItem.fullPrice = formatPrice(parsePrice(item.fullPrice) * multiplier);
  }
  if (item.sizes) {
    newItem.sizes = item.sizes.map(size => formatPrice(parsePrice(size) * multiplier));
  }
  return newItem;
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuData, setMenuData] = useState(getInitialMenuData);
  const [isEditMode, setIsEditMode] = useState(false);

  // Persist menu data to localStorage whenever it changes
  const updateMenuData = (updater: (prev: typeof menuData) => typeof menuData) => {
    setMenuData(prev => {
      const newData = updater(prev);
      saveMenuData(newData);
      return newData;
    });
  };

  const updateMenuItem = (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => {
    updateMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items[itemIndex] = updatedItem;
      }
      return newData;
    });
  };

  const addMenuItem = (sectionKey: string, categoryIndex: number, newItem: MenuItem) => {
    updateMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.push(newItem);
      }
      return newData;
    });
  };

  const deleteMenuItem = (sectionKey: string, categoryIndex: number, itemIndex: number) => {
    updateMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.splice(itemIndex, 1);
      }
      return newData;
    });
  };

  const adjustPrices = (percentage: number, sectionKey?: string, categoryIndex?: number) => {
    const multiplier = 1 + percentage / 100;
    
    updateMenuData(prev => {
      const newData = deepClone(prev);
      
      const adjustSection = (section: MenuSection, catIndex?: number) => {
        section.categories.forEach((category, idx) => {
          if (catIndex === undefined || catIndex === idx) {
            category.items = category.items.map(item => adjustItemPrices(item, multiplier));
          }
        });
      };

      if (sectionKey) {
        const section = newData[sectionKey as keyof MenuData];
        if (section) {
          adjustSection(section, categoryIndex);
        }
      } else {
        (Object.keys(newData) as Array<keyof MenuData>).forEach(key => adjustSection(newData[key]));
      }
      
      return newData;
    });
  };

  const resetToOriginal = () => {
    const originalData: MenuData = {
      snacksAndStarters: deepClone(snacksAndStarters),
      foodMenu: deepClone(foodMenu),
      beveragesMenu: deepClone(beveragesMenu),
      sideItems: deepClone(sideItems),
    };
    setMenuData(originalData);
    saveMenuData(originalData);
  };

  return (
    <MenuContext.Provider value={{ menuData, isEditMode, setIsEditMode, updateMenuItem, addMenuItem, deleteMenuItem, adjustPrices, resetToOriginal }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
