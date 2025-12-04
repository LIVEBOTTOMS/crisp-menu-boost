import { CircuitBorder } from "./CircuitBorder";

export const MenuHeader = () => {
  return (
    <header className="relative py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Compact aligned header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div className="relative">
            <CircuitBorder className="px-8 py-4">
              <h1 className="font-orbitron text-3xl md:text-4xl font-black tracking-wider gradient-text animate-pulse-glow">
                LIVE
              </h1>
              <p className="font-rajdhani text-xs tracking-[0.25em] text-foreground/70 mt-1">
                EAT.DRINK.CODE.REPEAT
              </p>
            </CircuitBorder>
          </div>
          
          {/* MENU title - aligned with header */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold tracking-[0.3em] text-foreground">
                MENU
              </h2>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="w-1.5 h-1.5 rotate-45 bg-accent" />
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-secondary to-transparent" />
              </div>
            </div>
          </div>

          {/* Restaurant info */}
          <div className="text-center md:text-right">
            <h3 className="font-cinzel text-xl md:text-2xl font-semibold tracking-[0.15em] text-foreground">
              LIVE BAR
            </h3>
            <p className="font-rajdhani text-sm tracking-[0.1em] text-muted-foreground mt-1">
              FINE DINING • PUNE
            </p>
          </div>
        </div>
        
        {/* Decorative bottom line */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="w-2 h-2 rotate-45 bg-accent/60 animate-pulse" />
          <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
        </div>
      </div>
    </header>
  );
};