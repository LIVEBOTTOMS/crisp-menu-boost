import { useState, useEffect } from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeCustomizerProps {
    currentTheme: any;
    onThemeChange: (theme: any) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
    currentTheme,
    onThemeChange,
}) => {
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [primaryColor, setPrimaryColor] = useState('#22d3ee');
    const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
    const [accentColor, setAccentColor] = useState('#8b5cf6');

    useEffect(() => {
        // Update theme when colors change
        const updatedTheme = {
            ...currentTheme,
            mode,
            colors: {
                primary: primaryColor,
                secondary: secondaryColor,
                accent: accentColor,
            },
        };
        onThemeChange(updatedTheme);
    }, [mode, primaryColor, secondaryColor, accentColor]);

    return (
        <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Theme Customizer</h3>
            </div>

            {/* Light/Dark Mode Toggle */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-300 mb-3 block">
                    Mode
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('light')}
                        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'light'
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Sun className="w-5 h-5" />
                        Light
                    </button>
                    <button
                        onClick={() => setMode('dark')}
                        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'dark'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Moon className="w-5 h-5" />
                        Dark
                    </button>
                </div>
            </div>

            {/* Color Pickers */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                        Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                        Secondary Color
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                        Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-xl" style={{
                background: `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}20 100%)`,
                border: `1px solid ${accentColor}40`
            }}>
                <div className="text-sm font-semibold text-gray-300 mb-2">Preview</div>
                <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg" style={{ background: primaryColor }} />
                    <div className="w-12 h-12 rounded-lg" style={{ background: secondaryColor }} />
                    <div className="w-12 h-12 rounded-lg" style={{ background: accentColor }} />
                </div>
            </div>
        </div>
    );
};
