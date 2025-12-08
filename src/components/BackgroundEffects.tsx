export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Warm ambient gradients - more refined */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-primary/[0.04] rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[120px]" />
      
      {/* Subtle vignette - deeper */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/90" />
      
      {/* Elegant diamond pattern overlay */}
      <div className="absolute inset-0 pattern-diamond opacity-30" />
      
      {/* Elegant corner flourishes - top left */}
      <svg className="absolute top-10 left-10 w-28 h-28 text-primary/15" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 L0 8 Q0 0 8 0 L50 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M0 38 L0 16 Q0 8 8 8 L38 8" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path d="M16 16 L24 16" stroke="currentColor" strokeWidth="0.5" />
        <path d="M16 16 L16 24" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      {/* Top right */}
      <svg className="absolute top-10 right-10 w-28 h-28 text-primary/15" viewBox="0 0 100 100" fill="none">
        <path d="M100 50 L100 8 Q100 0 92 0 L50 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M100 38 L100 16 Q100 8 92 8 L62 8" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="92" cy="8" r="3" fill="currentColor" />
        <path d="M84 16 L76 16" stroke="currentColor" strokeWidth="0.5" />
        <path d="M84 16 L84 24" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      {/* Bottom left */}
      <svg className="absolute bottom-10 left-10 w-28 h-28 text-primary/15" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 L0 92 Q0 100 8 100 L50 100" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M0 62 L0 84 Q0 92 8 92 L38 92" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="8" cy="92" r="3" fill="currentColor" />
        <path d="M16 84 L24 84" stroke="currentColor" strokeWidth="0.5" />
        <path d="M16 84 L16 76" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      {/* Bottom right */}
      <svg className="absolute bottom-10 right-10 w-28 h-28 text-primary/15" viewBox="0 0 100 100" fill="none">
        <path d="M100 50 L100 92 Q100 100 92 100 L50 100" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M100 62 L100 84 Q100 92 92 92 L62 92" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="92" cy="92" r="3" fill="currentColor" />
        <path d="M84 84 L76 84" stroke="currentColor" strokeWidth="0.5" />
        <path d="M84 84 L84 76" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Side decorative lines */}
      <div className="absolute left-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      <div className="absolute right-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
    </div>
  );
};
