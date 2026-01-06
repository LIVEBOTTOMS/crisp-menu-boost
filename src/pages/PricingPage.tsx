import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const navigate = useNavigate();
    const { plan: currentPlan } = useSubscription();

    const plans = [
        {
            name: 'Freemium',
            slug: 'freemium',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for trying out MenuX',
            icon: Sparkles,
            color: 'slate',
            features: [
                { text: '1 venue', included: true },
                { text: 'Up to 50 menu items', included: true },
                { text: 'Classic theme only', included: true },
                { text: 'View-only access', included: true },
                { text: 'Edit access', included: false },
                { text: 'Customization', included: false },
                { text: 'QR code designer', included: false },
                { text: 'Analytics', included: false },
            ],
        },
        {
            name: 'Premium',
            slug: 'premium',
            price: { monthly: 199, yearly: 1910 },
            description: 'For professional restaurants',
            icon: Zap,
            color: 'cyan',
            popular: true,
            features: [
                { text: 'Unlimited venues', included: true },
                { text: 'Unlimited menu items', included: true },
                { text: 'All premium themes', included: true },
                { text: 'Full edit access', included: true },
                { text: 'Complete customization', included: true },
                { text: 'QR code designer', included: true },
                { text: 'Basic analytics', included: true },
                { text: 'Priority support', included: true },
                { text: 'Custom domain', included: true },
                { text: 'Discount codes', included: false },
                { text: 'Advanced analytics', included: false },
            ],
        },
        {
            name: 'Premium+',
            slug: 'premium_plus',
            price: { monthly: 249, yearly: 2390 },
            description: 'For power users',
            icon: Crown,
            color: 'purple',
            features: [
                { text: 'Everything in Premium', included: true, highlight: true },
                { text: 'Discount code generation', included: true },
                { text: 'Advanced analytics', included: true },
                { text: 'Revenue tracking', included: true },
                { text: 'Customer insights', included: true },
                { text: 'API access', included: true },
                { text: 'Export reports', included: true },
            ],
        },
    ];

    const getPrice = (plan: typeof plans[0]) => {
        const price = billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly;
        if (price === 0) return 'Free';
        if (billingPeriod === 'yearly') {
            return `₹${price}/year`;
        }
        return `₹${price}/mo`;
    };

    const getSavings = (plan: typeof plans[0]) => {
        if (plan.price.monthly === 0) return null;
        const monthlyCost = plan.price.monthly * 12;
        const yearlyCost = plan.price.yearly;
        const savings = monthlyCost - yearlyCost;
        const percentage = Math.round((savings / monthlyCost) * 100);
        return { amount: savings, percentage };
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-2"
                    >
                        ← Back to Home
                    </button>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
                        Choose Your <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Plan</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                        Start free, upgrade when you're ready. No credit card required.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className={`text-sm font-semibold ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-14 h-7 rounded-full bg-white/10 transition-colors"
                    >
                        <div
                            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform ${billingPeriod === 'yearly' ? 'translate-x-7' : ''
                                }`}
                        />
                    </button>
                    <span className={`text-sm font-semibold ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                        Yearly
                    </span>
                    {billingPeriod === 'yearly' && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                            Save 20%
                        </span>
                    )}
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrentPlan = currentPlan?.slug === plan.slug;
                        const savings = billingPeriod === 'yearly' ? getSavings(plan) : null;

                        return (
                            <div
                                key={plan.slug}
                                className={`relative p-8 rounded-2xl backdrop-blur-xl border transition-all ${plan.popular
                                        ? 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/50 scale-105'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-4 right-4 px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/50">
                                        Current Plan
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${plan.color}-400 to-${plan.color}-600 flex items-center justify-center mb-6`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Plan Name */}
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="text-4xl font-black mb-1">{getPrice(plan)}</div>
                                    {savings && (
                                        <div className="text-sm text-green-400">
                                            Save ₹{savings.amount} ({savings.percentage}%)
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                {isCurrentPlan ? (
                                    <div className="w-full py-3 rounded-lg bg-white/10 text-center font-bold text-gray-400 mb-8">
                                        Current Plan
                                    </div>
                                ) : (
                                    <AnimatedButton
                                        onClick={() => {
                                            if (plan.slug === 'freemium') {
                                                navigate('/signup');
                                            } else {
                                                // TODO: Navigate to checkout
                                                navigate(`/checkout?plan=${plan.slug}&period=${billingPeriod}`);
                                            }
                                        }}
                                        variant={plan.popular ? 'primary' : 'secondary'}
                                        size="lg"
                                        className="w-full mb-8"
                                    >
                                        {plan.slug === 'freemium' ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                                    </AnimatedButton>
                                )}

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'} ${feature.highlight ? 'font-bold' : ''}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400">
                        Need help choosing? <button onClick={() => navigate('/contact')} className="text-cyan-400 hover:text-cyan-300 font-semibold">Contact us</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
