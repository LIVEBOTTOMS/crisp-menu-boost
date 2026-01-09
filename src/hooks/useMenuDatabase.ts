import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuSection, MenuItem, snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";
import { Json } from "@/integrations/supabase/types";
type MenuSectionType = 'snacks' | 'food' | 'beverages' | 'sides';

interface DbMenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  half_price: number | null;
  full_price: number | null;
  sizes: string[] | null;
  display_order: number;
  image_url: string | null;
  is_best_seller: boolean;
  is_chef_special: boolean;
  is_new: boolean;
  is_veg: boolean;
  is_spicy: boolean;
  is_premium: boolean;
  is_top_shelf: boolean;
}

interface DbCategory {
  id: string;
  section_id: string;
  title: string;
  icon: string | null;
  display_order: number;
  menu_items: DbMenuItem[];
}

interface DbSection {
  id: string;
  type: MenuSectionType;
  title: string;
  display_order: number;
  menu_categories: DbCategory[];
}

const formatPrice = (value: number | null): string | undefined => {
  if (value === null) return undefined;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const parsePrice = (price: string | undefined): number | null => {
  if (!price) return null;
  return parseFloat(price.replace(/[₹,]/g, "")) || null;
};

const dbToMenuItem = (item: DbMenuItem): MenuItem => ({
  name: item.name,
  description: item.description || undefined,
  price: formatPrice(item.price),
  halfPrice: formatPrice(item.half_price),
  fullPrice: formatPrice(item.full_price),
  sizes: item.sizes || undefined,
  image: item.image_url || undefined,
  isBestSeller: item.is_best_seller,
  isChefSpecial: item.is_chef_special,
  isNew: item.is_new,
  isVeg: item.is_veg,
  isSpicy: item.is_spicy,
  isPremium: item.is_premium,
  isTopShelf: item.is_top_shelf,
});

const dbToMenuSection = (section: DbSection): MenuSection => ({
  title: section.title,
  categories: section.menu_categories
    .sort((a, b) => a.display_order - b.display_order)
    .map(cat => ({
      title: cat.title,
      icon: cat.icon || undefined,
      items: cat.menu_items
        .sort((a, b) => a.display_order - b.display_order)
        .map(dbToMenuItem),
    })),
});

export const useMenuDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeded, setIsSeeded] = useState(false);

  const fetchMenuData = async (venueSlug?: string) => {
    console.log("📥 [FETCH] Fetching menu data for venueSlug:", venueSlug);

    // Simple query - get ALL menu sections with their categories and items
    const { data: sections, error } = await supabase
      .from("menu_sections")
      .select(`
        id, type, title, display_order, venue_id,
        menu_categories (
          id, section_id, title, icon, display_order,
          menu_items (
            id, category_id, name, description, price, half_price, full_price, sizes, display_order, image_url,
            is_best_seller, is_chef_special, is_new, is_veg, is_spicy, is_premium, is_top_shelf
          )
        )
      `)
      .order("display_order");

    if (error) {
      console.error("❌ [FETCH ERROR]", error);
      return null;
    }

    console.log("📥 [FETCH RESULT] Found sections:", sections?.length, sections?.map(s => ({ type: s.type, venue_id: s.venue_id })));

    if (!sections || sections.length === 0) {
      console.log("⚠️ [FETCH] No sections in database - returning null (will use static data)");
      return null;
    }

    // Log first item price to verify data
    const firstSection = sections[0] as any;
    const firstCategory = firstSection?.menu_categories?.[0];
    const firstItem = firstCategory?.menu_items?.[0];
    console.log("📥 [FETCH SAMPLE] First item:", firstItem?.name, "price:", firstItem?.price);

    const typedSections: any = sections;
    const sectionMap: Record<MenuSectionType, MenuSection | null> = {
      snacks: null,
      food: null,
      beverages: null,
      sides: null,
    };

    typedSections.forEach((section: DbSection) => {
      sectionMap[section.type] = dbToMenuSection(section);
    });

    const result = {
      snacksAndStarters: sectionMap.snacks || snacksAndStarters,
      foodMenu: sectionMap.food || foodMenu,
      beveragesMenu: sectionMap.beverages || beveragesMenu,
      sideItems: sectionMap.sides || sideItems,
    };

    // Log if we're using static data fallback
    if (!sectionMap.snacks) console.log("⚠️ [FETCH] Using STATIC snacksAndStarters");
    if (!sectionMap.food) console.log("⚠️ [FETCH] Using STATIC foodMenu");
    if (!sectionMap.beverages) console.log("⚠️ [FETCH] Using STATIC beveragesMenu");
    if (!sectionMap.sides) console.log("⚠️ [FETCH] Using STATIC sideItems");

    return result;
  };

  const seedDatabase = async (priceMap?: Map<string, any>, sourceData?: any, venueId?: string) => {
    const sectionsData: { type: MenuSectionType; title: string; display_order: number; data: MenuSection }[] = sourceData ? [
      { type: 'snacks' as MenuSectionType, title: sourceData.snacksAndStarters?.title || "ARTISAN APPETIZERS", display_order: 0, data: sourceData.snacksAndStarters },
      { type: 'food' as MenuSectionType, title: sourceData.foodMenu?.title || "GLOBAL MAINS", display_order: 1, data: sourceData.foodMenu },
      { type: 'beverages' as MenuSectionType, title: sourceData.beveragesMenu?.title || "CRAFT LIBATIONS", display_order: 2, data: sourceData.beveragesMenu },
      { type: 'sides' as MenuSectionType, title: sourceData.sideItems?.title || "ARTISAN SIDES", display_order: 3, data: sourceData.sideItems },
    ].filter(s => s.data) : [
      { type: 'snacks' as MenuSectionType, title: snacksAndStarters.title, display_order: 0, data: snacksAndStarters },
      { type: 'food' as MenuSectionType, title: foodMenu.title, display_order: 1, data: foodMenu },
      { type: 'beverages' as MenuSectionType, title: beveragesMenu.title, display_order: 2, data: beveragesMenu },
      { type: 'sides' as MenuSectionType, title: sideItems.title, display_order: 3, data: sideItems },
    ];

    for (const section of sectionsData) {
      // Insert section
      const { data: sectionResult, error: sectionError } = await supabase
        .from("menu_sections")
        .insert({
          type: section.type,
          title: section.title,
          display_order: section.display_order,
          venue_id: venueId || null
        })
        .select()
        .single();

      if (sectionError) {
        console.error("Error inserting section:", sectionError);
        continue;
      }

      // Insert categories
      for (let catIdx = 0; catIdx < section.data.categories.length; catIdx++) {
        const category = section.data.categories[catIdx];

        const { data: catResult, error: catError } = await supabase
          .from("menu_categories")
          .insert({
            section_id: sectionResult.id,
            title: category.title,
            icon: category.icon || null,
            display_order: catIdx,
          })
          .select()
          .single();

        if (catError) {
          console.error("Error inserting category:", catError);
          continue;
        }

        // Insert items
        const itemsToInsert = category.items.map((item, idx) => {
          const existing = priceMap?.get(item.name);
          return {
            category_id: catResult.id,
            name: item.name,
            description: item.description || null,
            price: existing ? existing.price : parsePrice(item.price),
            half_price: existing ? existing.half_price : parsePrice(item.halfPrice),
            full_price: existing ? existing.full_price : parsePrice(item.fullPrice),
            sizes: existing ? existing.sizes : (item.sizes || null),
            display_order: idx,
            image_url: item.image || null,
            is_best_seller: item.isBestSeller || false,
            is_chef_special: item.isChefSpecial || false,
            is_new: item.isNew || false,
            is_veg: item.isVeg || false,
            is_spicy: item.isSpicy || false,
            is_premium: item.isPremium || false,
            is_top_shelf: item.isTopShelf || false,
          };
        });

        const { error: itemsError } = await supabase
          .from("menu_items")
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error inserting items:", itemsError);
        }
      }
    }

    setIsSeeded(true);
  };

  const updateMenuItem = async (
    sectionType: MenuSectionType,
    categoryIndex: number,
    itemIndex: number,
    updatedItem: MenuItem,
    venueSlug?: string
  ) => {
    console.log("🔵 [UPDATE START] updateMenuItem called:", {
      sectionType,
      categoryIndex,
      itemIndex,
      itemName: updatedItem.name,
      newPrice: updatedItem.price,
      venueSlug
    });

    // Simple approach: just get the section by type
    // If there's only one menu, this works. If multiple, we'll need to handle it differently
    const { data: sections, error: sectionError } = await supabase
      .from("menu_sections")
      .select("id, venue_id")
      .eq("type", sectionType);

    console.log("🔵 [SECTION QUERY]", { sections, sectionError, sectionType });

    if (sectionError || !sections || sections.length === 0) {
      console.error("❌ [ERROR] Section not found for type:", sectionType);
      throw new Error(`Section not found for type: ${sectionType}`);
    }

    // Use first matching section (or filter by venue if needed later)
    const section = sections[0];
    console.log("🔵 [USING SECTION]", section);

    // Get the category
    const { data: categories } = await supabase
      .from("menu_categories")
      .select("id")
      .eq("section_id", section.id)
      .order("display_order");

    if (!categories || !categories[categoryIndex]) {
      console.error("Category not found at index:", categoryIndex, categories);
      return;
    }

    // Get the item
    const { data: items } = await supabase
      .from("menu_items")
      .select("id")
      .eq("category_id", categories[categoryIndex].id)
      .order("display_order");

    if (!items || !items[itemIndex]) {
      console.error("Item not found at index:", itemIndex, items);
      return;
    }

    const updatePayload = {
      name: updatedItem.name,
      description: updatedItem.description || null,
      price: parsePrice(updatedItem.price),
      half_price: parsePrice(updatedItem.halfPrice),
      full_price: parsePrice(updatedItem.fullPrice),
      sizes: updatedItem.sizes || null,
      image_url: updatedItem.image || null,
      is_best_seller: updatedItem.isBestSeller || false,
      is_chef_special: updatedItem.isChefSpecial || false,
      is_new: updatedItem.isNew || false,
      is_veg: updatedItem.isVeg || false,
      is_spicy: updatedItem.isSpicy || false,
      is_premium: updatedItem.isPremium || false,
      is_top_shelf: updatedItem.isTopShelf || false,
    };

    console.log("🔵 [DATABASE UPDATE] Updating item ID:", items[itemIndex].id);
    console.log("🔵 [UPDATE PAYLOAD]", updatePayload);

    // Update the item
    const { data: updateResult, error } = await supabase
      .from("menu_items")
      .update(updatePayload)
      .eq("id", items[itemIndex].id)
      .select(); // Get the updated row back

    if (error) {
      console.error("❌ [DATABASE ERROR]", error);
      throw error; // Throw error so context can handle it
    } else {
      console.log("✅ [DATABASE SUCCESS] Item updated:", updateResult);
      console.log("✅ [VERIFY] Updated price in DB:", updateResult?.[0]?.price);
    }
  };

  const checkAndSeed = async () => {
    setIsLoading(true);
    const data = await fetchMenuData();

    if (!data) {
      await seedDatabase();
    }

    setIsLoading(false);
  };

  const resetDatabase = async (preservePrices: boolean = true) => {
    setIsLoading(true);
    try {
      // Auto-archive before reset to prevent data loss
      await archiveCurrentMenu("Auto-archive before reset");

      let priceMap = new Map<string, any>();

      if (preservePrices) {
        // Fetch current prices to preserve
        const { data: currentItems } = await supabase
          .from('menu_items')
          .select('name, price, half_price, full_price, sizes');

        if (currentItems) {
          currentItems.forEach(item => {
            priceMap.set(item.name, item);
          });
        }
      }

      // Delete in order to respect foreign keys
      await supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
      await supabase.from("menu_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("menu_sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      await seedDatabase(priceMap);
      return true;
    } catch (error) {
      console.error("Error resetting database:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Archive current menu before making changes
  const archiveCurrentMenu = async (notes?: string): Promise<boolean> => {
    try {
      const currentData = await fetchMenuData();
      if (!currentData) {
        console.error('No menu data to archive');
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('archived_menus')
        .insert({
          menu_data: currentData as unknown as Json,
          archived_by: user?.id || null,
          notes: notes || 'Menu updated'
        });

      if (error) {
        console.error('Error archiving menu:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in archiveCurrentMenu:', error);
      return false;
    }
  };

  // Fetch archived menus
  const fetchArchivedMenus = async () => {
    const { data, error } = await supabase
      .from('archived_menus')
      .select('*')
      .order('archived_at', { ascending: false });

    if (error) {
      console.error('Error fetching archived menus:', error);
      return [];
    }

    return data || [];
  };

  const restoreDatabase = async (menuData: any) => {
    setIsLoading(true);
    try {
      // Archive current before restore
      await archiveCurrentMenu("Auto-archive before restore");

      // Wipe
      await supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("menu_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("menu_sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Seed with ARCHIVED data
      await seedDatabase(undefined, menuData);
      return true;
    } catch (error) {
      console.error("Error restoring database:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adjustPricesInDb = async (percentage: number, sectionType?: MenuSectionType) => {
    try {
      // 1. Fetch all items that need adjustment
      let query = supabase
        .from("menu_items")
        .select(`
          id, name, price, half_price, full_price, sizes,
          menu_categories!inner(
            id, section_id,
            menu_sections!inner(id, type)
          )
        `);

      if (sectionType) {
        query = query.eq('menu_categories.menu_sections.type', sectionType);
      }

      const { data: items, error: fetchError } = await query;

      const typedItems: any = items;

      if (fetchError) throw fetchError;
      if (!typedItems || typedItems.length === 0) return true;

      const multiplier = 1 + percentage / 100;

      // 2. Prepare adjusted items for batch update (upsert)
      const adjustedItems = typedItems.map((item: any) => ({
        id: item.id,
        price: item.price ? Math.round(item.price * multiplier) : null,
        half_price: item.half_price ? Math.round(item.half_price * multiplier) : null,
        full_price: item.full_price ? Math.round(item.full_price * multiplier) : null,
        sizes: item.sizes ? item.sizes.map((sizeStr: string) => {
          const numMatch = sizeStr.match(/[\d,]+/);
          if (!numMatch) return sizeStr;
          const num = parseFloat(numMatch[0].replace(/,/g, ""));
          const adjusted = Math.round(num * multiplier);
          return sizeStr.replace(numMatch[0], adjusted.toLocaleString("en-IN"));
        }) : null
      }));

      // 3. Batch update using upsert
      const { error: updateError } = await supabase
        .from("menu_items")
        .upsert(adjustedItems);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error("Error adjusting prices in DB:", error);
      return false;
    }
  };

  return {
    fetchMenuData,
    updateMenuItem,
    checkAndSeed,
    archiveCurrentMenu,
    resetDatabase,
    restoreDatabase,
    fetchArchivedMenus,
    adjustPricesInDb,
    isLoading,
    isSeeded,
    supabase,
  };
};

export const sectionKeyToType = (key: string): MenuSectionType => {
  const map: Record<string, MenuSectionType> = {
    snacksAndStarters: 'snacks',
    foodMenu: 'food',
    beveragesMenu: 'beverages',
    sideItems: 'sides',
  };
  return map[key] || 'snacks';
};