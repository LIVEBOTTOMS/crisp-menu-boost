import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Volume2, Flame, Eye, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface PremiumFeatureManagerProps {
    venueId: string;
    settings: any;
    onUpdate: () => void;
}

export const PremiumFeatureManager = ({ venueId, settings = {}, onUpdate }: PremiumFeatureManagerProps) => {
    const { toast } = useToast();
    const { isPremium, isPremiumPlus } = useSubscription();

    const features = [
        {
            id: 'enableGamification',
            label: 'Extreme Gamification',
            description: 'Enable mini-games and discount rewards.',
            icon: Zap,
            color: 'text-yellow-400',
            premium: false
        },
        {
            id: 'enableSocialPulse',
            label: 'Social Pulse',
            description: 'Live activity feed and popularity heatmaps.',
            icon: Eye,
            color: 'text-cyan-400',
            premium: true
        },
        {
            id: 'enableNutritionalMode',
            label: 'Nutritional Shimmer',
            description: 'Bio-scan mode for protein/carb/fat data.',
            icon: Flame,
            color: 'text-orange-400',
            premium: true
        },
        {
            id: 'enableAmbientSound',
            label: 'Ambient Soundscapes',
            description: 'Subtle rhythmic pulse based on theme.',
            icon: Volume2,
            color: 'text-purple-400',
            premium: true
        },
        {
            id: 'enableSecretMenu',
            label: 'Classified Selections',
            description: 'Unlock special items via game wins.',
            icon: Lock,
            color: 'text-pink-400',
            premium: true
        }
    ];

    const toggleFeature = async (featureId: string) => {
        const feature = features.find(f => f.id === featureId);

        // Subscription Check
        if (feature?.premium && !isPremium && !isPremiumPlus) {
            toast({
                title: 'Premium Feature',
                description: 'Please upgrade your plan to unlock Stage 3 experiences.',
                variant: 'destructive'
            });
            return;
        }

        const newSettings = {
            ...settings,
            [featureId]: !settings[featureId]
        };

        try {
            const { error } = await supabase
                .from('venues')
                .update({ settings: newSettings })
                .eq('id', venueId);

            if (error) throw error;

            toast({
                title: 'Feature Updated',
                description: `${features.find(f => f.id === featureId)?.label} has been ${newSettings[featureId] ? 'enabled' : 'disabled'}.`
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({
                title: 'Update Failed',
                description: 'Failed to update feature settings.',
                variant: 'destructive'
            });
        }
    };

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    Premium Experience Engine
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Control the advanced Stage 3 sensory and social features.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                            <div className="flex gap-3">
                                <div className={`p-2 rounded-lg bg-black/40 border border-white/10 group-hover:border-${feature.color.split('-')[1]}/30 transition-colors`}>
                                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm font-bold text-white cursor-pointer" htmlFor={feature.id}>
                                            {feature.label}
                                        </Label>
                                        {feature.premium && (
                                            <Badge variant="outline" className="text-[8px] h-4 px-1 border-cyan-500/30 text-cyan-400 uppercase tracking-tighter">
                                                Premium
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tight">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id={feature.id}
                                checked={!!settings[feature.id]}
                                onCheckedChange={() => toggleFeature(feature.id)}
                                disabled={feature.premium && !isPremium && !isPremiumPlus}
                                className="data-[state=checked]:bg-cyan-500"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
