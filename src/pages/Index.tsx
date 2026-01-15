import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { MenuHeader } from "@/components/MenuHeader";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ShareMenu } from "@/components/ShareMenu";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { PremiumBorderFrame, PremiumSectionHeader } from "@/components/premium";
import { LeadCaptureDialog } from "@/components/LeadCaptureDialog";
import { DayOfWeekSelector } from "@/components/DayOfWeekSelector";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";
import { getVenueConfig } from "@/config/venueConfig";
import { getThemeForVenue, MenuTheme } from "@/config/menuThemes";
import { supabase } from "@/integrations/supabase/client";
import { hexToHsl } from "@/lib/utils";
import { LoyaltyProgram } from "@/components/LoyaltyProgram";
import { GamificationHub } from "@/components/GamificationHub";
import { ParticleField } from "@/components/ui/ParticleField";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { motion, AnimatePresence } from "framer-motion";

interface VenueData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  subtitle: string | null;
  logo_text: string | null;
  logo_subtext: string | null;
  city?: string | null;
  logo_image_url?: string | null;
  theme?: string;
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
  const { menuData, isLoading, setActiveVenueSlug } = useMenu();
  const { user } = useAuth();
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (!user && !localStorage.getItem("menux_customer_info")) {
      setShowGate(true);
    }
  }, [user]);
  const { currentTheme, getThemeGradient } = useDynamicTheme();
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [isLoadingVenue, setIsLoadingVenue] = useState(false);

  // For default LIVE menu (no slug in URL)
  const defaultVenue = getVenueConfig();

  useEffect(() => {
    // Set active venue in context to trigger real-time sync for this specific venue
    setActiveVenueSlug(slug || 'live');

    if (slug) {
      // Load venue-specific data
      loadVenueData(slug);
    }
  }, [slug, setActiveVenueSlug]);

  const loadVenueData = async (venueSlug: string) => {
    setIsLoadingVenue(true);
    try {
      const { data, error } = await (supabase
        .from('venues' as any) as any)
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
    theme: 'cyberpunk-tech',
    tagline: null,
    logo_image_url: null,
    id: 'default'
  } as VenueData;

  const themeConfig = getThemeForVenue(slug, currentVenue.theme as MenuTheme);
  const accentColor = themeConfig.colors.primary;

  const sections = [
    { key: "snacks", data: menuData.snacksAndStarters, variant: "cyan" as const, title: "SNACKS & STARTERS" },
    { key: "food", data: menuData.foodMenu, variant: "magenta" as const, title: "FOOD MENU" },
    { key: "beverages", data: menuData.beveragesMenu, variant: "cyan" as const, title: "BEVERAGES & SPIRITS" },
    { key: "sides", data: menuData.sideItems, variant: "gold" as const, title: "SIDE ITEMS" }
  ];

  const activeData = sections.find(s => s.key === activeSection);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
        fontFamily: themeConfig.fonts.body,
        // Override global CSS variables with theme colors
        // @ts-ignore
        '--background': hexToHsl(themeConfig.colors.background),
        '--foreground': hexToHsl(themeConfig.colors.text),
        '--primary': hexToHsl(themeConfig.colors.primary),
        '--secondary': hexToHsl(themeConfig.colors.secondary),
        '--accent': hexToHsl(themeConfig.colors.accent),
        '--border': hexToHsl(themeConfig.colors.border),
      } as React.CSSProperties}
    >
      {/* Lead Capture Gate */}
      {showGate && <LeadCaptureDialog onAccessGranted={() => setShowGate(false)} />}

      {/* Stage 2 Background Effects */}
      <ParticleField count={60} interactive={true} />

      {/* Dynamic Time-based Layer */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{ background: getThemeGradient(0.1) }}
      />

      {/* Dynamic Background Effects - Only for Cyberpunk */}
      {(themeConfig.id as string) === 'cyberpunk-tech' && <BackgroundEffects />}

      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <AnimatedButton
            variant="glass"
            className="px-4 py-2 text-xs"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
          >
            HOME
          </AnimatedButton>
        </Link>
      </div>

      {/* Top Right Tools */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />

        <div className="hidden md:block">
          <ShareMenu
            menuUrl={`/menu/${slug || 'live'}`}
            menuName={currentVenue.name}
            description={currentVenue.subtitle || "Check out our menu!"}
          />
        </div>

        {/* Mobile Share Button (Simpler version if needed, or just use same component) */}
        <div className="md:hidden">
          <ShareMenu
            menuUrl={`/menu/${slug || 'live'}`}
            menuName={currentVenue.name}
            description={currentVenue.subtitle || undefined}
          />
        </div>

        {/* Admin Button */}
        <Link
          to={user ? `/admin/${slug || ''}` : "/auth"}
          className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
          title="Admin Settings"
        >
          <Settings className="w-5 h-5 text-neon-cyan" />
        </Link>
      </div>

      <div className="relative z-10">
        {/* Dynamic Tagline - Display only if exists in DB */}
        {currentVenue.tagline && (
          <div className="pt-3 pb-2 text-center relative z-10">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 md:w-20 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${themeConfig.colors.accent})` }} />
              <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold px-2"
                style={{
                  fontFamily: themeConfig.fonts.accent,
                  color: themeConfig.colors.accent,
                  textShadow: `0 0 10px ${themeConfig.colors.accent}40`
                }}>
                {currentVenue.tagline}
              </span>
              <div className="w-12 md:w-20 h-[2px]" style={{ background: `linear-gradient(-90deg, transparent, ${themeConfig.colors.accent})` }} />
            </div>
          </div>
        )}

        <MenuHeader
          venueName={currentVenue.name}
          venueSubtitle={currentVenue.subtitle || undefined}
          logoText={currentVenue.logo_text || undefined}
          logoSubtext={currentVenue.logo_subtext || undefined}
          venueSlug={slug}
          themeConfig={themeConfig}
          logoUrl={currentVenue.logo_image_url || undefined}
        />

        {/* Day of Week Selector for Daily Specials */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <DayOfWeekSelector />
        </div>

        {/* Premium Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="flex justify-center gap-2 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-6 py-3 rounded-lg text-sm tracking-wider uppercase transition-all duration-300 border backdrop-blur-sm`}
                style={{
                  fontFamily: themeConfig.fonts.heading,
                  backgroundColor: activeSection === section.key
                    ? `${themeConfig.colors.primary}20`
                    : `${themeConfig.colors.background}60`,
                  borderColor: activeSection === section.key
                    ? themeConfig.colors.primary
                    : `${themeConfig.colors.border}`,
                  color: activeSection === section.key
                    ? (themeConfig.id === 'cyberpunk-tech' ? '#fff' : themeConfig.colors.primary)
                    : themeConfig.colors.text,
                  boxShadow: activeSection === section.key && themeConfig.id === 'cyberpunk-tech'
                    ? `0 0 20px ${themeConfig.colors.primary}40`
                    : 'none',
                  opacity: activeSection === section.key ? 1 : 0.7
                }}
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

        {/* Customer Engagement Section */}
        <div className="relative z-10 py-8">
          {/* Gamification - Win 5% Discount */}
          <GamificationHub />

          {/* Loyalty Program */}
          <LoyaltyProgram />
        </div>

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
    </div >
  );
};

export default Index;
