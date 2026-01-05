import React from "react";

interface PremiumSectionHeaderProps {
    title: string;
    subtitle?: string;
    accentColor?: string;
}

export const PremiumSectionHeader: React.FC<PremiumSectionHeaderProps> = ({
    title,
    subtitle,
    accentColor = "#00f0ff"
}) => {
    return (
        <div className="mt-6 mb-4 px-12 relative">
            <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-gray-800/50 -z-10" />
            <div className="text-center">
                <span
                    className="inline-block px-10 py-2 bg-background text-xl font-bold tracking-[0.3em] uppercase"
                    style={{
                        color: accentColor,
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: `0 0 20px ${accentColor}40`,
                        borderTop: `1px solid ${accentColor}30`,
                        borderBottom: `1px solid ${accentColor}30`
                    }}
                >
                    {title}
                </span>
            </div>

            {/* Section Intro */}
            {subtitle && (
                <div className="text-center mt-3">
                    <p className="text-[17px] text-gray-300 font-serif italic tracking-wide font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {subtitle}
                    </p>
                </div>
            )}
        </div>
    );
};
