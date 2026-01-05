import { ThemeConfig } from "@/config/menuThemes";
import { getVenueConfig } from "@/config/venueConfig";
import { CircuitBorder } from "./CircuitBorder";

interface MenuHeaderProps {
  venueName?: string;
  venueSubtitle?: string;
  logoText?: string;
  logoSubtext?: string;
  venueSlug?: string;
  themeConfig?: ThemeConfig;
  logoUrl?: string;
}

export const MenuHeader = ({ venueName, venueSubtitle, logoText, logoSubtext, venueSlug, themeConfig, logoUrl }: MenuHeaderProps = {}) => {
  const defaultVenue = getVenueConfig();

  // Use props if provided, otherwise use default config
  const venue = {
    name: venueName || defaultVenue.name,
    subtitle: venueSubtitle || defaultVenue.subtitle,
    logoText: logoText || defaultVenue.logoText,
    logoSubtext: logoSubtext || defaultVenue.logoSubtext,
    qrCodeLabel: defaultVenue.qrCodeLabel,
    establishedYear: defaultVenue.establishedYear,
  };

  // Use provided logo URL or fallback to null (text logo)
  const logoImagePath = logoUrl || null;

  // Colors from theme or defaults
  const primaryColor = themeConfig?.colors.primary || '#00f0ff';
  const secondaryColor = themeConfig?.colors.secondary || '#ff00ff';
  const accentColor = themeConfig?.colors.accent || '#ffd700';
  const textColor = themeConfig?.colors.text || 'inherit';

  return (
    <header className="relative py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main header layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Logo - Image or Text */}
          <div className="relative group">
            {logoImagePath ? (
              // Image Logo (for Moon Walk NX)
              <div className="relative">
                <img
                  src={logoImagePath}
                  alt={venue.name}
                  className="w-64 md:w-80 h-auto rounded-lg shadow-2xl"
                  style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.15))" }}
                />
              </div>
            ) : (
              // Text Logo (for LIVE and others)
              <>
                <CircuitBorder className="px-10 py-5 hover:scale-105 transition-transform duration-300">
                  <h1
                    className="font-orbitron text-4xl md:text-5xl font-black tracking-[0.15em] animate-pulse-glow"
                    style={{
                      color: primaryColor,
                      textShadow: `0 0 15px ${primaryColor}40`
                    }}
                  >
                    {venue.logoText}
                  </h1>
                  <p
                    className="font-rajdhani text-xs tracking-[0.3em] mt-2 text-center uppercase"
                    style={{ color: textColor, opacity: 0.8 }}
                  >
                    {venue.logoSubtext}
                  </p>
                </CircuitBorder>
                {/* Subtle corner accents */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: `${primaryColor}60` }} />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: `${secondaryColor}60` }} />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: `${secondaryColor}60` }} />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: `${primaryColor}60` }} />
              </>
            )}
          </div>

          {/* MENU title - Enhanced with premium styling */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-block">
                {/* Background glow effect - only for dark themes or specific branding */}
                {!themeConfig || themeConfig.id === 'cyberpunk-tech' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/10 to-neon-gold/10 blur-2xl" />
                ) : null}

                <h2
                  className="relative font-cinzel text-6xl md:text-7xl font-bold tracking-[0.5em] uppercase drop-shadow-2xl"
                  style={{
                    fontFamily: themeConfig?.fonts.heading,
                    color: themeConfig?.id === 'cyberpunk-tech' ? textColor : primaryColor
                  }}
                >
                  MENU
                </h2>
              </div>

              {/* Enhanced decorative elements */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-[2px] w-24" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, ${accentColor})`, opacity: 0.6 }} />
                <div className="relative">
                  <div className="w-3 h-3 rotate-45 animate-pulse" style={{ backgroundColor: accentColor }} />
                  <div className="absolute inset-0 w-3 h-3 rotate-45 animate-ping" style={{ backgroundColor: `${accentColor}30` }} />
                </div>
                <div className="h-[2px] w-24" style={{ background: `linear-gradient(-90deg, transparent, ${secondaryColor}, ${accentColor})`, opacity: 0.6 }} />
              </div>
            </div>
          </div>

          {/* Restaurant info */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-center md:text-right">
              <h3
                className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.2em] drop-shadow-lg"
                style={{
                  fontFamily: themeConfig?.fonts.heading,
                  color: textColor
                }}
              >
                {venue.name}
              </h3>
              <p
                className="font-rajdhani text-sm tracking-[0.15em] mt-2"
                style={{
                  fontFamily: themeConfig?.fonts.body,
                  color: textColor,
                  opacity: 0.7
                }}
              >
                {venue.subtitle}
              </p>
              <p
                className="font-rajdhani text-xs tracking-[0.1em] mt-1"
                style={{
                  fontFamily: themeConfig?.fonts.body,
                  color: textColor,
                  opacity: 0.5
                }}
              >
                Est. {venue.establishedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom divider - Enhanced */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <div className="h-[1px] flex-1 max-w-[300px]" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}40, ${primaryColor}60)` }} />
          <div className="relative">
            <div className="w-3 h-3 rotate-45 animate-pulse" style={{ backgroundColor: `${accentColor}70` }} />
            <div className="absolute inset-0 w-3 h-3 rotate-45 animate-spin-slow border" style={{ borderColor: accentColor }} />
          </div>
          <div className="h-[1px] flex-1 max-w-[300px]" style={{ background: `linear-gradient(-90deg, transparent, ${secondaryColor}40, ${secondaryColor}60)` }} />
        </div>
      </div>
    </header>
  );
};
