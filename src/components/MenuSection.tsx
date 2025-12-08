import { MenuSection as MenuSectionType } from "@/data/menuData";
import { MenuCategory } from "./MenuCategory";

interface MenuSectionProps {
  section: MenuSectionType;
  variant?: "cyan" | "magenta" | "gold";
  sectionKey: string;
}

export const MenuSection = ({ section, sectionKey }: MenuSectionProps) => {
  return (
    <section className="mb-20 animate-slide-up">
      {/* Elegant Section Title */}
      <div className="text-center mb-14">
        <div className="inline-block relative">
          {/* Top decorative flourish */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/60" />
              <div className="w-1.5 h-1.5 rotate-45 bg-primary/50" />
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="w-1 h-1 rotate-45 bg-primary/40" />
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-primary/70 bg-primary/10" />
              <div className="w-1 h-1 rotate-45 bg-primary/40" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-primary/50" />
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/60" />
            </div>
          </div>
          
          <h2 className="font-cinzel text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.25em] uppercase text-shimmer">
            {section.title}
          </h2>
          
          {/* Bottom decorative flourish */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-primary/40" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rotate-45 bg-primary/30" />
              <div className="w-2 h-2 rotate-45 border border-primary/50" />
              <div className="w-1 h-1 rotate-45 bg-primary/30" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-border to-primary/40" />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {(() => {
        const hasSizedItems = section.categories.some(cat => cat.items.some(item => item.sizes && item.sizes.length > 0));
        const gridClass = hasSizedItems || section.categories.length <= 2
          ? section.categories.length >= 2 ? "md:grid-cols-2" : "max-w-2xl mx-auto"
          : section.categories.length >= 3 
            ? "md:grid-cols-2 lg:grid-cols-3" 
            : "max-w-2xl mx-auto";
        return (
          <div className={`grid gap-8 lg:gap-10 ${gridClass}`}>
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
