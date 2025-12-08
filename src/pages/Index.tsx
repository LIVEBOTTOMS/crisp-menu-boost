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
      
      {/* Outer decorative frame */}
      <div className="relative z-10 min-h-screen mx-auto max-w-6xl">
        {/* Premium border frame */}
        <div className="absolute inset-x-4 inset-y-0 border-x border-primary/20 pointer-events-none" />
        <div className="absolute inset-x-6 inset-y-0 border-x border-primary/10 pointer-events-none" />
        
        {/* Top decorative border */}
        <div className="relative h-4 bg-gradient-to-r from-transparent via-primary/15 to-transparent">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
        
        {/* Admin Button */}
        <Link 
          to={user ? "/admin" : "/auth"} 
          className="fixed top-6 right-6 z-50 p-2.5 bg-background/90 backdrop-blur-sm border border-primary/35 hover:border-primary hover:bg-primary/10 transition-all duration-300 no-print group"
          title="Admin Settings"
        >
          <Settings className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-500" />
        </Link>
        
        <MenuHeader />
        <MenuNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="px-8 md:px-12 pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border border-primary/20"></div>
              </div>
              <span className="ml-4 text-muted-foreground font-cormorant text-lg tracking-wide">Loading menu...</span>
            </div>
          ) : (
            renderActiveSection()
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-14">
          <div className="px-8 md:px-12">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />
              <div className="flex gap-2 items-center">
                <div className="w-1 h-1 rotate-45 bg-primary/30" />
                <div className="w-2 h-2 rotate-45 border border-primary/50" />
                <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
                <div className="w-2 h-2 rotate-45 border border-primary/50" />
                <div className="w-1 h-1 rotate-45 bg-primary/30" />
              </div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent via-primary/30 to-primary/50" />
            </div>
            
            <div className="text-center space-y-3">
              <p className="font-cormorant text-lg text-muted-foreground tracking-widest italic">
                Thank you for dining with us
              </p>
              <p className="font-cinzel text-foreground/85 text-base tracking-[0.3em]">
                LIVE BAR
              </p>
              <p className="font-montserrat text-muted-foreground/55 text-xs tracking-[0.2em]">
                © 2024 • Fine Dining & Premium Spirits
              </p>
            </div>
          </div>
        </footer>
        
        {/* Bottom decorative border */}
        <div className="relative h-4 bg-gradient-to-r from-transparent via-primary/15 to-transparent">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Index;
