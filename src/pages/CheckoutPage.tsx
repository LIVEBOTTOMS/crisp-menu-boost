import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle, Copy, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const planSlug = searchParams.get('plan');
    const period = searchParams.get('period') || 'monthly';

    const { user } = useAuth();
    const { plan: currentPlan } = useSubscription();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [transactionId, setTransactionId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // UPI Details
    const UPI_ID = 'menuxprime@upi'; // Replace with your actual UPI ID
    const UPI_NAME = 'MenuX Prime';

    // Plan details
    const plans = {
        premium: {
            name: 'Premium',
            monthly: 199,
            yearly: 1910,
        },
        premium_plus: {
            name: 'Premium+',
            monthly: 249,
            yearly: 2390,
        },
    };

    const selectedPlan = plans[planSlug as keyof typeof plans];
    if (!selectedPlan) {
        navigate('/pricing');
        return null;
    }

    const amount = period === 'monthly' ? selectedPlan.monthly : selectedPlan.yearly;

    const copyUpiId = () => {
        navigator.clipboard.writeText(UPI_ID);
        toast({
            title: "Copied!",
            description: "UPI ID copied to clipboard",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Not logged in",
                description: "Please log in to continue",
                variant: "destructive",
            });
            navigate('/login');
            return;
        }

        if (!transactionId.trim()) {
            toast({
                title: "Missing information",
                description: "Please enter the UPI transaction ID",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Get plan ID
            const { data: planData, error: planError } = await supabase
                .from('subscription_plans')
                .select('id')
                .eq('slug', planSlug)
                .single();

            if (planError) throw planError;

            // Submit payment request
            const { error: submitError } = await supabase
                .from('payment_requests')
                .insert({
                    user_id: user.id,
                    user_email: user.email,
                    user_name: user.user_metadata?.name || user.email,
                    plan_id: planData.id,
                    plan_name: selectedPlan.name,
                    billing_period: period,
                    amount: amount,
                    upi_transaction_id: transactionId,
                    payment_date: paymentDate || new Date().toISOString(),
                    payment_notes: notes,
                    status: 'pending',
                });

            if (submitError) throw submitError;

            setSubmitted(true);
            toast({
                title: "Payment request submitted!",
                description: "We'll verify your payment and activate your subscription within 24 hours.",
            });
        } catch (error: any) {
            console.error('Error submitting payment:', error);
            toast({
                title: "Submission failed",
                description: error.message || "Could not submit payment request",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Payment Request Submitted!</h1>
                    <p className="text-gray-400 mb-8">
                        We've received your payment request. Our team will verify your payment and activate your {selectedPlan.name} subscription within 24 hours.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        You'll receive an email confirmation once your subscription is activated.
                    </p>
                    <AnimatedButton
                        onClick={() => navigate('/menus')}
                        variant="primary"
                        size="lg"
                        className="w-full"
                    >
                        Go to Dashboard
                    </AnimatedButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <button
                    onClick={() => navigate('/pricing')}
                    className="text-sm text-gray-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pricing
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Payment Instructions */}
                    <div>
                        <h1 className="text-3xl font-black mb-6">Complete Your Payment</h1>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Plan Details</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Plan:</span>
                                    <span className="font-bold">{selectedPlan.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Billing:</span>
                                    <span className="font-bold capitalize">{period}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-400">Amount:</span>
                                    <span className="font-black text-cyan-400">₹{amount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">UPI Payment Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-400 text-sm">UPI ID</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="flex-1 px-4 py-3 bg-black/40 rounded-lg font-mono text-cyan-400">
                                            {UPI_ID}
                                        </code>
                                        <button
                                            onClick={copyUpiId}
                                            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-gray-400 text-sm">Name</Label>
                                    <div className="px-4 py-3 bg-black/40 rounded-lg mt-1">
                                        {UPI_NAME}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="font-bold mb-2">Payment Steps:</h3>
                                    <ol className="space-y-2 text-sm text-gray-300">
                                        <li>1. Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                                        <li>2. Send ₹{amount} to UPI ID: <code className="text-cyan-400">{UPI_ID}</code></li>
                                        <li>3. Copy the transaction ID from your payment app</li>
                                        <li>4. Submit the form with your transaction details</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Submission Form */}
                    <div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6">Submit Payment Proof</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="transactionId" className="text-gray-300">
                                        UPI Transaction ID *
                                    </Label>
                                    <Input
                                        id="transactionId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g., 123456789012"
                                        required
                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Find this in your UPI app's transaction history
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="paymentDate" className="text-gray-300">
                                        Payment Date (Optional)
                                    </Label>
                                    <Input
                                        id="paymentDate"
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="notes" className="text-gray-300">
                                        Additional Notes (Optional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any additional information..."
                                        rows={3}
                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                <div className="pt-4">
                                    <AnimatedButton
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Payment Request'}
                                    </AnimatedButton>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Your subscription will be activated within 24 hours after verification
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
