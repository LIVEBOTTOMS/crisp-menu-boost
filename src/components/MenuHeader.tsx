import qrCode from "@/assets/qr-code.png";

export const MenuHeader = () => {
  return (
    <header className="relative py-12 px-6">
      {/* Ornate top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-5xl mx-auto">
        {/* Decorative corner ornaments - larger and more ornate */}
        <div className="absolute top-6 left-6 w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/70 to-transparent" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-primary/70 to-transparent" />
          <div className="absolute top-2 left-2 w-3 h-3 rotate-45 border border-primary/50" />
          <div className="absolute top-4 left-4 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>
        <div className="absolute top-6 right-6 w-20 h-20">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary/70 to-transparent" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-primary/70 to-transparent" />
          <div className="absolute top-2 right-2 w-3 h-3 rotate-45 border border-primary/50" />
          <div className="absolute top-4 right-4 w-1.5 h-1.5 rotate-45 bg-primary/40" />
        </div>
        
        {/* Main header content */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Establishment indicator */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-montserrat text-[10px] tracking-[0.5em] text-muted-foreground/70 uppercase">
              Est. 2024
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>

          {/* Restaurant name with elegant styling */}
          <div className="space-y-3">
            <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.35em] text-shimmer">
              LIVE BAR
            </h1>
            <div className="flex items-center justify-center gap-5">
              <div className="h-px w-20 md:w-28 bg-gradient-to-r from-transparent via-primary/40 to-primary/70" />
              <span className="font-montserrat text-xs md:text-sm tracking-[0.4em] text-muted-foreground uppercase font-light">
                Fine Dining & Premium Spirits
              </span>
              <div className="h-px w-20 md:w-28 bg-gradient-to-l from-transparent via-primary/40 to-primary/70" />
            </div>
          </div>

          {/* Decorative diamond divider - more elaborate */}
          <div className="flex items-center justify-center gap-3 py-6">
            <div className="h-px w-24 md:w-36 bg-gradient-to-r from-transparent via-primary/30 to-primary/60" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rotate-45 bg-primary/30" />
              <div className="relative">
                <div className="w-4 h-4 rotate-45 border-2 border-primary/60" />
                <div className="absolute inset-1 w-2 h-2 rotate-45 bg-primary/25" />
              </div>
              <div className="w-2 h-2 rotate-45 bg-primary/50" />
              <div className="relative">
                <div className="w-4 h-4 rotate-45 border-2 border-primary/60" />
                <div className="absolute inset-1 w-2 h-2 rotate-45 bg-primary/25" />
              </div>
              <div className="w-1 h-1 rotate-45 bg-primary/30" />
            </div>
            <div className="h-px w-24 md:w-36 bg-gradient-to-l from-transparent via-primary/30 to-primary/60" />
          </div>

          {/* MENU title with enhanced glow */}
          <div className="relative py-2">
            <h2 className="font-cinzel text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.5em] text-foreground text-glow-gold">
              MENU
            </h2>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          {/* Location tagline */}
          <p className="font-cormorant text-xl md:text-2xl tracking-[0.25em] text-muted-foreground italic font-light">
            PUNE • INDIA
          </p>
        </div>

        {/* QR Code section - refined */}
        <div className="flex justify-center mt-10">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-cream rounded-sm shadow-lg border-2 border-primary/30 relative">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary/60" />
              <img 
                src={qrCode} 
                alt="Scan for location" 
                className="w-18 h-18 md:w-22 md:h-22"
              />
            </div>
            <span className="font-montserrat text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase">
              Scan for Location
            </span>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="flex-1 max-w-sm h-px bg-gradient-to-r from-transparent via-border to-primary/30" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rotate-45 bg-primary/35" />
            <div className="w-2 h-2 rotate-45 border border-primary/50" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/55" />
            <div className="w-2 h-2 rotate-45 border border-primary/50" />
            <div className="w-1 h-1 rotate-45 bg-primary/35" />
          </div>
          <div className="flex-1 max-w-sm h-px bg-gradient-to-l from-transparent via-border to-primary/30" />
        </div>
      </div>
    </header>
  );
};
