import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { menuThemes, MenuTheme, ThemeConfig } from "@/config/menuThemes";
import { toast } from "sonner";

interface ThemeSelectorProps {
    currentTheme?: MenuTheme;
    onThemeSelect: (theme: MenuTheme) => Promise<void>;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    currentTheme = 'cyberpunk-tech',
    onThemeSelect
}) => {
    const [selectedTheme, setSelectedTheme] = useState<MenuTheme>(currentTheme);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onThemeSelect(selectedTheme);
            toast.success(`Theme changed to ${menuThemes[selectedTheme].name}`);
        } catch (error) {
            toast.error("Failed to update theme");
        } finally {
            setIsSaving(false);
        }
    };

    const ThemeCard = ({ theme }: { theme: ThemeConfig }) => {
        const isSelected = selectedTheme === theme.id;
        const isActive = currentTheme === theme.id;

        return (
            <button
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left w-full group ${isSelected
                    ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
            >
                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center z-10 shadow-lg shadow-neon-cyan/50">
                        <Check className="w-4 h-4 text-black font-bold" />
                    </div>
                )}

                {/* Active Indicator (Currently Live) */}
                {isActive && !isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/30">
                        Active
                    </div>
                )}

                {/* Theme Preview */}
                <div
                    className="h-28 rounded-md mb-3 p-3 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300"
                    style={{
                        background: theme.colors.background,
                        borderColor: theme.colors.border,
                        borderWidth: '1px'
                    }}
                >
                    {/* Sample Header */}
                    <div className="relative z-10">
                        <div
                            className="text-lg font-bold mb-0.5 leading-none"
                            style={{
                                fontFamily: theme.fonts.heading,
                                color: theme.colors.primary
                            }}
                        >
                            MENU
                        </div>
                        <div
                            className="text-[10px] opacity-80"
                            style={{
                                fontFamily: theme.fonts.body,
                                color: theme.colors.text
                            }}
                        >
                            Fine Dining
                        </div>
                    </div>

                    {/* Sample Border */}
                    <div
                        className="h-0.5 w-1/2 rounded-full relative z-10"
                        style={{ background: theme.colors.accent }}
                    />
                </div>

                {/* Theme Info */}
                <h3 className="font-orbitron text-sm font-bold text-white mb-1">
                    {theme.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2 h-8">
                    {theme.description}
                </p>

                {/* Color Swatches */}
                <div className="flex gap-1.5">
                    <div
                        className="w-5 h-5 rounded-full ring-1 ring-white/10"
                        style={{ background: theme.colors.primary }}
                        title="Primary Color"
                    />
                    <div
                        className="w-5 h-5 rounded-full ring-1 ring-white/10"
                        style={{ background: theme.colors.secondary }}
                        title="Secondary Color"
                    />
                    <div
                        className="w-5 h-5 rounded-full ring-1 ring-white/10"
                        style={{ background: theme.colors.accent }}
                        title="Accent Color"
                    />
                </div>
            </button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-2 text-sm text-gray-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 max-w-2xl">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p>
                        Select a theme below to preview it. Click <strong>"Apply Theme"</strong> to save changes.
                        This will instantly update your online menu and PDF designs.
                    </p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving || selectedTheme === currentTheme}
                    className={`min-w-[140px] font-bold tracking-wide transition-all ${selectedTheme !== currentTheme
                        ? 'bg-neon-cyan text-black hover:bg-neon-cyan/90 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                            Applying...
                        </>
                    ) : (
                        selectedTheme === currentTheme ? 'Current Theme' : 'Apply Theme'
                    )}
                </Button>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {Object.values(menuThemes).map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} />
                ))}
            </div>

            {/* Preview of Selected - Optional Detail View */}
            {selectedTheme && (
                <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-white font-orbitron text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
                        Typography Preview: {menuThemes[selectedTheme].name}
                    </h4>
                    <div
                        className="p-6 rounded-lg border flex flex-col md:flex-row justify-between gap-8"
                        style={{
                            background: menuThemes[selectedTheme].colors.background,
                            borderColor: menuThemes[selectedTheme].colors.border
                        }}
                    >
                        <div className="space-y-2">
                            <span className="text-xs uppercase tracking-widest opacity-50 block mb-1" style={{ color: menuThemes[selectedTheme].colors.text }}>Heading Font</span>
                            <div className="text-4xl" style={{ fontFamily: menuThemes[selectedTheme].fonts.heading, color: menuThemes[selectedTheme].colors.primary }}>
                                Amazing Food
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs uppercase tracking-widest opacity-50 block mb-1" style={{ color: menuThemes[selectedTheme].colors.text }}>Body Font</span>
                            <div className="text-lg" style={{ fontFamily: menuThemes[selectedTheme].fonts.body, color: menuThemes[selectedTheme].colors.text }}>
                                Freshly prepared ingredients with passion.
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs uppercase tracking-widest opacity-50 block mb-1" style={{ color: menuThemes[selectedTheme].colors.text }}>Accent Font</span>
                            <div className="text-2xl" style={{ fontFamily: menuThemes[selectedTheme].fonts.accent, color: menuThemes[selectedTheme].colors.accent }}>
                                Chef's Special
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
