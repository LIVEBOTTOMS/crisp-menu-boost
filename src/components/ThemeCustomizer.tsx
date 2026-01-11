import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Sparkles, Type, Layout } from "lucide-react";
import { MenuTheme, ThemeConfig } from "@/config/menuThemes";

interface ThemeCustomizerProps {
    currentTheme: ThemeConfig;
    onSaveCustomColors?: (colors: Partial<ThemeConfig['colors']>) => Promise<void>;
}

export const ThemeCustomizer = ({ currentTheme, onSaveCustomColors }: ThemeCustomizerProps) => {
    const [customColors, setCustomColors] = useState(currentTheme.colors);
    const [isSaving, setIsSaving] = useState(false);

    const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
        setCustomColors(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!onSaveCustomColors) return;
        setIsSaving(true);
        try {
            await onSaveCustomColors(customColors);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setCustomColors(currentTheme.colors);
    };

    const ColorInput = ({ label, colorKey, description }: {
        label: string;
        colorKey: keyof ThemeConfig['colors'];
        description: string;
    }) => (
        <div className="space-y-2">
            <Label className="text-white text-sm font-medium">{label}</Label>
            <div className="flex gap-2 items-center">
                <Input
                    type="color"
                    value={customColors[colorKey]}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                    type="text"
                    value={customColors[colorKey]}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white font-mono text-sm"
                    placeholder="#000000"
                />
            </div>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    );

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="h-5 w-5 text-neon-cyan" />
                    Advanced Theme Customization
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Fine-tune colors to match your brand perfectly. Changes preview in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                        <TabsTrigger value="colors" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black">
                            <Palette className="h-4 w-4 mr-2" />
                            Colors
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ColorInput
                                label="Primary Color"
                                colorKey="primary"
                                description="Main accent color used for headings and highlights"
                            />
                            <ColorInput
                                label="Secondary Color"
                                colorKey="secondary"
                                description="Supporting accent color for variety"
                            />
                            <ColorInput
                                label="Accent Color"
                                colorKey="accent"
                                description="Special highlights and call-to-action elements"
                            />
                            <ColorInput
                                label="Background"
                                colorKey="background"
                                description="Main page background color"
                            />
                            <ColorInput
                                label="Card Background"
                                colorKey="cardBg"
                                description="Background for menu sections and cards"
                            />
                            <ColorInput
                                label="Text Color"
                                colorKey="text"
                                description="Primary text color for readability"
                            />
                            <ColorInput
                                label="Muted Text"
                                colorKey="textMuted"
                                description="Secondary text like descriptions"
                            />
                            <ColorInput
                                label="Border Color"
                                colorKey="border"
                                description="Borders and dividers"
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-white/10">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !onSaveCustomColors}
                                className="bg-neon-cyan text-black hover:bg-neon-cyan/90 font-bold"
                            >
                                {isSaving ? 'Saving...' : 'Save Custom Colors'}
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Reset to Theme Default
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-6">
                        <div
                            className="rounded-lg p-8 space-y-6"
                            style={{
                                background: customColors.background,
                                border: `1px solid ${customColors.border}`
                            }}
                        >
                            {/* Preview Card */}
                            <div
                                className="rounded-lg p-6 space-y-4"
                                style={{ background: customColors.cardBg }}
                            >
                                <h3
                                    className="text-2xl font-bold"
                                    style={{
                                        color: customColors.primary,
                                        fontFamily: currentTheme.fonts.heading
                                    }}
                                >
                                    Sample Menu Section
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4
                                                className="text-lg font-semibold mb-1"
                                                style={{ color: customColors.text }}
                                            >
                                                Signature Dish
                                            </h4>
                                            <p
                                                className="text-sm"
                                                style={{ color: customColors.textMuted }}
                                            >
                                                Fresh ingredients prepared with passion and expertise
                                            </p>
                                        </div>
                                        <span
                                            className="text-lg font-bold ml-4"
                                            style={{ color: customColors.accent }}
                                        >
                                            ₹499
                                        </span>
                                    </div>
                                    <div
                                        className="h-px w-full"
                                        style={{ background: customColors.border }}
                                    />
                                    <div className="flex gap-2">
                                        <span
                                            className="px-3 py-1 rounded text-xs font-bold"
                                            style={{
                                                background: `${customColors.secondary}20`,
                                                color: customColors.secondary,
                                                border: `1px solid ${customColors.secondary}40`
                                            }}
                                        >
                                            Chef's Special
                                        </span>
                                        <span
                                            className="px-3 py-1 rounded text-xs font-bold"
                                            style={{
                                                background: `${customColors.primary}20`,
                                                color: customColors.primary,
                                                border: `1px solid ${customColors.primary}40`
                                            }}
                                        >
                                            Best Seller
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-sm" style={{ color: customColors.textMuted }}>
                                This preview shows how your custom colors will look on the menu
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
