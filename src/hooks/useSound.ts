import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useSound - A hook for premium audio feedback and ambient soundscapes.
 */
export const useSound = () => {
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('menux_mute') === 'true';
        }
        return true;
    });

    const audioCtxRef = useRef<AudioContext | null>(null);
    const ambientSourceRef = useRef<OscillatorNode | null>(null);
    const ambientGainRef = useRef<GainNode | null>(null);

    const initAudioContext = () => {
        if (!audioCtxRef.current && typeof window !== 'undefined') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const toggleMute = () => {
        const newMute = !isMuted;
        setIsMuted(newMute);
        localStorage.setItem('menux_mute', String(newMute));

        if (audioCtxRef.current) {
            if (newMute) {
                audioCtxRef.current.suspend();
            } else {
                audioCtxRef.current.resume();
            }
        }
    };

    // Synthesized minimalist "click"
    const playClick = useCallback(() => {
        if (isMuted) return;
        initAudioContext();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }, [isMuted]);

    // Synthesized "shimmer" for wins or highlights
    const playShimmer = useCallback(() => {
        if (isMuted) return;
        initAudioContext();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }, [isMuted]);

    // Synthesized "success" chime
    const playSuccess = useCallback(() => {
        if (isMuted) return;
        initAudioContext();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        [440, 554.37, 659.25].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.3);
        });
    }, [isMuted]);

    // Ambient Soundscape - A subtle rhythmic pulse
    const startAmbient = useCallback((themeFrequency: number = 110) => {
        if (isMuted) return;
        initAudioContext();
        const ctx = audioCtxRef.current;
        if (!ctx || ambientSourceRef.current) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(themeFrequency, ctx.currentTime);

        // Very low gain for subtle background effect
        gain.gain.setValueAtTime(0.01, ctx.currentTime);

        // LFO for "breathing" effect
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.005, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();

        ambientSourceRef.current = osc;
        ambientGainRef.current = gain;
    }, [isMuted]);

    const stopAmbient = useCallback(() => {
        if (ambientSourceRef.current) {
            ambientSourceRef.current.stop();
            ambientSourceRef.current = null;
        }
        if (ambientGainRef.current) {
            ambientGainRef.current.disconnect();
            ambientGainRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isMuted) stopAmbient();
        return () => stopAmbient();
    }, [isMuted, stopAmbient]);

    return {
        isMuted,
        toggleMute,
        playClick,
        playShimmer,
        playSuccess,
        startAmbient,
        stopAmbient
    };
};
