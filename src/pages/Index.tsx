import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuHeader } from "@/components/MenuHeader";
import { MenuNavigation } from "@/components/MenuNavigation";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { MenuToolbar } from "@/components/MenuToolbar";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("snacks");
  const [showToolbar, setShowToolbar] = useState(false);
  const { menuData, isLoading, isEditMode } = useMenu();
  const { user } = useAuth();

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
      
      {/* Admin Link */}
      <Link 
        to={user ? "/admin" : "/auth"}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-800/80 border border-purple-500/30 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        title={user ? "Admin Dashboard" : "Admin Login"}
      >
        <Settings className="h-5 w-5" />
      </Link>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-orange-600/90 text-white rounded-full text-sm font-medium">
          Edit Mode Active
        </div>
      )}
      
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

export default Index;
