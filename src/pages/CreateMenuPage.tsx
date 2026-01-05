import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { toast } from "sonner";
import { snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";

const CreateMenuPage = () => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        tagline: "",
        subtitle: "",
        city: "",
        address: "",
        phone: "",
        email: "",
        logoText: "",
        logoSubtext: "",
        qrCodeLabel: "Scan for Location",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name' && !formData.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
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
            // Create venue
            const { data: venue, error: venueError } = await supabase
                .from('venues')
                .insert({
                    name: formData.name,
                    slug: formData.slug,
                    tagline: formData.tagline || null,
                    subtitle: formData.subtitle || null,
                    city: formData.city || null,
                    address: formData.address || null,
                    phone: formData.phone || null,
                    email: formData.email || null,
                    logo_text: formData.logoText || formData.name,
                    logo_subtext: formData.logoSubtext || null,
                    qr_code_label: formData.qrCodeLabel || 'Scan for Location',
                })
                .select()
                .single();

            if (venueError) throw venueError;

            // Copy default menu structure
            const menuItems = [];

            // Add snacks and starters
            snacksAndStarters.categories.forEach((category, catIndex) => {
                category.items.forEach((item, itemIndex) => {
                    menuItems.push({
                        venue_id: venue.id,
                        section_type: 'snacks',
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

            // Add food menu
            foodMenu.categories.forEach((category, catIndex) => {
                category.items.forEach((item, itemIndex) => {
                    menuItems.push({
                        venue_id: venue.id,
                        section_type: 'food',
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

            // Add beverages
            beveragesMenu.categories.forEach((category, catIndex) => {
                category.items.forEach((item, itemIndex) => {
                    menuItems.push({
                        venue_id: venue.id,
                        section_type: 'beverages',
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

            // Add sides
            sideItems.categories.forEach((category, catIndex) => {
                category.items.forEach((item, itemIndex) => {
                    menuItems.push({
                        venue_id: venue.id,
                        section_type: 'sides',
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

            // Insert all menu items
            const { error: itemsError } = await supabase
                .from('venue_menu_items')
                .insert(menuItems);

            if (itemsError) throw itemsError;

            toast.success(`Menu "${formData.name}" created successfully!`);
            navigate(`/edit-menu/${formData.slug}`);
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
                            Set up your restaurant details - menu items can be edited later
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateMenu} className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-sm p-8 space-y-6">
                        {/* Basic Information */}
                        <div>
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
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                <div className="h-[2px] w-8 bg-gradient-to-r from-neon-magenta to-transparent" />
                                Contact Information (Optional)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="e.g., Bandra West, Mumbai"
                                        className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="e.g., +91 1234567890"
                                            className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="e.g., hello@restaurant.com"
                                            className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Branding */}
                        <div>
                            <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                <div className="h-[2px] w-8 bg-gradient-to-r from-neon-gold to-transparent" />
                                Branding (Optional)
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
                                            placeholder="e.g., GARDEN (defaults to name)"
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

                                <div>
                                    <label className="block font-rajdhani text-sm font-bold text-foreground mb-2">
                                        QR Code Label
                                    </label>
                                    <input
                                        type="text"
                                        name="qrCodeLabel"
                                        value={formData.qrCodeLabel}
                                        onChange={handleChange}
                                        placeholder="e.g., Scan for Location"
                                        className="w-full px-4 py-3 rounded-lg bg-background border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                disabled={isCreating}
                                className="px-6 py-3 rounded-lg border border-border/30 font-rajdhani font-bold text-muted-foreground hover:bg-background/80 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
            </div>
        </div>
    );
};

export default CreateMenuPage;
