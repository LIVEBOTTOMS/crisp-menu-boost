export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-neon-magenta/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Circuit lines - left side */}
      <svg className="absolute top-0 left-0 w-32 h-full opacity-20" viewBox="0 0 100 800" fill="none">
        <path d="M50 0 L50 200 L20 250 L20 400 L50 450 L50 600 L30 650 L30 800" stroke="hsl(180 100% 50%)" strokeWidth="1" />
        <path d="M70 0 L70 150 L90 200 L90 350 L60 400 L60 550 L80 600 L80 800" stroke="hsl(300 100% 60%)" strokeWidth="1" />
        <circle cx="50" cy="200" r="3" fill="hsl(180 100% 50%)" />
        <circle cx="20" cy="400" r="3" fill="hsl(180 100% 50%)" />
        <circle cx="90" cy="350" r="3" fill="hsl(300 100% 60%)" />
      </svg>
      
      {/* Circuit lines - right side */}
      <svg className="absolute top-0 right-0 w-32 h-full opacity-20" viewBox="0 0 100 800" fill="none">
        <path d="M50 0 L50 200 L80 250 L80 400 L50 450 L50 600 L70 650 L70 800" stroke="hsl(300 100% 60%)" strokeWidth="1" />
        <path d="M30 0 L30 150 L10 200 L10 350 L40 400 L40 550 L20 600 L20 800" stroke="hsl(180 100% 50%)" strokeWidth="1" />
        <circle cx="50" cy="200" r="3" fill="hsl(300 100% 60%)" />
        <circle cx="80" cy="400" r="3" fill="hsl(300 100% 60%)" />
        <circle cx="10" cy="350" r="3" fill="hsl(180 100% 50%)" />
      </svg>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />
    </div>
  );
};
