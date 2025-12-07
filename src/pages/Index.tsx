import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { MenuHeader } from "@/components/MenuHeader";
import { MenuNavigation } from "@/components/MenuNavigation";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeSection, setActiveSection] = useState("snacks");
  const { menuData, isLoading } = useMenu();
  const { user } = useAuth();

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
      
      {/* Outer decorative border for print */}
      <div className="relative z-10 min-h-screen border-x-2 border-primary/20 mx-auto max-w-6xl">
        {/* Top border line */}
        <div className="h-2 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
        
        {/* Admin Button */}
        <Link 
          to={user ? "/admin" : "/auth"} 
          className="fixed top-4 right-4 z-50 p-2 rounded-sm bg-background/90 backdrop-blur-sm border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 no-print"
          title="Admin Settings"
        >
          <Settings className="w-5 h-5 text-primary" />
        </Link>
        
        <MenuHeader />
        <MenuNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="px-6 md:px-10 pb-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground font-cormorant">Loading menu...</span>
            </div>
          ) : (
            renderActiveSection()
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-10">
          <div className="px-6 md:px-10">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
              <div className="flex gap-1">
                <div className="w-1 h-1 rotate-45 bg-primary/30" />
                <div className="w-1.5 h-1.5 rotate-45 border border-primary/50" />
                <div className="w-1 h-1 rotate-45 bg-primary/30" />
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            
            <div className="text-center">
              <p className="font-cormorant text-muted-foreground text-base tracking-wider italic">
                Thank you for dining with us
              </p>
              <p className="font-cinzel text-foreground/80 text-sm tracking-[0.2em] mt-2">
                LIVE BAR
              </p>
              <p className="font-montserrat text-muted-foreground/60 text-xs tracking-[0.15em] mt-1">
                © 2024 • Fine Dining & Premium Spirits
              </p>
            </div>
          </div>
        </footer>
        
        {/* Bottom border line */}
        <div className="h-2 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
      </div>
    </div>
  );
};

export default Index;
