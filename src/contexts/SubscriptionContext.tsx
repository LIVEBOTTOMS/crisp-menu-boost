import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    price_monthly: number;
    price_yearly: number;
    features: {
        max_venues: number;
        max_items: number;
        themes: string | string[];
        edit_access: boolean;
        customization: boolean;
        qr_codes: boolean;
        analytics: boolean | string;
        discount_codes: boolean;
        priority_support: boolean;
        custom_domain: boolean;
        api_access?: boolean;
    };
    tier_level: number;
}

interface UserSubscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    billing_period: 'monthly' | 'yearly';
    current_period_start: string;
    current_period_end: string | null;
    auto_renew: boolean;
}

interface SubscriptionContextType {
    subscription: UserSubscription | null;
    plan: SubscriptionPlan | null;
    isLoading: boolean;
    isPremium: boolean;
    isPremiumPlus: boolean;
    isFree: boolean;
    canAccess: (feature: keyof SubscriptionPlan['features']) => boolean;
    getFeatureValue: (feature: keyof SubscriptionPlan['features']) => any;
    refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubscription = async () => {
        if (!user) {
            setSubscription(null);
            setPlan(null);
            setIsLoading(false);
            return;
        }

        try {
            // Fetch user's subscription
            const { data: subData, error: subError } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .single();

            if (subError && subError.code !== 'PGRST116') {
                throw subError;
            }

            if (subData) {
                setSubscription(subData as UserSubscription);

                // Fetch the plan details
                const { data: planData, error: planError } = await supabase
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', subData.plan_id)
                    .single();

                if (planError) throw planError;
                setPlan(planData as SubscriptionPlan);
            } else {
                // No subscription found - should not happen due to trigger, but handle gracefully
                setSubscription(null);
                setPlan(null);
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [user]);

    // Real-time subscription updates
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('subscription_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_subscriptions',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchSubscription();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const canAccess = (feature: keyof SubscriptionPlan['features']): boolean => {
        if (!plan) return false;

        const featureValue = plan.features[feature];

        // Handle boolean features
        if (typeof featureValue === 'boolean') {
            return featureValue;
        }

        // Handle numeric features (-1 means unlimited)
        if (typeof featureValue === 'number') {
            return featureValue !== 0;
        }

        // Handle string features (like analytics: 'basic' or 'advanced')
        if (typeof featureValue === 'string') {
            return featureValue !== '' && featureValue !== 'false';
        }

        // Handle array features (like themes)
        if (Array.isArray(featureValue)) {
            return featureValue.length > 0;
        }

        return false;
    };

    const getFeatureValue = (feature: keyof SubscriptionPlan['features']): any => {
        return plan?.features[feature] ?? null;
    };

    const value: SubscriptionContextType = {
        subscription,
        plan,
        isLoading,
        isPremium: plan?.tier_level === 1,
        isPremiumPlus: plan?.tier_level === 2,
        isFree: plan?.tier_level === 0,
        canAccess,
        getFeatureValue,
        refreshSubscription: fetchSubscription,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
