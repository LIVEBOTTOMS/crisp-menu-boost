import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/50 hover:scale-105',
            secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30',
            outline: 'border-2 border-white/20 hover:bg-white/5 text-white hover:border-white/40',
            ghost: 'hover:bg-white/10 text-white',
        };

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm gap-2',
            md: 'px-6 py-3 text-base gap-3',
            lg: 'px-8 py-4 text-lg gap-3',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                style={{ color: variant === 'primary' ? '#ffffff' : undefined }}
                {...props}
            >
                {children}
            </button>
        );
    }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
