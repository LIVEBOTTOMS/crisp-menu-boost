import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Settings, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundEffects } from "@/components/BackgroundEffects";

interface Venue {
    id: string;
    name: string;
    slug: string;
    subtitle: string | null;
    city: string | null;
    created_at: string;
}

const HomePage = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [activeTab, setActiveTab] = useState<string>("live");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setVenues(data || []);
        } catch (error) {
            console.error('Error fetching venues:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateMenu = () => {
        navigate('/create-menu');
    };

    // LIVE is the original menu (from Index.tsx)
    const currentMenus = [
        {
            slug: "live",
            name: "LIVE BAR",
            subtitle: "FINE DINING • PUNE",
            isDefault: true
        },
        ...venues
    ];

    const activeMenu = currentMenus.find(m => m.slug === activeTab) || currentMenus[0];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <BackgroundEffects />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-cinzel text-4xl font-bold text-foreground gradient-text">
                            Menu Dashboard
                        </h1>
                        <p className="font-rajdhani text-muted-foreground mt-1">
                            Manage your restaurant menus
                        </p>
                    </div>

                    <button
                        onClick={handleCreateMenu}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-rajdhani font-bold hover:bg-neon-cyan/20 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Menu
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {currentMenus.map((menu) => (
                            <button
                                key={menu.slug}
                                onClick={() => setActiveTab(menu.slug)}
                                className={`
                  relative px-6 py-3 rounded-lg font-rajdhani font-bold tracking-wide transition-all whitespace-nowrap
                  ${activeTab === menu.slug
                                        ? 'bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan'
                                        : 'bg-background/60 border border-border/30 text-muted-foreground hover:border-neon-cyan/50 hover:text-foreground'
                                    }
                `}
                            >
                                <span>{menu.name}</span>
                                {menu.isDefault && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-neon-gold/20 text-neon-gold border border-neon-gold/30">
                                        Current
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Actions */}
                {!isLoading && activeMenu && (
                    <div className="max-w-4xl mx-auto">
                        {/* Menu Info Card */}
                        <div className="rounded-2xl border border-border/30 bg-background/60 backdrop-blur-sm p-8 mb-6">
                            <div className="text-center mb-8">
                                <h2 className="font-cinzel text-4xl font-bold text-foreground mb-2">
                                    {activeMenu.name}
                                </h2>
                                {activeMenu.subtitle && (
                                    <p className="font-rajdhani text-lg text-muted-foreground">
                                        {activeMenu.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* View Menu */}
                                <div
                                    onClick={() => navigate(`/menu/${activeMenu.slug}`)}
                                    className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-neon-magenta/30 bg-background/40 p-6 hover:border-neon-magenta hover:bg-neon-magenta/5 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center mb-4 group-hover:bg-neon-magenta/20 transition-colors">
                                            <Eye className="w-6 h-6 text-neon-magenta" />
                                        </div>

                                        <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                                            View Menu
                                        </h3>

                                        <p className="font-rajdhani text-muted-foreground text-sm">
                                            See the public-facing menu as your customers would see it
                                        </p>
                                    </div>

                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-neon-magenta/20 group-hover:border-neon-magenta/60 transition-colors" />
                                </div>

                                {/* Admin Panel */}
                                <div
                                    onClick={() => navigate(activeMenu.isDefault ? '/admin' : `/edit-menu/${activeMenu.slug}`)}
                                    className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-neon-cyan/30 bg-background/40 p-6 hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                                            <Settings className="w-6 h-6 text-neon-cyan" />
                                        </div>

                                        <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
                                            Admin Panel
                                        </h3>

                                        <p className="font-rajdhani text-muted-foreground text-sm">
                                            Edit menu items, prices, descriptions, and manage settings
                                        </p>
                                    </div>

                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-neon-cyan/20 group-hover:border-neon-cyan/60 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {!activeMenu.isDefault && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-lg border border-border/30 bg-background/40 p-4 text-center">
                                    <p className="font-rajdhani text-xs text-muted-foreground mb-1">Created</p>
                                    <p className="font-cinzel text-sm font-bold text-foreground">
                                        {new Date(activeMenu.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border/30 bg-background/40 p-4 text-center">
                                    <p className="font-rajdhani text-xs text-muted-foreground mb-1">Status</p>
                                    <p className="font-cinzel text-sm font-bold text-neon-cyan">Active</p>
                                </div>
                                <div className="rounded-lg border border-border/30 bg-background/40 p-4 text-center">
                                    <p className="font-rajdhani text-xs text-muted-foreground mb-1">URL</p>
                                    <p className="font-rajdhani text-xs font-bold text-foreground truncate">
                                        /menu/{activeMenu.slug}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
                        <span className="ml-4 font-rajdhani text-muted-foreground">Loading menus...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
