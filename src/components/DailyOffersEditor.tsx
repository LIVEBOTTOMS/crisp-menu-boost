import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Tag, Percent, Save, RefreshCw } from 'lucide-react';

interface DailyOffer {
    id?: string;
    day_of_week: string;
    offer_text: string;
    offer_type: 'special' | 'discount' | 'event';
    is_active: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Quick offer templates for common promotions
const OFFER_TEMPLATES = [
    { label: 'Buy 1 Get 1 Free - Curated Drinks', text: 'Buy 1 Get 1 Free on Curated Drinks', type: 'special' as const },
    { label: '10% Off BYOC', text: '10% Extra Off - Bring Your Own Card (Valid ID)', type: 'discount' as const },
    { label: 'Ladies Night - Free Drink', text: "Ladies Night - 1st Drink Free (IMFL & Cocktails)", type: 'event' as const },
    { label: 'Happy Hour 50% Off', text: 'Happy Hour - 50% Off on Selected Items', type: 'discount' as const },
    { label: 'Unlimited Starters', text: 'Unlimited Starters with Main Course', type: 'special' as const },
    { label: 'Free Dessert', text: 'Complimentary Dessert with Any Main Course', type: 'special' as const },
    { label: 'Student Discount', text: '20% Off for Students (Valid ID Required)', type: 'discount' as const },
    { label: 'Family Brunch', text: 'Family Brunch - Kids Eat Free', type: 'event' as const },
    { label: 'Couples Special', text: 'Couples Special - 2 Mains + 1 Dessert', type: 'special' as const },
    { label: 'Live Music Night', text: 'Live Music Night - Free Entry + Special Menu', type: 'event' as const },
];

const DEFAULT_OFFERS: Record<string, DailyOffer> = {
    Monday: { day_of_week: 'Monday', offer_text: 'Monday Madness - 20% Off', offer_type: 'discount', is_active: true },
    Tuesday: { day_of_week: 'Tuesday', offer_text: 'Taco Tuesday', offer_type: 'special', is_active: true },
    Wednesday: { day_of_week: 'Wednesday', offer_text: 'Wine Wednesday', offer_type: 'special', is_active: true },
    Thursday: { day_of_week: 'Thursday', offer_text: '', offer_type: 'special', is_active: false },
    Friday: { day_of_week: 'Friday', offer_text: 'Happy Hour 5-8 PM', offer_type: 'event', is_active: true },
    Saturday: { day_of_week: 'Saturday', offer_text: 'Weekend Brunch', offer_type: 'special', is_active: true },
    Sunday: { day_of_week: 'Sunday', offer_text: 'Family Sunday - Kids Eat Free', offer_type: 'event', is_active: true },
};

interface DailyOffersEditorProps {
    venueId: string;
}

export const DailyOffersEditor = ({ venueId }: DailyOffersEditorProps) => {
    const [offers, setOffers] = useState<Record<string, DailyOffer>>(DEFAULT_OFFERS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchOffers();
    }, [venueId]);

    const fetchOffers = async () => {
        try {
            const { data, error } = await supabase
                .from('daily_offers')
                .select('*')
                .eq('venue_id', venueId);

            if (error) throw error;

            if (data && data.length > 0) {
                const offersMap: Record<string, DailyOffer> = { ...DEFAULT_OFFERS };
                data.forEach((offer: any) => {
                    offersMap[offer.day_of_week] = {
                        id: offer.id,
                        day_of_week: offer.day_of_week,
                        offer_text: offer.offer_text || '',
                        offer_type: offer.offer_type || 'special',
                        is_active: offer.is_active,
                    };
                });
                setOffers(offersMap);
            }
        } catch (error: any) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to load daily offers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOfferChange = (day: string, field: keyof DailyOffer, value: any) => {
        setOffers(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const offersToSave = Object.values(offers).map(offer => ({
                ...offer,
                venue_id: venueId,
                id: undefined, // Remove id for upsert
            }));

            // Delete existing offers first
            await supabase
                .from('daily_offers')
                .delete()
                .eq('venue_id', venueId);

            // Insert new offers
            const { error } = await supabase
                .from('daily_offers')
                .insert(offersToSave);

            if (error) throw error;

            toast.success('Daily offers saved successfully!');
            fetchOffers(); // Refresh to get IDs
        } catch (error: any) {
            console.error('Error saving offers:', error);
            toast.error('Failed to save daily offers: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const getOfferIcon = (type: 'special' | 'discount' | 'event') => {
        switch (type) {
            case 'discount':
                return <Percent className="w-4 h-4" />;
            case 'event':
                return <Sparkles className="w-4 h-4" />;
            case 'special':
            default:
                return <Tag className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardContent className="py-12 flex justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-neon-cyan" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-neon-cyan" />
                    Daily Offers & Specials
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Configure special offers and promotions for each day of the week
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {DAYS.map(day => {
                        const offer = offers[day];
                        return (
                            <div key={day} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                                {/* Day Label */}
                                <div className="md:col-span-2 flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${offer.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />
                                        <Label className="text-white font-bold">{day}</Label>
                                    </div>
                                </div>

                                {/* Quick Templates Dropdown */}
                                <div className="md:col-span-2">
                                    <Select
                                        value=""
                                        onValueChange={(value) => {
                                            const template = OFFER_TEMPLATES[parseInt(value)];
                                            if (template) {
                                                handleOfferChange(day, 'offer_text', template.text);
                                                handleOfferChange(day, 'offer_type', template.type);
                                                handleOfferChange(day, 'is_active', true);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                                            <SelectValue placeholder="📋 Templates" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 max-h-80">
                                            {OFFER_TEMPLATES.map((template, idx) => (
                                                <SelectItem
                                                    key={idx}
                                                    value={idx.toString()}
                                                    className="text-white focus:bg-slate-800"
                                                >
                                                    {template.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Offer Text */}
                                <div className="md:col-span-3">
                                    <Input
                                        value={offer.offer_text}
                                        onChange={(e) => handleOfferChange(day, 'offer_text', e.target.value)}
                                        placeholder={`Enter ${day}'s special offer...`}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                    />
                                </div>

                                {/* Offer Type */}
                                <div className="md:col-span-3">
                                    <Select
                                        value={offer.offer_type}
                                        onValueChange={(value) => handleOfferChange(day, 'offer_type', value)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="special" className="text-white focus:bg-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {getOfferIcon('special')}
                                                    <span>Special</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="discount" className="text-white focus:bg-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {getOfferIcon('discount')}
                                                    <span>Discount</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="event" className="text-white focus:bg-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {getOfferIcon('event')}
                                                    <span>Event</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Active Toggle */}
                                <div className="md:col-span-2 flex items-center justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOfferChange(day, 'is_active', !offer.is_active)}
                                        className={`
                      ${offer.is_active
                                                ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30'
                                                : 'bg-gray-500/20 border-gray-500/50 text-gray-400 hover:bg-gray-500/30'
                                            }
                    `}
                                    >
                                        {offer.is_active ? 'Active' : 'Inactive'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchOffers}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="bg-neon-cyan text-black hover:bg-neon-cyan/90 font-bold"
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save All Offers
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
