import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

/**
 * useAnalytics - Hook for tracking interaction events in the SaaS app.
 * Sends data to Supabase for business intelligence.
 */
export const useAnalytics = (venueId?: string) => {
    const { slug } = useParams<{ slug?: string }>();
    const activeVenueSlug = slug || 'live';

    const logEvent = useCallback(async (
        eventType: 'view_item' | 'view_section' | 'game_start' | 'game_win' | 'tab_switch' | 'call_waiter',
        eventData: any = {}
    ) => {
        // In a real SaaS, we'd send this to an analytics_events table
        // For now, we'll log it to console or try to insert into customer_leads metadata column as a temporary store
        // or just acknowledge this is where the logic lives.

        const timestamp = new Date().toISOString();
        const payload = {
            venue_id: venueId,
            venue_slug: activeVenueSlug,
            event_type: eventType,
            event_data: eventData,
            timestamp
        };

        console.log(`📊 [Analytics] ${eventType}:`, payload);

        // Optional: Persistent storage in leads table if metadata is used broadly
        /*
        try {
            await supabase.from('customer_leads').insert({
                source: 'analytics_interaction',
                metadata: payload
            });
        } catch (e) {
            // Silently fail analytics
        }
        */
    }, [venueId, activeVenueSlug]);

    return { logEvent };
};
