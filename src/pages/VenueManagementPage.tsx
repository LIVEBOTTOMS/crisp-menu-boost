import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Store,
    ExternalLink,
    CheckCircle2,
    XCircle,
    MoreVertical,
    MapPin,
    Calendar
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Venue {
    id: string;
    name: string;
    slug: string;
    city: string;
    is_active: boolean;
    created_at: string;
    owner_id: string;
    owner_email?: string;
}

export function VenueManagementPage() {
    const { isAdmin } = useAuth();
    const { toast } = useToast();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchVenues();
        }
    }, [isAdmin]);

    const fetchVenues = async () => {
        setIsLoading(true);
        try {
            // Get venues and attempt to link with auth.users if possible
            // Since we can't directly join auth.users in a public query easily without specialized views,
            // we'll fetch venues and then fetch user counts or emails if needed.
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('🏢 Venues fetched from database:', data);
            console.log('🏢 Total venues count:', data?.length);

            setVenues(data || []);
        } catch (error) {
            console.error('Error fetching venues:', error);
            toast({
                title: "Error",
                description: "Failed to load venues",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVenueStatus = async (venueId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('venues')
                .update({ is_active: !currentStatus })
                .eq('id', venueId);

            if (error) throw error;

            toast({
                title: "Status Updated",
                description: `Venue is now ${!currentStatus ? 'Active' : 'Inactive'}`,
            });

            setVenues(venues.map(v => v.id === venueId ? { ...v, is_active: !currentStatus } : v));
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update venue status",
                variant: "destructive"
            });
        }
    };

    const filteredVenues = venues.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Venue Management</h2>
                    <p className="text-slate-400">Manage all registered businesses on the platform</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search venues..."
                        className="pl-10 bg-slate-900 border-slate-800 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-500">Loading businesses...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredVenues.map((venue) => (
                        <Card key={venue.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                            <Store className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {venue.name}
                                                </h3>
                                                <Badge className={venue.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-slate-700"}>
                                                    {venue.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {venue.city || 'Unknown City'}
                                                </span>
                                                <span className="text-slate-600">•</span>
                                                <span className="flex items-center gap-1 font-mono text-xs">
                                                    /{venue.slug}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="hidden lg:block">
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Created on</div>
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {new Date(venue.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                                                onClick={() => window.open(`/menu/${venue.slug}`, '_blank')}
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Live View
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                                                    <DropdownMenuItem onClick={() => toggleVenueStatus(venue.id, venue.is_active)}>
                                                        {venue.is_active ? (
                                                            <div className="flex items-center text-orange-400">
                                                                <XCircle className="w-4 h-4 mr-2" /> Deactivate
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center text-emerald-400">
                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Activate
                                                            </div>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => window.open(`/edit-menu/${venue.slug}`, '_blank')}>
                                                        Edit Content
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400">
                                                        Delete Business
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredVenues.length === 0 && (
                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                            <Store className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No businesses found matching your search</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
