import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    opacity: number;
    color: string;
}

interface ParticleFieldProps {
    count?: number;
    interactive?: boolean;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
    count = 40,
    interactive = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 500], [0.6, 0.2]);

    const particles = useMemo(() => {
        const p: Particle[] = [];
        const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];
        for (let i = 0; i < count; i++) {
            p.push({
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                size: 1 + Math.random() * 3,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: 0.1 + Math.random() * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        return p;
    }, [count]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('resize', resize);
        if (interactive) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        resize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Interactive movement
                if (interactive) {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        p.x -= dx * 0.01;
                        p.y -= dy * 0.01;
                    }
                }

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();

                // Add subtle glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particles, interactive]);

    return (
        <motion.canvas
            ref={canvasRef}
            style={{ opacity }}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};
