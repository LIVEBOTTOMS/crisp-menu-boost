import { useState, useEffect } from "react";
import { MenuHeader } from "@/components/MenuHeader";
import { MenuNavigation } from "@/components/MenuNavigation";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { MenuToolbar } from "@/components/MenuToolbar";
import { MenuProvider, useMenu } from "@/contexts/MenuContext";

const MenuContent = () => {
  const [activeSection, setActiveSection] = useState("snacks");
  const [showToolbar, setShowToolbar] = useState(false);
  const { menuData, isLoading } = useMenu();

  // Keyboard shortcut: Ctrl+Shift+A to toggle toolbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowToolbar(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "snacks":
        return <MenuSection section={menuData.snacksAndStarters} variant="cyan" sectionKey="snacksAndStarters" />;
      case "food":
        return <MenuSection section={menuData.foodMenu} variant="magenta" sectionKey="foodMenu" />;
      case "beverages":
        return <MenuSection section={menuData.beveragesMenu} variant="cyan" sectionKey="beveragesMenu" />;
      case "sides":
        return <MenuSection section={menuData.sideItems} variant="gold" sectionKey="sideItems" />;
      default:
        return <MenuSection section={menuData.snacksAndStarters} variant="cyan" sectionKey="snacksAndStarters" />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />
      {showToolbar && <MenuToolbar />}
      
      <div className="relative z-10">
        <MenuHeader />
        <MenuNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="max-w-6xl mx-auto px-4 pb-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <span className="ml-3 text-muted-foreground">Loading menu...</span>
            </div>
          ) : (
            renderActiveSection()
          )}
        </main>

        <footer className="border-t border-border/30 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="font-rajdhani text-muted-foreground text-sm tracking-wide">
              © 2024 LIVE BAR • Fine Dining & Premium Spirits
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-neon-cyan/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-neon-gold/50" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-neon-magenta/50" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <MenuProvider>
      <MenuContent />
    </MenuProvider>
  );
};

export default Index;
