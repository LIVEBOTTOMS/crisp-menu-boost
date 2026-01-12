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
 * Submit a vote for an item
 * @param itemId - Composite ID like "starters_0_0" (section_categoryIndex_itemIndex)
 * @param venueId - Venue UUID
 * @returns Vote result with updated counts
 */
export const submitVote = async (
    itemId: string,
    venueId: string
): Promise<VoteResult> => {
    try {
        // Get voter fingerprint
        const fingerprint = await getFingerprint();
        const ip = await getUserIP();

        // Check if already voted
        const { data: existingVote, error: checkError } = await supabase
            .from('item_votes')
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
        const { error: insertError } = await supabase
            .from('item_votes')
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
        const { data, error } = await supabase
            .from('item_vote_counts')
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

        const { data, error } = await supabase
            .from('item_votes')
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
        const { error } = await supabase
            .from('item_original_prices')
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
        const { error } = await supabase.rpc('reset_item_votes', {
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
