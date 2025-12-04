import { MenuSection as MenuSectionType } from "@/data/menuData";
import { MenuCategory } from "./MenuCategory";

interface MenuSectionProps {
  section: MenuSectionType;
  variant?: "cyan" | "magenta" | "gold";
  sectionKey: string;
}

export const MenuSection = ({ section, variant = "cyan", sectionKey }: MenuSectionProps) => {
  return (
    <section className="mb-12 animate-slide-up">
      {/* Premium Section Title */}
      <div className="text-center mb-10">
        <div className="inline-block relative">
          <h2 className={`font-cinzel text-xl md:text-2xl font-semibold tracking-[0.2em] uppercase ${
            variant === "cyan" ? "text-glow-cyan text-primary" :
            variant === "magenta" ? "text-glow-magenta text-secondary" :
            "text-glow-gold text-accent"
          }`}>
            {section.title}
          </h2>
          {/* Elegant underline decoration */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/60" />
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border border-primary/40 rotate-45" />
              <div className="absolute inset-1.5 bg-primary/10 rotate-45" />
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-secondary/60" />
          </div>
        </div>
      </div>

      {/* Categories Grid - max 2 columns for items with sizes to prevent cramped names */}
      {(() => {
        const hasSizedItems = section.categories.some(cat => cat.items.some(item => item.sizes && item.sizes.length > 0));
        const gridClass = hasSizedItems || section.categories.length <= 2
          ? section.categories.length >= 2 ? "md:grid-cols-2" : "max-w-2xl mx-auto"
          : section.categories.length >= 3 
            ? "md:grid-cols-2 lg:grid-cols-3" 
            : "max-w-2xl mx-auto";
        return (
          <div className={`grid gap-8 ${gridClass}`}>
            {section.categories.map((category, index) => (
              <MenuCategory 
                key={category.title} 
                category={category} 
                index={index}
                sectionKey={sectionKey}
              />
            ))}
          </div>
        );
      })()}
    </section>
  );
};
