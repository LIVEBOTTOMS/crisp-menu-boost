import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Users, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffAlert {
    id: string;
    type: 'order' | 'call' | 'win' | 'view';
    message: string;
    time: string;
    priority: 'low' | 'medium' | 'high';
}

export const StaffPanel = () => {
    const [alerts, setAlerts] = useState<StaffAlert[]>([
        { id: '1', type: 'order', message: 'Table 4: Order placed (Draft Beer)', time: '2m ago', priority: 'medium' },
        { id: '2', type: 'win', message: 'New winner! 5% discount unlocked', time: '5m ago', priority: 'low' },
    ]);

    // Simulated real-time incoming alerts
    useEffect(() => {
        const interval = setInterval(() => {
            const types: StaffAlert['type'][] = ['order', 'call', 'win', 'view'];
            const type = types[Math.floor(Math.random() * types.length)];
            const newAlert: StaffAlert = {
                id: Math.random().toString(),
                type,
                message: type === 'call' ? 'Table 12: Assistance requested' :
                    type === 'view' ? 'High traffic on "Signature Cocktails"' :
                        type === 'order' ? 'Kitchen: New KOT received' : 'Gamification: Big win recorded',
                time: 'Just now',
                priority: type === 'call' ? 'high' : type === 'order' ? 'medium' : 'low'
            };
            setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Bell className="h-4 w-4 text-orange-400" />
                            Live Service Feed
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                            Real-time Venue Operations
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30 font-black px-2">
                        STAY ALERT
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                    <AnimatePresence initial={false}>
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex gap-4 items-start">
                                    <div className={cn(
                                        "p-2 rounded-lg border",
                                        alert.priority === 'high' ? "bg-red-500/10 border-red-500/30 text-red-400" :
                                            alert.priority === 'medium' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                                                "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                    )}>
                                        {alert.type === 'order' && <Zap className="h-4 w-4" />}
                                        {alert.type === 'call' && <Bell className="h-4 w-4" />}
                                        {alert.type === 'view' && <Users className="h-4 w-4" />}
                                        {alert.type === 'win' && <Flame className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                                                {alert.type} Alert
                                            </span>
                                            <span className="text-[9px] text-gray-600 flex items-center gap-1 font-mono">
                                                <Clock className="w-2 h-2" />
                                                {alert.time}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-200 tracking-tight">
                                            {alert.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};

// Internal utility for cn
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
