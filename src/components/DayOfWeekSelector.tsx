import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Tag, Percent } from 'lucide-react';

interface DayOffer {
    day: string;
    shortDay: string;
    hasOffer: boolean;
    offerText?: string;
    offerType?: 'special' | 'discount' | 'event';
}

const DAYS: DayOffer[] = [
    { day: 'Monday', shortDay: 'Mon', hasOffer: true, offerText: 'Monday Madness - 20% Off', offerType: 'discount' },
    { day: 'Tuesday', shortDay: 'Tue', hasOffer: true, offerText: 'Taco Tuesday', offerType: 'special' },
    { day: 'Wednesday', shortDay: 'Wed', hasOffer: true, offerText: 'Wine Wednesday', offerType: 'special' },
    { day: 'Thursday', shortDay: 'Thu', hasOffer: false },
    { day: 'Friday', shortDay: 'Fri', hasOffer: true, offerText: 'Happy Hour 5-8 PM', offerType: 'event' },
    { day: 'Saturday', shortDay: 'Sat', hasOffer: true, offerText: 'Weekend Brunch', offerType: 'special' },
    { day: 'Sunday', shortDay: 'Sun', hasOffer: true, offerText: 'Family Sunday - Kids Eat Free', offerType: 'event' },
];

interface DayOfWeekSelectorProps {
    onDayChange?: (day: string) => void;
    customOffers?: Partial<Record<string, string>>;
}

export const DayOfWeekSelector = ({ onDayChange, customOffers }: DayOfWeekSelectorProps) => {
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [currentOffer, setCurrentOffer] = useState<string>('');

    useEffect(() => {
        // Get current day
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setSelectedDay(today);

        // Set current offer
        const todayData = DAYS.find(d => d.day === today);
        if (todayData?.hasOffer) {
            setCurrentOffer(customOffers?.[today] || todayData.offerText || '');
        }
    }, [customOffers]);

    const handleDayClick = (day: DayOffer) => {
        setSelectedDay(day.day);
        if (day.hasOffer) {
            setCurrentOffer(customOffers?.[day.day] || day.offerText || '');
        } else {
            setCurrentOffer('');
        }
        onDayChange?.(day.day);
    };

    const getOfferIcon = (type?: 'special' | 'discount' | 'event') => {
        switch (type) {
            case 'discount':
                return <Percent className="w-3 h-3" />;
            case 'event':
                return <Sparkles className="w-3 h-3" />;
            case 'special':
            default:
                return <Tag className="w-3 h-3" />;
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Day Selector */}
            <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {DAYS.map((day, index) => {
                        const isSelected = selectedDay === day.day;
                        const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day.day;

                        return (
                            <motion.button
                                key={day.day}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleDayClick(day)}
                                className={`
                  relative flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all duration-300
                  ${isSelected
                                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                                    }
                  ${isToday && !isSelected ? 'border-neon-cyan/50' : ''}
                  magnetic-hover
                `}
                            >
                                {/* Today Indicator */}
                                {isToday && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-neon-cyan animate-pulse" />
                                )}

                                {/* Offer Badge */}
                                {day.hasOffer && !isSelected && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse" />
                                )}

                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {day.shortDay}
                                    </span>

                                    {day.hasOffer && (
                                        <div className={`text-xs ${isSelected ? 'text-neon-cyan' : 'text-gold'}`}>
                                            {getOfferIcon(day.offerType)}
                                        </div>
                                    )}
                                </div>

                                {/* Selection Underline */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="dayUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Offer Banner */}
            {currentOffer && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative overflow-hidden rounded-lg border border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-cyan/10 p-4"
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent animate-shimmer" />

                    <div className="relative flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-neon-cyan" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg gradient-text-neon">
                                {selectedDay}'s Special
                            </h3>
                            <p className="text-white/80 text-sm">
                                {currentOffer}
                            </p>
                        </div>

                        <div className="flex-shrink-0 px-4 py-2 rounded-full bg-neon-cyan/20 border border-neon-cyan/30">
                            <span className="text-neon-cyan font-bold text-sm uppercase tracking-wider">
                                Active
                            </span>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent blur-xl" />
                    </div>
                </motion.div>
            )}

        </div>
    );
};
