import { cn } from "@/lib/utils";

interface MenuNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: "snacks", label: "Snacks & Starters", icon: "🍽" },
  { id: "food", label: "Food Menu", icon: "🍛" },
  { id: "beverages", label: "Beverages & Spirits", icon: "🥃" },
  { id: "sides", label: "Sides & Refreshments", icon: "🍹" },
];

export const MenuNavigation = ({ activeSection, onSectionChange }: MenuNavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/[0.97] backdrop-blur-lg border-y border-primary/20 mb-12">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="px-4 md:px-10">
        <div className="flex items-center justify-center gap-1 md:gap-2 py-5 overflow-x-auto scrollbar-hide">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "relative px-4 md:px-6 py-2.5 font-cinzel text-[10px] md:text-xs font-medium tracking-[0.2em] transition-all duration-400 whitespace-nowrap uppercase group",
                  activeSection === section.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active indicator - elegant underline */}
                {activeSection === section.id && (
                  <>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rotate-45 bg-primary" />
                  </>
                )}
                
                {/* Hover underline */}
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary/50 transition-all duration-300",
                  activeSection === section.id ? "w-0" : "w-0 group-hover:w-1/2"
                )} />
                
                {section.label}
              </button>
              
              {/* Elegant separator */}
              {index < sections.length - 1 && (
                <div className="flex items-center mx-1 md:mx-3">
                  <div className="w-1 h-1 rotate-45 bg-primary/30 hidden md:block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    </nav>
  );
};
