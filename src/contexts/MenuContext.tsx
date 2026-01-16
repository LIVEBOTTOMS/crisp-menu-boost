import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MenuItem, MenuSection, snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";
import { useMenuDatabase, sectionKeyToType } from "@/hooks/useMenuDatabase";
import { getVenueConfig } from "@/config/venueConfig";

interface MenuData {
  snacksAndStarters: MenuSection;
  foodMenu: MenuSection;
  beveragesMenu: MenuSection;
  sideItems: MenuSection;
}

interface MenuContextType {
  menuData: MenuData;
  venueData: any | null;
  isEditMode: boolean;
  isLoading: boolean;
  activeVenueSlug: string | null;
  setActiveVenueSlug: (slug: string | null) => void;
  setIsEditMode: (value: boolean) => void;
  updateMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => void;
  addMenuItem: (sectionKey: string, categoryIndex: number, newItem: MenuItem) => void;
  deleteMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number) => void;
  adjustPrices: (percentage: number, sectionKey?: string, categoryIndex?: number, venueSlug?: string) => Promise<void>;
  refreshMenu: () => Promise<void>;
  resetDatabase: (venueSlug?: string) => Promise<boolean>;
  restoreDatabase: (menuData: any, venueSlug?: string) => Promise<boolean>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[₹,]/g, "")) || 0;
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

const tagItemsWithDietary = (section: MenuSection): MenuSection => {
  const newSection = deepClone(section);
  newSection.categories.forEach(category => {
    const title = category.title.toUpperCase();
    let defaultDietary: MenuItem['dietary'] = undefined;

    // Improved detection logic
    if (title.includes('VEG') && !title.includes('NON')) {
      defaultDietary = 'veg';
    } else if (
      title.includes('NON-VEG') ||
      title.includes('NON VEG') ||
      title.includes('CHICKEN') ||
      title.includes('MUTTON') ||
      title.includes('FISH') ||
      title.includes('EGG') ||
      title.includes('MEAT') ||
      title.includes('POULTRY')
    ) {
      defaultDietary = 'non-veg';
    } else if (
      title.includes('BEVERAGE') ||
      title.includes('DRINK') ||
      title.includes('BEER') ||
      title.includes('VODKA') ||
      title.includes('WHISKY') ||
      title.includes('WHISKEY') ||
      title.includes('WINE') ||
      title.includes('RUM') ||
      title.includes('GIN') ||
      title.includes('COCKTAIL') ||
      title.includes('MOCKTAIL') ||
      title.includes('WATER') ||
      title.includes('SODA')
    ) {
      defaultDietary = 'veg';
    }

    category.items.forEach(item => {
      // Fix: Check for undefined, null, OR empty string
      if ((!item.dietary || item.dietary === '') && defaultDietary) {
        item.dietary = defaultDietary;
      }
    });
  });
  return newSection;
};

