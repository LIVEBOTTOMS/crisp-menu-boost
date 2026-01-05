import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { menuThemes, MenuTheme, ThemeConfig } from "@/config/menuThemes";
import { toast } from "sonner";

interface ThemeSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme?: MenuTheme;
    onThemeSelect: (theme: MenuTheme) => Promise<void>;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    isOpen,
    onClose,
    currentTheme = 'elegant-classic',
    onThemeSelect
}) => {
    const [selectedTheme, setSelectedTheme] = useState<MenuTheme>(currentTheme);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onThemeSelect(selectedTheme);
            toast.success(`Theme changed to ${menuThemes[selectedTheme].name}`);
            onClose();
        } catch (error) {
            toast.error("Failed to update theme");
        } finally {
            setIsSaving(false);
        }
    };

    const ThemeCard = ({ theme }: { theme: ThemeConfig }) => {
        const isSelected = selectedTheme === theme.id;

        return (
            <button
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${isSelected
                        ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                        : 'border-gray-700 hover:border-gray-600 bg-background/50'
                    }`}
            >
                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                    </div>
                )}

                {/* Theme Preview */}
                <div
                    className="h-32 rounded-md mb-3 p-4 flex flex-col justify-between"
                    style={{
                        background: theme.colors.background,
                        border: `2px solid ${theme.colors.border}`
                    }}
                >
                    {/* Sample Header */}
                    <div>
                        <div
                            className="text-lg font-bold mb-1"
                            style={{
                                fontFamily: theme.fonts.heading,
                                color: theme.colors.primary
                            }}
                        >
                            MENU
                        </div>
                        <div
                            className="text-xs"
                            style={{
                                fontFamily: theme.fonts.body,
                                color: theme.colors.text
                            }}
                        >
                            Sample Item • ₹500
                        </div>
                    </div>

                    {/* Sample Border */}
                    <div
                        className="h-1 rounded-full"
                        style={{ background: theme.colors.primary }}
                    />
                </div>

                {/* Theme Info */}
                <h3 className="font-orbitron text-sm font-bold text-white mb-1">
                    {theme.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                    {theme.description}
                </p>

                {/* Color Swatches */}
                <div className="flex gap-1">
                    <div
                        className="w-6 h-6 rounded border border-gray-600"
                        style={{ background: theme.colors.primary }}
                        title="Primary"
                    />
                    <div
                        className="w-6 h-6 rounded border border-gray-600"
                        style={{ background: theme.colors.secondary }}
                        title="Secondary"
                    />
                    <div
                        className="w-6 h-6 rounded border border-gray-600"
                        style={{ background: theme.colors.accent }}
                        title="Accent"
                    />
                </div>
            </button>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white font-orbitron text-2xl">
                        Choose Menu Theme
                    </DialogTitle>
                    <p className="text-gray-400 text-sm mt-2">
                        Select a visual style for your menu. This will apply to both the online view and printed PDFs.
                    </p>
                </DialogHeader>

                {/* Theme Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                    {Object.values(menuThemes).map((theme) => (
                        <ThemeCard key={theme.id} theme={theme} />
                    ))}
                </div>

                {/* Current Selection Info */}
                <div className="bg-black/40 border border-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-semibold mb-2">Selected Theme</h4>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <div
                                className="w-8 h-8 rounded border border-gray-600"
                                style={{ background: menuThemes[selectedTheme].colors.primary }}
                            />
                            <div
                                className="w-8 h-8 rounded border border-gray-600"
                                style={{ background: menuThemes[selectedTheme].colors.secondary }}
                            />
                            <div
                                className="w-8 h-8 rounded border border-gray-600"
                                style={{ background: menuThemes[selectedTheme].colors.accent }}
                            />
                        </div>
                        <div>
                            <p className="text-white font-medium">{menuThemes[selectedTheme].name}</p>
                            <p className="text-gray-400 text-sm">{menuThemes[selectedTheme].description}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-neon-cyan hover:bg-neon-cyan/90 text-black font-semibold"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            'Apply Theme'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
