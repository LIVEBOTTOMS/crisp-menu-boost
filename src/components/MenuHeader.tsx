import qrCode from "@/assets/qr-code.png";

export const MenuHeader = () => {
  return (
    <header className="relative py-10 px-6">
      {/* Ornate top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-5xl mx-auto">
        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary/40" />
        
        {/* Main header content */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Restaurant name with elegant styling */}
          <div className="space-y-2">
            <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.3em] text-shimmer">
              LIVE BAR
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-primary/60" />
              <span className="font-montserrat text-xs md:text-sm tracking-[0.4em] text-muted-foreground uppercase">
                Fine Dining & Premium Spirits
              </span>
              <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-primary/60" />
            </div>
          </div>

          {/* Decorative diamond divider */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-primary/40 to-primary/60" />
            <div className="relative">
              <div className="w-3 h-3 rotate-45 border border-primary/60" />
              <div className="absolute inset-0.5 w-2 h-2 rotate-45 bg-primary/20" />
            </div>
            <div className="w-2 h-2 rotate-45 bg-primary/40" />
            <div className="relative">
              <div className="w-3 h-3 rotate-45 border border-primary/60" />
              <div className="absolute inset-0.5 w-2 h-2 rotate-45 bg-primary/20" />
            </div>
            <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent via-primary/40 to-primary/60" />
          </div>

          {/* MENU title */}
          <div className="relative">
            <h2 className="font-cinzel text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.5em] text-foreground text-glow-gold">
              MENU
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          {/* Location tagline */}
          <p className="font-cormorant text-lg md:text-xl tracking-[0.2em] text-muted-foreground italic">
            PUNE • INDIA
          </p>
        </div>

        {/* QR Code section */}
        <div className="flex justify-center mt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-cream rounded-sm shadow-lg border border-primary/20">
              <img 
                src={qrCode} 
                alt="Scan for location" 
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </div>
            <span className="font-montserrat text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Scan for Location
            </span>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rotate-45 bg-primary/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
            <div className="w-1 h-1 rotate-45 bg-primary/40" />
          </div>
          <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </header>
  );
};
