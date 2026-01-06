import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from './ui/animated-button';
import { Lock, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface UpgradePromptProps {
    feature: string;
    requiredTier: 'Premium' | 'Premium+';
    variant?: 'inline' | 'modal' | 'banner';
    className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
    feature,
    requiredTier,
    variant = 'inline',
    className = '',
}) => {
    const navigate = useNavigate();

    const tierInfo = {
        Premium: {
            price: '₹199/month',
            icon: Sparkles,
            color: 'cyan',
        },
        'Premium+': {
            price: '₹249/month',
            icon: Zap,
            color: 'purple',
        },
    };

    const info = tierInfo[requiredTier];
    const Icon = info.icon;

    if (variant === 'inline') {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-${info.color}-500/10 to-${info.color}-600/10 border border-${info.color}-500/20 ${className}`}>
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-300">{feature}</span>
                <button
                    onClick={() => navigate('/pricing')}
                    className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                    Upgrade to {requiredTier}
                </button>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className={`p-4 rounded-xl bg-gradient-to-r from-${info.color}-500/10 to-${info.color}-600/10 border border-${info.color}-500/20 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${info.color}-400 to-${info.color}-600 flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white">{feature} is a {requiredTier} feature</p>
                            <p className="text-sm text-gray-400">Upgrade to unlock this and more premium features</p>
                        </div>
                    </div>
                    <AnimatedButton
                        onClick={() => navigate('/pricing')}
                        variant="primary"
                        size="sm"
                    >
                        Upgrade Now
                    </AnimatedButton>
                </div>
            </div>
        );
    }

    // Modal variant
    return (
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full animate-scale-in">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${info.color}-400 to-${info.color}-600 flex items-center justify-center`}>
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-white">{feature}</h3>
                    <p className="text-gray-400">This feature requires {requiredTier}</p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-gray-300">Unlock all premium features</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-gray-300">Priority support</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-gray-300">Starting at {info.price}</span>
                    </div>
                </div>

                <AnimatedButton
                    onClick={() => navigate('/pricing')}
                    variant="primary"
                    size="lg"
                    className="w-full mb-3"
                >
                    View Pricing Plans
                </AnimatedButton>
                <button
                    onClick={() => window.history.back()}
                    className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

// Locked Feature Card - for displaying locked features
interface LockedFeatureCardProps {
    title: string;
    description: string;
    requiredTier: 'Premium' | 'Premium+';
    children?: React.ReactNode;
}

export const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({
    title,
    description,
    requiredTier,
    children,
}) => {
    const navigate = useNavigate();

    return (
        <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-10" />

            {/* Lock icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="mt-4 text-center">
                    <p className="font-bold text-white mb-1">{title}</p>
                    <p className="text-sm text-gray-400 mb-3">{description}</p>
                    <AnimatedButton
                        onClick={() => navigate('/pricing')}
                        variant="primary"
                        size="sm"
                    >
                        Upgrade to {requiredTier}
                    </AnimatedButton>
                </div>
            </div>

            {/* Blurred content */}
            <div className="opacity-30 pointer-events-none">
                {children}
            </div>
        </div>
    );
};
