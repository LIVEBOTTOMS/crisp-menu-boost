import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, TrendingDown, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { submitVote, hasUserVoted, getVoteCounts } from '@/lib/voteSystem';
import { toast } from 'sonner';

interface VoteButtonProps {
    itemId: string;
    venueId: string;
    itemName: string;
    originalPrice: number;
    onVoteSuccess?: (newDiscount: number) => void;
}

export const VoteButton = ({
    itemId,
    venueId,
    itemName,
    originalPrice,
    onVoteSuccess
}: VoteButtonProps) => {
    const [voteCount, setVoteCount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadVoteData();
    }, [itemId, venueId]);

    const loadVoteData = async () => {
        try {
            const [counts, voted] = await Promise.all([
                getVoteCounts(itemId, venueId),
                hasUserVoted(itemId, venueId)
            ]);

            setVoteCount(counts.voteCount);
            setDiscountPercent(counts.discountPercent);
            setHasVoted(voted);
        } catch (error) {
            console.error('Error loading vote data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVote = async () => {
        if (hasVoted || isVoting) return;

        setIsVoting(true);

        try {
            const result = await submitVote(itemId, venueId);

            if (result.success) {
                setVoteCount(result.voteCount);
                setDiscountPercent(result.discountPercent);
                setHasVoted(true);

                toast.success(
                    `🎉 ${result.message}`,
                    {
                        description: result.discountPercent === 10
                            ? '🔥 Maximum discount reached!'
                            : `${100 - result.voteCount % 10 * 10} more votes for next 1% off!`
                    }
                );

                onVoteSuccess?.(result.discountPercent);
            } else if (result.alreadyVoted) {
                setHasVoted(true);
                toast.info('You already voted for this item');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to submit vote');
        } finally {
            setIsVoting(false);
        }
    };

    const votesToNextDiscount = 10 - (voteCount % 10);
    const progressPercent = ((voteCount % 10) / 10) * 100;

    if (isLoading) {
        return (
            <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Help Icon */}
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-semibold">Community Discount</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-1 hover:bg-white/10 rounded-full transition-colors group">
                            <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-neon-cyan transition-colors" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 bg-slate-900 border-slate-700 shadow-xl">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                                <ThumbsUp className="w-5 h-5 text-neon-cyan" />
                                <h3 className="font-bold text-white">How Vote-to-Discount Works</h3>
                            </div>
                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex items-start gap-2">
                                    <span className="text-neon-cyan font-bold">1.</span>
                                    <p>Click "Vote for Discount" on items you love</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-neon-cyan font-bold">2.</span>
                                    <p>Every <strong className="text-white">10 votes = 1% discount</strong></p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-neon-cyan font-bold">3.</span>
                                    <p>Maximum discount: <strong className="text-green-400">10% (100 votes)</strong></p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-neon-cyan font-bold">4.</span>
                                    <p>Prices update <strong className="text-white">instantly</strong> for everyone!</p>
                                </div>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-xs text-blue-300">
                                <p>💡 <strong>Tip:</strong> You can only vote once per item. Help the community save!</p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            {/* Vote Button */}
            <motion.div
                whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                whileTap={{ scale: hasVoted ? 1 : 0.95 }}
            >
                <Button
                    onClick={handleVote}
                    disabled={hasVoted || isVoting || discountPercent >= 10}
                    className={`
            relative overflow-hidden w-full
            ${hasVoted
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-not-allowed'
                            : discountPercent >= 10
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-neon-cyan/90 hover:to-blue-500/90'
                        }
            text-white font-bold shadow-lg border-0
          `}
                    size="sm"
                >
                    {/* Background shimmer effect */}
                    {!hasVoted && discountPercent < 10 && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    )}

                    <div className="relative flex items-center gap-2">
                        {discountPercent >= 10 ? (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Max Discount!</span>
                            </>
                        ) : hasVoted ? (
                            <>
                                <ThumbsUp className="w-4 h-4 fill-current" />
                                <span>Voted</span>
                            </>
                        ) : (
                            <>
                                <ThumbsUp className="w-4 h-4" />
                                <span>Vote for Discount</span>
                            </>
                        )}
                    </div>
                </Button>
            </motion.div>

            {/* Vote Stats & Progress */}
            <div className="space-y-1">
                {/* Current Discount Badge */}
                <AnimatePresence mode="wait">
                    {discountPercent > 0 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                        >
                            <TrendingDown className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 font-bold text-sm">
                                {discountPercent}% OFF
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vote Count & Progress Bar */}
                {discountPercent < 10 && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{voteCount} votes</span>
                            <span className="text-neon-cyan">
                                {votesToNextDiscount} more for {discountPercent + 1}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-neon-cyan to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
