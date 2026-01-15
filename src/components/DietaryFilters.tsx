import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { dietaryTypes, DietaryType } from "@/types/menuItem";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

interface DietaryFiltersProps {
    activeFilter: DietaryType | 'all';
    onChange: (filter: DietaryType | 'all') => void;
}

export const DietaryFilters = ({ activeFilter, onChange }: DietaryFiltersProps) => {
    const { t } = useLanguage();
    const { playClick } = useSound();
    const haptics = useHaptics();

    return (
        <div className="flex flex-wrap justify-center gap-3 py-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    onChange('all');
                    playClick();
                    haptics.light();
                }}
                className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'all'
                        ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                    }`}
            >
                {t('common.all') || 'All Items'}
            </motion.button>

            {Object.entries(dietaryTypes).map(([key, config]) => {
                const isActive = activeFilter === key;
                return (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            onChange(key as DietaryType);
                            playClick();
                            haptics.light();
                        }}
                        className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive
                                ? 'bg-secondary text-white border-secondary shadow-[0_0_15px_rgba(255,0,255,0.4)]'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className="text-sm">{config.icon}</span>
                        <span>{t(`dietary.${key}`) || config.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};
