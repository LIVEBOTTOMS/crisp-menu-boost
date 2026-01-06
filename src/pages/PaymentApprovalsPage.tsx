import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, User, CreditCard, Calendar } from 'lucide-react';

interface PaymentRequest {
    id: string;
    user_email: string;
    user_name: string;
    plan_name: string;
    billing_period: string;
    amount: number;
    upi_transaction_id: string;
    payment_date: string;
    payment_notes: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    admin_notes: string;
}

export default function PaymentApprovalsPage() {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!isAdmin) return;
        fetchPaymentRequests();
    }, [isAdmin, filter]);

    const fetchPaymentRequests = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('payment_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching payment requests:', error);
            toast({
                title: "Error",
                description: "Could not load payment requests",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('payment_requests')
                .update({
                    status: 'approved',
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                    admin_notes: adminNotes[requestId] || '',
                })
                .eq('id', requestId);

            if (error) throw error;

            toast({
                title: "Payment approved!",
                description: "User subscription has been activated",
            });

            fetchPaymentRequests();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Could not approve payment",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('payment_requests')
                .update({
                    status: 'rejected',
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                    admin_notes: adminNotes[requestId] || '',
                })
                .eq('id', requestId);

            if (error) throw error;

            toast({
                title: "Payment rejected",
                description: "User has been notified",
            });

            fetchPaymentRequests();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Could not reject payment",
                variant: "destructive",
            });
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-gray-400">You must be an admin to view this page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Payment Approvals</h1>
                    <p className="text-gray-400">Review and approve user payment requests</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${filter === status
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Payment Requests List */}
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No {filter !== 'all' ? filter : ''} payment requests found
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <Card key={request.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                {request.user_name || request.user_email}
                                            </CardTitle>
                                            <CardDescription className="text-gray-400 mt-1">
                                                {request.user_email}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            className={
                                                request.status === 'approved'
                                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                                    : request.status === 'rejected'
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                            }
                                        >
                                            {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                            {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Plan</div>
                                            <div className="font-bold">{request.plan_name}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Billing Period</div>
                                            <div className="font-bold capitalize">{request.billing_period}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Amount</div>
                                            <div className="font-bold text-cyan-400">₹{request.amount}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Transaction ID</div>
                                            <div className="font-mono text-sm">{request.upi_transaction_id}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Payment Date</div>
                                            <div className="text-sm">
                                                {new Date(request.payment_date || request.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 mb-1">Submitted</div>
                                            <div className="text-sm">
                                                {new Date(request.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {request.payment_notes && (
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-400 mb-1">User Notes</div>
                                            <div className="text-sm bg-white/5 p-3 rounded-lg">{request.payment_notes}</div>
                                        </div>
                                    )}

                                    {request.status === 'pending' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="text-sm text-gray-400 mb-2 block">Admin Notes (Optional)</label>
                                                <Textarea
                                                    value={adminNotes[request.id] || ''}
                                                    onChange={(e) => setAdminNotes({ ...adminNotes, [request.id]: e.target.value })}
                                                    placeholder="Add notes about this payment..."
                                                    className="bg-white/5 border-white/10 text-white"
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <AnimatedButton
                                                    onClick={() => handleApprove(request.id)}
                                                    variant="primary"
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve & Activate
                                                </AnimatedButton>
                                                <AnimatedButton
                                                    onClick={() => handleReject(request.id)}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </AnimatedButton>
                                            </div>
                                        </>
                                    )}

                                    {request.admin_notes && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <div className="text-sm text-gray-400 mb-1">Admin Notes</div>
                                            <div className="text-sm bg-white/5 p-3 rounded-lg">{request.admin_notes}</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
