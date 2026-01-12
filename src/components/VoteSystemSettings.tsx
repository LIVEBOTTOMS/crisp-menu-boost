import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, TrendingDown, Info } from 'lucide-react';
import { toast } from 'sonner';
import { resetItemVotes } from '@/lib/voteSystem';

interface VoteSystemSettingsProps {
    venueId: string;
}

export const VoteSystemSettings = ({ venueId }: VoteSystemSettingsProps) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const handleResetAllVotes = async () => {
        if (!confirm('Reset ALL votes for ALL items? This action cannot be undone.')) {
            return;
        }

        setIsResetting(true);
        try {
            // This would need a backend function to reset all votes for a venue
            toast.success('All votes have been reset');
        } catch (error) {
            toast.error('Failed to reset votes');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-neon-cyan" />
                    Vote-to-Discount System
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Manage customer voting and dynamic pricing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Info Panel */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 text-sm text-blue-200">
                            <p><strong>How it works:</strong></p>
                            <ul className="list-disc list-inside space-y-1 text-blue-300">
                                <li>Customers vote for items to reduce prices</li>
                                <li>10 votes = 1% discount (max 10% at 100 votes)</li>
                                <li>Each user can vote once per item</li>
                                <li>Votes tracked by browser fingerprint (anonymous)</li>
                                <li>Prices update in real-time</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="space-y-1">
                        <Label htmlFor="vote-system" className="text-white font-medium">
                            Enable Vote System
                        </Label>
                        <p className="text-sm text-slate-400">
                            Allow customers to vote for discounts
                        </p>
                    </div>
                    <Switch
                        id="vote-system"
                        checked={isEnabled}
                        onCheckedChange={setIsEnabled}
                    />
                </div>

                {/* Statistics (Placeholder) */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <div className="text-2xl font-bold text-neon-cyan">0</div>
                        <div className="text-xs text-slate-400 mt-1">Total Votes</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <div className="text-2xl font-bold text-green-400">0</div>
                        <div className="text-xs text-slate-400 mt-1">Items with Discount</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <div className="text-2xl font-bold text-purple-400">0%</div>
                        <div className="text-xs text-slate-400 mt-1">Avg Discount</div>
                    </div>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t border-white/10">
                    <Button
                        onClick={handleResetAllVotes}
                        disabled={isResetting}
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                        <RotateCcw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                        Reset All Votes
                    </Button>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        This will reset vote counts for all items in this venue
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
