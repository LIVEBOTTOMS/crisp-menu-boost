import { supabase } from '@/integrations/supabase/client';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Initialize fingerprint
let fpPromise: Promise<any> | null = null;

const getFingerprint = async (): Promise<string> => {
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
};

// Get user's IP address (best effort)
const getUserIP = async (): Promise<string | null> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return null;
    }
};

export interface VoteResult {
    success: boolean;
    voteCount: number;
    discountPercent: number;
    message: string;
    alreadyVoted?: boolean;
}

export interface ItemDiscountInfo {
    voteCount: number;
    discountPercent: number;
    originalPrice: number;
    discountedPrice: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Verify user is at the venue location
 */
export const verifyVenueLocation = async (venueId: string): Promise<{ allowed: boolean; message: string }> => {
    try {
        // Get venue coordinates
        const { data: venue } = await (supabase
            .from('venues' as any) as any)
            .select('latitude, longitude, geofence_radius_meters')
            .eq('id', venueId)
            .single();

        if (!venue?.latitude || !venue?.longitude) {
            return { allowed: true, message: 'Location not configured' };
        }

        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });

        const distance = calculateDistance(
            position.coords.latitude, position.coords.longitude,
            venue.latitude, venue.longitude
        );

        const radius = venue.geofence_radius_meters || 100;
        if (distance <= radius) {
            return { allowed: true, message: `You're at the venue (${Math.round(distance)}m)` };
        }
        return { allowed: false, message: `Please visit ${Math.round(distance)}m closer to vote (max ${radius}m)` };
    } catch (error: any) {
        if (error?.code === 1) { // PERMISSION_DENIED
            return { allowed: false, message: 'Enable location access to vote' };
        }
        return { allowed: true, message: 'Location check skipped' }; // Be lenient on errors
    }
};

/**
 * Submit a vote for an item
 * @param itemId - Composite ID like "starters_0_0" (section_categoryIndex_itemIndex)
 * @param venueId - Venue UUID
 * @param skipLocationCheck - Skip geolocation verification (for testing)
 * @returns Vote result with updated counts
 */
export const submitVote = async (
    itemId: string,
    venueId: string,
    skipLocationCheck: boolean = false
): Promise<VoteResult> => {
    try {
        // Verify location first (unless skipped)
        if (!skipLocationCheck) {
            const locationCheck = await verifyVenueLocation(venueId);
            if (!locationCheck.allowed) {
                return {
                    success: false,
                    voteCount: 0,
                    discountPercent: 0,
                    message: locationCheck.message,
                };
            }
        }

        // Get voter fingerprint
        const fingerprint = await getFingerprint();
        const ip = await getUserIP();

        // Check if already voted
        const { data: existingVote, error: checkError } = await (supabase
            .from('item_votes' as any) as any)
            .select('id')
            .eq('item_id', itemId)
            .eq('venue_id', venueId)
            .eq('voter_fingerprint', fingerprint)
            .single();

        if (existingVote) {
            // Already voted
            const counts = await getVoteCounts(itemId, venueId);
            return {
                success: false,
                alreadyVoted: true,
                voteCount: counts.voteCount,
                discountPercent: counts.discountPercent,
                message: 'You have already voted for this item',
            };
        }

        // Submit vote
        const { error: insertError } = await (supabase
            .from('item_votes' as any) as any)
            .insert({
                item_id: itemId,
                venue_id: venueId,
                voter_fingerprint: fingerprint,
                voter_ip: ip,
            });

        if (insertError) throw insertError;

        // Get updated counts
        const counts = await getVoteCounts(itemId, venueId);

        return {
            success: true,
            voteCount: counts.voteCount,
            discountPercent: counts.discountPercent,
            message: `Vote counted! ${counts.voteCount} votes = ${counts.discountPercent}% discount`,
        };
    } catch (error: any) {
        console.error('Error submitting vote:', error);
        return {
            success: false,
            voteCount: 0,
            discountPercent: 0,
            message: 'Failed to submit vote. Please try again.',
        };
    }
};

/**
 * Get current vote counts and discount for an item
 */
export const getVoteCounts = async (
    itemId: string,
    venueId: string
): Promise<{ voteCount: number; discountPercent: number }> => {
    try {
        const { data, error } = await (supabase
            .from('item_vote_counts' as any) as any)
            .select('vote_count, discount_percent')
            .eq('item_id', itemId)
            .eq('venue_id', venueId)
            .single();

        if (error || !data) {
            return { voteCount: 0, discountPercent: 0 };
        }

        return {
            voteCount: data.vote_count || 0,
            discountPercent: data.discount_percent || 0,
        };
    } catch {
        return { voteCount: 0, discountPercent: 0 };
    }
};

/**
 * Check if current user has voted for an item
 */
export const hasUserVoted = async (
    itemId: string,
    venueId: string
): Promise<boolean> => {
    try {
        const fingerprint = await getFingerprint();

        const { data, error } = await (supabase
            .from('item_votes' as any) as any)
            .select('id')
            .eq('item_id', itemId)
            .eq('venue_id', venueId)
            .eq('voter_fingerprint', fingerprint)
            .single();

        return !!data;
    } catch {
        return false;
    }
};

/**
 * Calculate discounted price based on original price and vote count
 */
export const calculateDiscountedPrice = (
    originalPrice: number,
    voteCount: number
): { discountedPrice: number; discountPercent: number } => {
    const discountPercent = Math.min(Math.floor(voteCount / 10), 10);
    const discountAmount = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - discountAmount;

    return {
        discountedPrice: Math.round(discountedPrice),
        discountPercent,
    };
};

/**
 * Set original price for an item (admin only)
 */
export const setOriginalPrice = async (
    itemId: string,
    venueId: string,
    price: number
): Promise<boolean> => {
    try {
        const { error } = await (supabase
            .from('item_original_prices' as any) as any)
            .upsert({
                item_id: itemId,
                venue_id: venueId,
                original_price: price,
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error setting original price:', error);
        return false;
    }
};

/**
 * Reset all votes for an item (admin only)
 */
export const resetItemVotes = async (
    itemId: string,
    venueId: string
): Promise<boolean> => {
    try {
        const { error } = await (supabase.rpc as any)('reset_item_votes', {
            p_item_id: itemId,
            p_venue_id: venueId,
        });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error resetting votes:', error);
        return false;
    }
};