const getDefaultMenuData = (): MenuData => ({
  snacksAndStarters: tagItemsWithDietary(deepClone(snacksAndStarters)),
  foodMenu: tagItemsWithDietary(deepClone(foodMenu)),
  beveragesMenu: tagItemsWithDietary(deepClone(beveragesMenu)),
  sideItems: tagItemsWithDietary(deepClone(sideItems)),
});

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuData, setMenuData] = useState<MenuData>(getDefaultMenuData);
  const [venueData, setVenueData] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVenueSlug, setActiveVenueSlug] = useState<string | null>(null);

  const {
    fetchMenuData,
    updateMenuItem: dbUpdateMenuItem,
    checkAndSeed,
    archiveCurrentMenu,
    resetDatabase: dbResetDatabase,
    restoreDatabase: dbRestoreDatabase,
    adjustPricesInDb,
    supabase
  } = useMenuDatabase();

  const refreshMenu = async () => {
    console.log("🔄 [REFRESH] Fetching menu from database for venue:", activeVenueSlug);
    const data = await fetchMenuData(activeVenueSlug || undefined);
    if (data) {
      console.log("🔄 [REFRESH] Setting new menu data with auto-tagging");
      const taggedData: MenuData = {
        snacksAndStarters: tagItemsWithDietary(data.snacksAndStarters),
        foodMenu: tagItemsWithDietary(data.foodMenu),
        beveragesMenu: tagItemsWithDietary(data.beveragesMenu),
        sideItems: tagItemsWithDietary(data.sideItems),
      };
      setMenuData(taggedData);
    } else {
      console.log("⚠️ [REFRESH] No data returned from fetchMenuData");
    }
  };

  const refreshVenue = async () => {
    if (!activeVenueSlug) {
      setVenueData(null);
      return;
    }

    const { data, error } = await supabase
      .from('venues' as any)
      .select('*')
      .eq('slug', activeVenueSlug)
      .single();

    if (data) setVenueData(data);
  };

  const resetDatabase = async (venueSlug?: string) => {
    const success = await dbResetDatabase(venueSlug, false);
    if (success) {
      await refreshMenu();
    }
    return success;
  };

  const restoreDatabase = async (menuData: any, venueSlug?: string) => {
    const success = await dbRestoreDatabase(menuData, venueSlug);
    if (success) {
      await refreshMenu();
    }
    return success;
  };

  // Real-time Sync Effect
  useEffect(() => {
    const channel = supabase
      .channel('menu-global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => refreshMenu())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, () => refreshMenu())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_sections' }, () => refreshMenu())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'venues' }, () => refreshVenue())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeVenueSlug]);

  // Track if initial seed check is done
  const [seedChecked, setSeedChecked] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Only check seed once per session
        if (!seedChecked) {
          await checkAndSeed();
          setSeedChecked(true);
        }

        // Fetch menu and venue data in parallel for speed
        await Promise.all([refreshMenu(), refreshVenue()]);
      } catch (error) {
        console.error("Failed to initialize menu database:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [activeVenueSlug]);

  const updateMenuItem = async (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => {
    console.log("🟢 [CONTEXT] updateMenuItem called", {
      sectionKey,
      categoryIndex,
      itemIndex,
      itemName: updatedItem.name,
      newPrice: updatedItem.price,
      activeVenueSlug
    });

    // Helper to ensure price is properly formatted
    const formatPrice = (price: string | undefined): string | undefined => {
      if (!price) return undefined;
      // Remove ₹ and commas, then re-format
      const numPrice = parseFloat(price.replace(/[₹,]/g, ''));
      if (isNaN(numPrice)) return undefined;
      return `₹${Math.round(numPrice).toLocaleString("en-IN")}`;
    };

    // Create properly formatted item for local state
    const formattedItem = {
      ...updatedItem,
      price: formatPrice(updatedItem.price),
      halfPrice: formatPrice(updatedItem.halfPrice),
      fullPrice: formatPrice(updatedItem.fullPrice),
    };

    // Update local state with formatted prices for immediate UI feedback
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        const oldItem = section.categories[categoryIndex].items[itemIndex];
        section.categories[categoryIndex].items[itemIndex] = formattedItem;
        console.log("🟢 [LOCAL STATE] Updated:", {
          from: { name: oldItem.name, price: oldItem.price },
          to: { name: formattedItem.name, price: formattedItem.price }
        });
      }
      return newData;
    });

    // Then update database with venue context
    try {
      console.log("🟢 [CALLING DB] Sending to database...");
      await dbUpdateMenuItem(
        sectionKeyToType(sectionKey),
        categoryIndex,
        itemIndex,
        updatedItem,
        activeVenueSlug || undefined
      );
      console.log("✅ [CONTEXT SUCCESS] Database update completed");
      // No need to refresh - prices are already formatted in local state above
    } catch (error) {
      console.error("❌ [CONTEXT ERROR] Failed to update menu item in database:", error);
      // Revert the local state change if database update fails
      console.log("🔄 [REVERTING] Refreshing from database...");
      await refreshMenu();
      throw error; // Re-throw so calling component can show error
    }
  };

  const addMenuItem = (sectionKey: string, categoryIndex: number, newItem: MenuItem) => {
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.push(newItem);
      }
      return newData;
    });
  };

  const deleteMenuItem = (sectionKey: string, categoryIndex: number, itemIndex: number) => {
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.splice(itemIndex, 1);
      }
      return newData;
    });
  };

  const adjustPrices = async (percentage: number, sectionKey?: string, categoryIndex?: number, venueSlug?: string) => {
    const config = getVenueConfig();
    const identifier = (venueSlug || activeVenueSlug || config.name).toLowerCase();
    const shouldArchive = identifier.includes('live');

    if (shouldArchive) {
      await archiveCurrentMenu(`Price adjustment: ${percentage > 0 ? '+' : ''}${percentage}%`);
    }

    const multiplier = 1 + percentage / 100;

    setMenuData(prev => {
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
        if (section) adjustSection(section, categoryIndex);
      } else {
        (Object.keys(newData) as Array<keyof MenuData>).forEach(key => adjustSection(newData[key]));
      }
      return newData;
    });

    await adjustPricesInDb(percentage, sectionKey ? sectionKeyToType(sectionKey) : undefined);
    await refreshMenu();
  };

  return (
    <MenuContext.Provider value={{
      menuData,
      venueData,
      isEditMode,
      isLoading,
      activeVenueSlug,
      setActiveVenueSlug,
      setIsEditMode,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      adjustPrices,
      refreshMenu,
      resetDatabase,
      restoreDatabase
    }}>
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