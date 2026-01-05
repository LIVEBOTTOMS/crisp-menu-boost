import { CircuitBorder } from "./CircuitBorder";
import { getVenueConfig } from "@/config/venueConfig";

interface MenuHeaderProps {
  venueName?: string;
  venueSubtitle?: string;
  logoText?: string;
  logoSubtext?: string;
  venueSlug?: string; // Add slug to determine which logo to show
}

export const MenuHeader = ({ venueName, venueSubtitle, logoText, logoSubtext, venueSlug }: MenuHeaderProps = {}) => {
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

  // Determine if venue has a logo image
  const hasLogoImage = venueSlug === 'moonwalk-nx';
  const logoImagePath = hasLogoImage ? '/moonwalk-logo.jpg' : null;

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
                  style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.3))" }}
                />
              </div>
            ) : (
              // Text Logo (for LIVE and others)
              <>
                <CircuitBorder className="px-10 py-5 hover:scale-105 transition-transform duration-300">
                  <h1 className="font-orbitron text-4xl md:text-5xl font-black tracking-[0.15em] gradient-text animate-pulse-glow drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    {venue.logoText}
                  </h1>
                  <p className="font-rajdhani text-xs tracking-[0.3em] text-foreground/80 mt-2 text-center uppercase">
                    {venue.logoSubtext}
                  </p>
                </CircuitBorder>
                {/* Subtle corner accents */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan/40" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-magenta/40" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-magenta/40" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-cyan/40" />
              </>
            )}
          </div>

          {/* MENU title - Enhanced with premium styling */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-block">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/10 to-neon-gold/10 blur-2xl" />

                <h2 className="relative font-cinzel text-6xl md:text-7xl font-bold tracking-[0.5em] text-foreground uppercase drop-shadow-2xl">
                  MENU
                </h2>
              </div>

              {/* Enhanced decorative elements */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-neon-cyan opacity-60" />
                <div className="relative">
                  <div className="w-3 h-3 rotate-45 bg-accent animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rotate-45 bg-accent/20 animate-ping" />
                </div>
                <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-secondary to-neon-magenta opacity-60" />
              </div>

              {/* Tagline removed - now venue-specific in Index.tsx */}
            </div>
          </div>

          {/* Restaurant info - QR code moved to Print/Download */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-center md:text-right">
              <h3 className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.2em] text-foreground drop-shadow-lg">
                {venue.name}
              </h3>
              <p className="font-rajdhani text-sm tracking-[0.15em] text-muted-foreground mt-2">
                {venue.subtitle}
              </p>
              <p className="font-rajdhani text-xs tracking-[0.1em] text-muted-foreground/70 mt-1">
                Est. {venue.establishedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom divider - Enhanced */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <div className="h-[1px] flex-1 max-w-[300px] bg-gradient-to-r from-transparent via-primary/40 to-neon-cyan/60" />
          <div className="relative">
            <div className="w-3 h-3 rotate-45 bg-accent/70 animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 rotate-45 border border-neon-gold animate-spin-slow" />
          </div>
          <div className="h-[1px] flex-1 max-w-[300px] bg-gradient-to-l from-transparent via-secondary/40 to-neon-magenta/60" />
        </div>
      </div>
    </header>
  );
};
