import { cn } from "@/lib/utils";

interface MenuNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: "snacks", label: "Snacks & Starters" },
  { id: "food", label: "Food Menu" },
  { id: "beverages", label: "Beverages & Spirits" },
  { id: "sides", label: "Sides & Refreshments" },
];

export const MenuNavigation = ({ activeSection, onSectionChange }: MenuNavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "px-4 py-2 rounded-sm font-rajdhani text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap",
                activeSection === section.id
                  ? "bg-gradient-neon text-primary-foreground shadow-[0_0_20px_hsl(180_100%_50%/0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
