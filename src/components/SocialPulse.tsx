import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Trophy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialEvent {
    id: string;
    icon: any;
    text: string;
    type: "win" | "view" | "order";
}

export const SocialPulse = () => {
    const [events, setEvents] = useState<SocialEvent[]>([]);
    const [viewCount, setViewCount] = useState(38);

    const mockEvents: Omit<SocialEvent, "id">[] = [
        { icon: Trophy, text: "Aadesh just won 5% OFF!", type: "win" },
        { icon: TrendingUp, text: "The Long Island Iced Tea is trending.", type: "order" },
        { icon: Users, text: "12 people are looking at Appetizers.", type: "view" },
        { icon: Trophy, text: "Rohan just unlocked the Secret Menu!", type: "win" },
        { icon: TrendingUp, text: "Chef's Special Momos just ordered.", type: "order" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const newEvent = {
                ...mockEvents[Math.floor(Math.random() * mockEvents.length)],
                id: Math.random().toString(36).substr(2, 9),
            };
            setEvents(prev => [...prev.slice(-2), newEvent]);
            setViewCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-24 left-4 z-40 flex flex-col gap-2 pointer-events-none">
            {/* Live View Counter */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <Eye className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{viewCount} LIVE</span>
            </motion.div>

            {/* Event Toasts */}
            <AnimatePresence mode="popLayout">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        className={cn(
                            "bg-black/80 backdrop-blur-2xl border rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[200px]",
                            event.type === 'win' ? "border-amber-500/30" : "border-white/10"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-xl",
                            event.type === 'win' ? "bg-amber-500/10" : "bg-white/5"
                        )}>
                            <event.icon className={cn(
                                "w-4 h-4",
                                event.type === 'win' ? "text-amber-400" : "text-cyan-400"
                            )} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-200 leading-tight uppercase tracking-tight">
                            {event.text}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
