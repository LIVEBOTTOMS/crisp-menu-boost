import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';
import { useHaptics } from '@/hooks/useHaptics';
import { useSound } from '@/hooks/useSound';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'glass' | 'outline';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    magnetic?: boolean;
    ripple?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
    children,
    className,
    variant = 'primary',
    loading = false,
    leftIcon,
    rightIcon,
    magnetic = true,
    ripple = true,
    ...props
}, ref) => {
    const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const combinedRef = (ref as any) || buttonRef;
    const haptics = useHaptics();
    const { playClick } = useSound();

    // Magnetic Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, springConfig.gentle);
    const springY = useSpring(y, springConfig.gentle);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!magnetic || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ripple || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const rx = e.clientX - rect.left;
        const ry = e.clientY - rect.top;
        const rid = Date.now();
        setRipples(prev => [...prev, { x: rx, y: ry, id: rid }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rid));
        }, 1000);
    };

    const variants = {
        primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 rotate-bg",
        secondary: "bg-white text-black hover:bg-gray-100",
        glass: "glass text-white border border-white/20 hover:bg-white/10",
        outline: "bg-transparent border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white"
    };

    return (
        <motion.button
            ref={combinedRef}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
                createRipple(e);
                haptics.light();
                playClick();
                props.onClick?.(e as any);
            }}
            className={cn(
                "relative group px-6 py-3 rounded-2xl font-bold transition-all overflow-hidden flex items-center justify-center gap-2",
                variants[variant],
                loading && "opacity-80 cursor-wait",
                className
            )}
            {...(props as any)}
        >
            {/* Ripple Effects */}
            <AnimatePresence>
                {ripples.map(r => (
                    <motion.span
                        key={r.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute bg-white/30 rounded-full pointer-events-none"
                        style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
                    />
                ))}
            </AnimatePresence>

            {/* Content */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        {leftIcon}
                        <span className="relative z-10">{children}</span>
                        {rightIcon}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated Border Gradient (Houdini Style) */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity [mask-composite:exclude] pointer-events-none" />
        </motion.button>
    );
});
AnimatedButton.displayName = 'AnimatedButton';
