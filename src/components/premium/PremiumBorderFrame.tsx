import React from "react";

interface PremiumBorderFrameProps {
    children: React.ReactNode;
    accentColor?: string;
    className?: string;
}

export const PremiumBorderFrame: React.FC<PremiumBorderFrameProps> = ({
    children,
    accentColor = "#00f0ff",
    className = ""
}) => {
    return (
        <div className={`relative ${className}`}>
            {/* World-Class Boundary System */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Outer Frame */}
                <div className="absolute inset-[12px] border border-gray-800/60" />

                {/* Inner Frame with Accent Glow */}
                <div
                    className="absolute inset-[20px] border-2"
                    style={{
                        borderColor: `${accentColor}40`,
                        boxShadow: `inset 0 0 30px ${accentColor}10`
                    }}
                />

                {/* Corner Accents - Premium Tech Style */}
                <div className="absolute top-[20px] left-[20px] w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
                    <div className="absolute top-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
                    <div className="absolute top-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                </div>

                <div className="absolute top-[20px] right-[20px] w-20 h-20">
                    <div className="absolute top-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
                    <div className="absolute top-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
                    <div className="absolute top-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                </div>

                <div className="absolute bottom-[20px] left-[20px] w-20 h-20">
                    <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
                    <div className="absolute bottom-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
                    <div className="absolute bottom-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                </div>

                <div className="absolute bottom-[20px] right-[20px] w-20 h-20">
                    <div className="absolute bottom-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
                    <div className="absolute bottom-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
                    <div className="absolute bottom-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                </div>

                {/* Side Circuit Lines */}
                <div className="absolute top-1/2 left-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
                <div className="absolute top-1/2 right-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(-90deg, ${accentColor}80, transparent)` }} />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
