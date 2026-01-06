import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Copy, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { toast } from "sonner";

interface Venue {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    subtitle: string | null;
    city: string | null;
    created_at: string;
    logo_image_url?: string | null;
}

const MenusListPage = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchVenues();

        // Real-time synchronization for the menus list
        const channel = supabase
            .channel('venues-list-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'venues' }, () => fetchVenues())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = venues.filter(venue =>
                venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.city?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredVenues(filtered);
        } else {
            setFilteredVenues(venues);
        }
    }, [searchQuery, venues]);

    const fetchVenues = async () => {
        setIsLoading(true);
        try {
            // Fetch venues from database
            const { data, error } = await (supabase
                .from('venues' as any) as any)
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Default venues (LIVE and MoonWalk)
            const defaultVenues: Venue[] = [
                {
                    id: 'live-default',
                    name: 'LIVE BAR',
                    slug: 'live',
                    subtitle: 'FINE DINING • PUNE',
                    city: 'Pune',
                    created_at: new Date('2024-01-01').toISOString(),
                    logo_image_url: null,
                    tagline: 'Eat.Drink.Code.Repeat'
                },
                {
                    id: 'moonwalk-default',
                    name: 'MoonWalk NX',
                    slug: 'moonwalk-nx',
                    subtitle: 'FINE DINING • PUNE',
                    city: 'Pune',
                    created_at: new Date('2024-01-02').toISOString(),
                    logo_image_url: '/lovable-uploads/44cfff7f-ac94-4f62-8ebe-1ac4f6fc0df9.png',
                    tagline: 'Where Culinary Art Meets Innovation'
                }
            ];

            // Seed default venues to database if they don't exist
            for (const venue of defaultVenues) {
                const exists = data?.find((v: any) => v.slug === venue.slug);
                if (!exists) {
                    await (supabase.from('venues' as any) as any).insert({
                        name: venue.name,
                        slug: venue.slug,
                        tagline: venue.tagline,
                        subtitle: venue.subtitle,
                        city: venue.city,
                        logo_image_url: venue.logo_image_url,
                        logo_text: venue.slug === 'live' ? 'LIVE' : 'MOONWALK',
                        logo_subtext: venue.slug === 'live' ? 'Eat • Drink • Code • Repeat' : 'NX • Premium Dining',
                        theme: venue.slug === 'live' ? 'cyberpunk-tech' : 'elegant-classic',
                        is_active: true
                    });
                }
            }

            // Merge database venues with defaults (remove duplicates by slug)
            const dbVenues = data || [];
            const allVenues = [...defaultVenues];

            dbVenues.forEach((dbVenue: any) => {
                if (!defaultVenues.find(dv => dv.slug === dbVenue.slug)) {
                    allVenues.push(dbVenue);
                }
            });

            setVenues(allVenues);
            setFilteredVenues(allVenues);
        } catch (error) {
            console.error('Error fetching venues:', error);
            toast.error('Failed to load menus');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDuplicate = async (venue: Venue) => {
        try {
            // 1. Create a copy of the venue
            const newSlug = `${venue.slug}-copy-${Date.now()}`;
            const { data: newVenue, error: venueError } = await (supabase
                .from('venues' as any) as any)
                .insert({
                    name: `${venue.name} (Copy)`,
                    slug: newSlug,
                    tagline: venue.tagline,
                    subtitle: venue.subtitle,
                    city: venue.city,
                })
                .select()
                .single();

            if (venueError) throw venueError;

            // 2. Copy menu sections
            const { data: sections } = await supabase
                .from('menu_sections')
                .select('*')
                .eq('venue_id', venue.id);

            if (sections && sections.length > 0) {
                for (const section of sections) {
                    const { data: newSection } = await supabase
                        .from('menu_sections')
                        .insert({
                            venue_id: newVenue.id,
                            type: section.type,
                            title: section.title,
                            display_order: section.display_order
                        })
                        .select()
                        .single();

                    if (newSection) {
                        // 3. Copy categories
                        const { data: categories } = await supabase
                            .from('menu_categories')
                            .select('*')
                            .eq('section_id', section.id);

                        if (categories) {
                            for (const category of categories) {
                                const { data: newCategory } = await supabase
                                    .from('menu_categories')
                                    .insert({
                                        section_id: newSection.id,
                                        title: category.title,
                                        icon: category.icon,
                                        display_order: category.display_order
                                    })
                                    .select()
                                    .single();

                                if (newCategory) {
                                    // 4. Copy items
                                    const { data: items } = await supabase
                                        .from('menu_items')
                                        .select('*')
                                        .eq('category_id', category.id);

                                    if (items) {
                                        const itemsToInsert = (items as any[]).map(item => ({
                                            category_id: newCategory.id,
                                            name: item.name,
                                            description: item.description,
                                            price: item.price,
                                            half_price: item.half_price,
                                            full_price: item.full_price,
                                            sizes: item.sizes,
                                            display_order: item.display_order,
                                            image_url: item.image_url,
                                            is_best_seller: item.is_best_seller,
                                            is_chef_special: item.is_chef_special,
                                            is_new: item.is_new,
                                            is_veg: item.is_veg,
                                            is_spicy: item.is_spicy,
                                            is_premium: item.is_premium,
                                            is_top_shelf: item.is_top_shelf
                                        }));
                                        await supabase.from('menu_items').insert(itemsToInsert);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            toast.success('Menu duplicated successfully');
            fetchVenues();
        } catch (error) {
            console.error('Error duplicating menu:', error);
            toast.error('Failed to duplicate menu');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await (supabase
                .from('venues' as any) as any)
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;

            toast.success('Menu deleted successfully');
            fetchVenues();
        } catch (error) {
            console.error('Error deleting venue:', error);
            toast.error('Failed to delete menu');
        }
    };

    return (
        <div className="min-h-screen bg-background relative">
            <BackgroundEffects />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-lg border border-border/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-neon-cyan" />
                        </button>
                        <div>
                            <h1 className="font-cinzel text-4xl font-bold text-foreground gradient-text">
                                Your Menus
                            </h1>
                            <p className="font-rajdhani text-muted-foreground mt-1">
                                Manage all your restaurant menus
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/create-menu')}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Menu
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search menus by name, city, or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-background/60 border border-border/30 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 font-rajdhani text-foreground placeholder:text-muted-foreground transition-all"
                        />
                    </div>
                </div>

                {/* Menus Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
                        <span className="ml-4 font-rajdhani text-muted-foreground">Loading menus...</span>
                    </div>
                ) : filteredVenues.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVenues.map((venue) => (
                            <div
                                key={venue.id}
                                className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm hover:border-neon-cyan/50 transition-all duration-300"
                            >
                                {/* Main Content */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-cinzel text-xl font-bold text-foreground mb-1 group-hover:text-neon-cyan transition-colors">
                                                {venue.name}
                                            </h3>
                                            {venue.subtitle && (
                                                <p className="font-rajdhani text-sm text-muted-foreground">
                                                    {venue.subtitle}
                                                </p>
                                            )}
                                            {venue.city && (
                                                <p className="font-rajdhani text-xs text-muted-foreground/70 mt-1">
                                                    📍 {venue.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {venue.tagline && (
                                        <p className="font-rajdhani text-sm text-muted-foreground italic mb-4 line-clamp-2">
                                            "{venue.tagline}"
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground/70 mb-4">
                                        <span>Created {new Date(venue.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => navigate(`/menu/${venue.slug}`)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 transition-colors"
                                            title="View Menu"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => navigate(`/edit-menu/${venue.slug}`)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-neon-gold/10 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/20 transition-colors"
                                            title="Edit Menu"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDuplicate(venue)}
                                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/20 transition-colors"
                                            title="Duplicate Menu"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border-2 border-neon-cyan/30 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-neon-cyan" />
                        </div>
                        <h3 className="font-cinzel text-2xl font-bold text-foreground mb-3">
                            {searchQuery ? 'No Menus Found' : 'No Menus Yet'}
                        </h3>
                        <p className="font-rajdhani text-muted-foreground text-lg mb-6">
                            {searchQuery
                                ? `No menus match "${searchQuery}"`
                                : 'Create your first menu to get started'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/create-menu')}
                                className="px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors"
                            >
                                Create First Menu
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenusListPage;
