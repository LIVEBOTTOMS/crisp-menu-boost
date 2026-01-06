import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableSectionsProps {
    sections: Array<{
        id: string;
        title: string;
        content: React.ReactNode;
    }>;
    initialSection?: number;
}

export const SwipeableSections: React.FC<SwipeableSectionsProps> = ({
    sections,
    initialSection = 0,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialSection);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < sections.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        },
        onSwipedRight: () => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        },
        trackMouse: true,
        trackTouch: true,
    });

    const goToSection = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative">
            {/* Section tabs */}
            <div className="sticky-section flex overflow-x-auto custom-scrollbar px-4 py-3 gap-2">
                {sections.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => goToSection(index)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all ${currentIndex === index
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {section.title}
                    </button>
                ))}
            </div>

            {/* Swipeable content */}
            <div {...handlers} className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="p-4"
                    >
                        {sections[currentIndex].content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation arrows (desktop) */}
            <div className="hidden md:block">
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                )}

                {currentIndex < sections.length - 1 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>

            {/* Swipe indicator dots */}
            <div className="flex justify-center gap-2 py-4">
                {sections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSection(index)}
                        className={`h-2 rounded-full transition-all ${currentIndex === index
                                ? 'w-8 bg-cyan-500'
                                : 'w-2 bg-gray-600 hover:bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
