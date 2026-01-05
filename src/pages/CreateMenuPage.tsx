import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Palette, Type, Image as ImageIcon, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { toast } from "sonner";
import { menuThemes, MenuTheme } from "@/config/menuThemes";

const CreateMenuPage = () => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        // Basic Info
        name: "",
        slug: "",
        tagline: "",
        subtitle: "",
        city: "",

        // Branding
        logoText: "",
        logoSubtext: "",

        // Theme & Styling
        theme: 'elegant-classic' as MenuTheme,

        // Options
        copyMenuItems: false, // Changed to false by default
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name' && !formData.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }

        // Auto-generate logoText from name if not set
        if (name === 'name' && !formData.logoText) {
            setFormData(prev => ({ ...prev, logoText: value.toUpperCase() }));
        }
    };

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug) {
            toast.error('Please fill in at least the restaurant name');
            return;
        }

        setIsCreating(true);

        try {
            // Create venue with theme
            const { data: venue, error: venueError } = await supabase
                .from('venues')
                .insert({
                    name: formData.name,
                    slug: formData.slug,
                    tagline: formData.tagline || null,
                    subtitle: formData.subtitle || null,
                    city: formData.city || null,
                    logo_text: formData.logoText || formData.name,
                    logo_subtext: formData.logoSubtext || null,
                    theme: formData.theme,
                })
                .select()
                .single();

            if (venueError) throw venueError;

            // Only copy menu items if explicitly requested
            if (formData.copyMenuItems) {
                // Import menu data dynamically
                const { snacksAndStarters, foodMenu, beveragesMenu, sideItems } = await import('@/data/menuData');

                const menuItems: any[] = [];

                // Helper to add items
                const addSection = (section: any, sectionType: string) => {
                    section.categories.forEach((category: any, catIndex: number) => {
                        category.items.forEach((item: any, itemIndex: number) => {
                            menuItems.push({
                                venue_id: venue.id,
                                section_type: sectionType,
                                category_name: category.title,
                                category_index: catIndex,
                                item_name: item.name,
                                item_index: itemIndex,
                                description: item.description || null,
                                price: item.price || null,
                                half_price: item.halfPrice || null,
                                full_price: item.fullPrice || null,
                                sizes: item.sizes || null,
                                size_labels: item.sizeLabels || null,
                                is_veg: item.isVeg || false,
                                is_non_veg: item.isNonVeg || false,
                                image_url: item.image || null,
                            });
                        });
                    });
                };

                addSection(snacksAndStarters, 'snacks');
                addSection(foodMenu, 'food');
                addSection(beveragesMenu, 'beverages');
                addSection(sideItems, 'sides');

                // Insert all menu items
                const { error: itemsError } = await supabase
                    .from('venue_menu_items')
                    .insert(menuItems);

                if (itemsError) throw itemsError;
            }

            toast.success(`Menu "${formData.name}" created successfully!`);
            navigate(`/admin/${formData.slug}`);
        } catch (error: any) {
            console.error('Error creating menu:', error);

            if (error.code === '23505') {
                toast.error('A menu with this name already exists. Please choose a different name.');
            } else {
                toast.error('Failed to create menu. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const ThemeCard = ({ theme }: { theme: typeof menuThemes[MenuTheme] }) => {
        const isSelected = formData.theme === theme.id;

        return (
            <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${isSelected
                        ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                        : 'border-gray-700 hover:border-gray-600 bg-background/50'
                    }`}
            >
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                    </div>
                )}

                {/* Theme Preview */}
                <div
                    className="h-24 rounded-md mb-3 p-3 flex flex-col justify-between"
                    style={{
                        background: theme.colors.background,
                        border: `2px solid ${theme.colors.border}`
                    }}
                >
                    <div
                        className="text-sm font-bold"
                        style={{
                            fontFamily: theme.fonts.heading,
                            color: theme.colors.primary
                        }}
                    >
                        {formData.logoText || formData.name || "MENU"}
                    </div>
                    <div
                        className="h-1 rounded-full"
                        style={{ background: theme.colors.primary }}
                    />
                </div>

                <h3 className="font-orbitron text-xs font-bold text-white mb-1">
                    {theme.name}
                </h3>
                <p className="text-[10px] text-gray-400">
                    {theme.description}
                </p>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-background relative">
            <BackgroundEffects />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-lg border border-border/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-neon-cyan" />
                    </button>
                    <div>
                        <h1 className="font-cinzel text-4xl font-bold text-foreground gradient-text">
                            Create New Menu
                        </h1>
                        <p className="font-rajdhani text-muted-foreground mt-1">
                            Customize your menu's look, feel, and branding
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: "Basic Info", icon: Type },
                            { num: 2, label: "Theme & Style", icon: Palette },
                            { num: 3, label: "Branding", icon: ImageIcon },
                        ].map((step, idx) => (
                            <div key={step.num} className="flex items-center flex-1">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(step.num)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentStep === step.num
                                            ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                                            : currentStep > step.num
                                                ? 'bg-green-500/20 border-2 border-green-500 text-green-500'
                                                : 'bg-background/40 border border-border/30 text-muted-foreground'
                                        }`}
                                >
                                    <step.icon className="w-4 h-4" />
                                    <span className="font-rajdhani font-bold text-sm">{step.label}</span>
                                </button>
                                {idx < 2 && (
                                    <div className={`flex-1 h-[2px] mx-2 ${currentStep > step.num ? 'bg-green-500' : 'bg-border/30'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateMenu} className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-sm p-8 space-y-6">

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-gradient-to-r from-neon-cyan to-transparent" />
                                    Basic Information
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                            Restaurant Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., THE GARDEN"
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                            URL Slug * (auto-generated)
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            placeholder="e.g., the-garden"
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                        />
                                        <p className="font-rajdhani text-xs text-muted-foreground mt-1">
                                            Your menu will be available at: /menu/{formData.slug || 'your-slug'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                            Tagline
                                        </label>
                                        <input
                                            type="text"
                                            name="tagline"
                                            value={formData.tagline}
                                            onChange={handleChange}
                                            placeholder="e.g., Farm to Fork Excellence"
                                            className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                                Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                name="subtitle"
                                                value={formData.subtitle}
                                                onChange={handleChange}
                                                placeholder="e.g., FINE DINING • MUMBAI"
                                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="e.g., Mumbai"
                                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="w-full px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors"
                                >
                                    Next: Choose Theme →
                                </button>
                            </div>
                        )}

                        {/* Step 2: Theme Selection */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-gradient-to-r from-neon-magenta to-transparent" />
                                    Choose Your Menu Theme
                                </h2>

                                <p className="text-sm text-gray-400 mb-4">
                                    Select a visual style for your menu. You can change this later in settings.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.values(menuThemes).map((theme) => (
                                        <ThemeCard key={theme.id} theme={theme} />
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 px-6 py-3 rounded-lg border border-border/30 font-rajdhani font-bold text-muted-foreground hover:bg-background/80 transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors"
                                    >
                                        Next: Branding →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Branding & Final Options */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-gradient-to-r from-neon-gold to-transparent" />
                                    Branding & Logo
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                                Logo Text
                                            </label>
                                            <input
                                                type="text"
                                                name="logoText"
                                                value={formData.logoText}
                                                onChange={handleChange}
                                                placeholder="e.g., GARDEN"
                                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                                Logo Subtext
                                            </label>
                                            <input
                                                type="text"
                                                name="logoSubtext"
                                                value={formData.logoSubtext}
                                                onChange={handleChange}
                                                placeholder="e.g., Fresh • Organic • Exquisite"
                                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Copy Menu Items Option */}
                                    <div className="p-4 rounded-lg bg-background/80 border border-border/30">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.copyMenuItems}
                                                onChange={(e) => setFormData(prev => ({ ...prev, copyMenuItems: e.target.checked }))}
                                                className="mt-1 w-5 h-5 rounded border-border/30 text-neon-cyan focus:ring-neon-cyan/20"
                                            />
                                            <div>
                                                <span className="font-rajdhani font-bold text-foreground">
                                                    Copy sample menu items from LIVE BAR
                                                </span>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Start with pre-filled menu items and prices. You can edit or delete them later.
                                                    <br />
                                                    <strong className="text-yellow-500">Recommended: Leave unchecked</strong> to start with a clean menu.
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="flex-1 px-6 py-3 rounded-lg border border-border/30 font-rajdhani font-bold text-muted-foreground hover:bg-background/80 transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating Menu...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Create Menu
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMenuPage;
