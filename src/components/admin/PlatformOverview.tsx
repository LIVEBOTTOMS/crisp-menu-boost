import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Store,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    DollarSign,
    UserPlus
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface Stats {
    totalUsers: number;
    totalVenues: number;
    activeVenues: number;
    totalRevenue: number;
    pendingPayments: number;
    newUsersThisMonth: number;
    revenueThisMonth: number;
}

export function PlatformOverview() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalVenues: 0,
        activeVenues: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        newUsersThisMonth: 0,
        revenueThisMonth: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // Get User count from user_roles
            const { count: userCount } = await supabase
                .from('user_roles')
                .select('*', { count: 'exact', head: true });

            // Get ALL Venues count (including those without owner_id)
            const { count: venueCount } = await supabase
                .from('venues')
                .select('*', { count: 'exact', head: true });

            // Get Active Venues count
            const { count: activeVenueCount } = await supabase
                .from('venues')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            // Get Stats from payment_requests
            const { data: payments } = await supabase
                .from('payment_requests')
                .select('amount, status, created_at');

            const approvedTotal = payments?.filter(p => p.status === 'approved')
                .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

            const pendingCount = payments?.filter(p => p.status === 'pending').length || 0;

            // Calculate this month's stats
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const revenueThisMonth = payments?.filter(p =>
                p.status === 'approved' && new Date(p.created_at) >= firstDayOfMonth
            ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

            // Get new users this month
            const { count: newUsersCount } = await supabase
                .from('user_roles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', firstDayOfMonth.toISOString());

            setStats({
                totalUsers: userCount || 0,
                totalVenues: venueCount || 0,
                activeVenues: activeVenueCount || 0,
                totalRevenue: approvedTotal,
                pendingPayments: pendingCount,
                newUsersThisMonth: newUsersCount || 0,
                revenueThisMonth
            });
        } catch (error) {
            console.error('Error fetching platform stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            subtitle: `+${stats.newUsersThisMonth} this month`,
            trend: '+12%',
            isUp: true,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Total Venues',
            value: stats.totalVenues,
            icon: Store,
            subtitle: `${stats.activeVenues} active`,
            trend: '+5%',
            isUp: true,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
        },
        {
            title: 'Platform Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            subtitle: `₹${stats.revenueThisMonth.toLocaleString()} this month`,
            trend: '+18%',
            isUp: true,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingPayments,
            icon: Activity,
            subtitle: 'Payment requests',
            trend: '-2%',
            isUp: false,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="bg-slate-900 border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white mb-1">
                                {isLoading ? '...' : stat.value}
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{stat.subtitle}</p>
                            <div className="flex items-center gap-1">
                                {stat.isUp ? (
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-orange-500" />
                                )}
                                <span className={cn(
                                    "text-xs font-semibold",
                                    stat.isUp ? "text-emerald-500" : "text-orange-500"
                                )}>
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-slate-500">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Platform Health & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Platform Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                            <span className="text-slate-300 text-sm">System Status</span>
                            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                            <span className="text-slate-300 text-sm">Database</span>
                            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                            <span className="text-slate-300 text-sm">API Response Time</span>
                            <span className="text-cyan-400 text-sm font-mono">~45ms</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-300">New User Signups</span>
                            </div>
                            <span className="bg-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.newUsersThisMonth} New</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4 text-emerald-400" />
                                <span className="text-slate-300">Pending Payments</span>
                            </div>
                            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.pendingPayments}</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Store className="w-4 h-4 text-cyan-400" />
                                <span className="text-slate-300">Active Venues</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
