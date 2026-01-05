import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { MenuHeader } from "@/components/MenuHeader";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { PremiumBorderFrame, PremiumSectionHeader } from "@/components/premium";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";
import { getVenueConfig } from "@/config/venueConfig";
import { supabase } from "@/integrations/supabase/client";

interface VenueData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  subtitle: string | null;
  logo_text: string | null;
  logo_subtext: string | null;
  city: string | null;
}

const getSectionIntro = (title: string): string => {
  const t = title.toUpperCase();
  if (t.includes("WHISKY") || t.includes("WHISKEY")) return "A curated journey through the world's finest distilleries.";
  if (t.includes("VODKA") || t.includes("SPIRIT") || t.includes("RUM") || t.includes("GIN")) return "Pure, distinct, and crafted for the bold.";
  if (t.includes("BEER") || t.includes("BREW")) return "Crisp, refreshing, and perfectly poured.";
  if (t.includes("APPETIZER") || t.includes("STARTER") || t.includes("SNACK")) return "Small plates, bold flavors—the perfect beginning.";
  if (t.includes("MAIN") || t.includes("Course")) return "Hearty, soulful dishes crafted with passion.";
  if (t.includes("REFRESH") || t.includes("BEVERAGE")) return "Cool, crisp, and revitalizing.";
  if (t.includes("PREMIUM") || t.includes("RESERVE")) return "Exclusive pours for the distinguished palate.";
  if (t.includes("SIDE") || t.includes("DESSERT")) return "The perfect companions to your meal.";
  return "Experience the taste of excellence.";
};

const Index = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [activeSection, setActiveSection] = useState("snacks");
  const { menuData, isLoading } = useMenu();
  const { user } = useAuth();
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [isLoadingVenue, setIsLoadingVenue] = useState(false);

  // For default LIVE menu (no slug in URL)
  const defaultVenue = getVenueConfig();

  useEffect(() => {
    if (slug) {
      // Load venue-specific data
      loadVenueData(slug);
    }
  }, [slug]);

  const loadVenueData = async (venueSlug: string) => {
    setIsLoadingVenue(true);
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('slug', venueSlug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setVenueData(data);
    } catch (error) {
      console.error('Error loading venue:', error);
    } finally {
      setIsLoadingVenue(false);
    }
  };

  // Use venue data if available, otherwise use default
  const currentVenue = venueData || {
    name: defaultVenue.name,
    subtitle: defaultVenue.subtitle,
    logo_text: defaultVenue.logoText,
    logo_subtext: defaultVenue.logoSubtext,
  };

  const sections = [
    { key: "snacks", data: menuData.snacksAndStarters, variant: "cyan" as const, title: "SNACKS & STARTERS" },
    { key: "food", data: menuData.foodMenu, variant: "magenta" as const, title: "FOOD MENU" },
    { key: "beverages", data: menuData.beveragesMenu, variant: "cyan" as const, title: "BEVERAGES & SPIRITS" },
    { key: "sides", data: menuData.sideItems, variant: "gold" as const, title: "SIDE ITEMS" }
  ];

  const activeData = sections.find(s => s.key === activeSection);
  const accentColor = activeData?.variant === "cyan" ? "#00f0ff" : activeData?.variant === "magenta" ? "#ff00ff" : "#ffd700";

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      {/* Admin Button */}
      <Link
        to={user ? `/admin/${slug || ''}` : "/auth"}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
        title="Admin Settings"
      >
        <Settings className="w-5 h-5 text-neon-cyan" />
      </Link>

      <div className="relative z-10">
        {/* Premium Header with Tagline - Only for LIVE venue */}
        {(!slug || slug === 'live') && (
          <div className="pt-3 pb-2 text-center relative z-10">
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor})` }} />
              <span className="text-[11px] tracking-[0.4em] uppercase font-bold"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  background: "linear-gradient(90deg, #00f0ff, #ff00ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                EAT • DRINK • CODE • REPEAT
              </span>
              <div className="w-20 h-[2px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor})` }} />
            </div>
          </div>
        )}

        <MenuHeader
          venueName={currentVenue.name}
          venueSubtitle={currentVenue.subtitle || undefined}
          logoText={currentVenue.logo_text || undefined}
          logoSubtext={currentVenue.logo_subtext || undefined}
          venueSlug={slug}
        />

        {/* Premium Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="flex justify-center gap-2 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-6 py-3 rounded-lg font-orbitron text-sm tracking-wider uppercase transition-all duration-300 ${activeSection === section.key
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border-2 border-neon-cyan text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'bg-background/40 border border-border/30 text-muted-foreground hover:border-neon-cyan/50 hover:text-foreground'
                  }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 pb-16">
          {isLoading || isLoadingVenue ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <span className="ml-3 text-muted-foreground">Loading menu...</span>
            </div>
          ) : (
            <PremiumBorderFrame accentColor={accentColor} className="bg-background/30 backdrop-blur-sm">
              {activeData && (
                <>
                  <PremiumSectionHeader
                    title={activeData.title}
                    subtitle={getSectionIntro(activeData.title)}
                    accentColor={accentColor}
                  />
                  <div className="px-12 pb-6">
                    <MenuSection
                      section={activeData.data}
                      variant={activeData.variant}
                      sectionKey={activeData.key}
                    />
                  </div>

                  {/* Daily Offers Banner */}
                  <div className="px-12 py-4 relative z-10">
                    <div
                      className="text-center py-2 px-4 rounded-full mx-auto max-w-fit"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,255,0.15))",
                        border: "1px solid rgba(0,240,255,0.3)"
                      }}
                    >
                      <p className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: "#22d3ee" }}>
                        ✨ Check with the <span style={{ color: "#fff", fontWeight: "bold" }}>{currentVenue.logo_text || currentVenue.name}</span> team for daily offers ✨
                      </p>
                    </div>
                  </div>
                </>
              )}
            </PremiumBorderFrame>
          )}
        </main>

        {/* Premium Footer */}
        <footer className="py-4 px-12 relative z-10 border-t border-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center flex-wrap gap-4">
              {/* Left - Location */}
              <div className="text-left flex-1">
                <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">{currentVenue.name}</p>
                <p className="text-[8px] text-gray-600">{currentVenue.subtitle}</p>
              </div>

              {/* Center - Decorative Element */}
              <div className="text-center flex-shrink-0 px-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50)` }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: `${accentColor}50` }} />
                  <div className="w-8 h-[1px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}50)` }} />
                </div>
              </div>

              {/* Right - Copyright */}
              <div className="text-right flex-1">
                <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">Premium Dining</p>
                <p className="text-[8px] text-gray-600">© {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Binary Code Watermark Footer */}
        <div className="text-center opacity-20 pointer-events-none pb-2">
          <p className="text-[5px] tracking-[1.5em] text-cyan-500 font-mono">
            01001100 01001001 01010110 01000101
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
