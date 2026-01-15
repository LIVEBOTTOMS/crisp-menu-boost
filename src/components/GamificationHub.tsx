import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beer, Martini, Trophy, X, RotateCcw, Gift, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Prize Claim Form - Requires phone and email
const PrizeClaimForm = ({ percentage, onClaim }: { percentage: number, onClaim: (data: { phone: string; email: string, discount: number }) => void }) => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        onClaim({ phone, email, discount: percentage });
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center"
        >
            <div className="relative inline-block mb-4">
                <Gift className="w-12 h-12 text-amber-400 mx-auto" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white"
                >
                    {percentage}%
                </motion.div>
            </div>

            <h3 className="text-xl font-bold mb-1">🎉 You Unlocked {percentage}% OFF!</h3>
            <p className="text-gray-400 text-[10px] mb-6 uppercase tracking-wider">
                Claim your unique reward code
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/30 border-white/10 text-center text-sm"
                    required
                />
                <Input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-black/30 border-white/10 text-center text-sm"
                    required
                />
                <Input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-white/10 text-center text-sm"
                    required
                />
                <AnimatedButton
                    type="submit"
                    loading={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold py-6 text-lg"
                >
                    CLAIM REWARD
                </AnimatedButton>
            </form>
        </motion.div>
    );
};

// EXTREME Perfect Pint Game
const PerfectPintGame = ({ onWin }: { onWin: (percentage: number) => void }) => {
    const [filling, setFilling] = useState(false);
    const [fillLevel, setFillLevel] = useState(0);
    const [target] = useState(parseFloat((Math.random() * 20 + 75).toFixed(1))); // 75.0-95.0%
    const [speed] = useState(4 + Math.random() * 2);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [discountWon, setDiscountWon] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startFilling = () => {
        if (gameOver) return;
        setFilling(true);
        intervalRef.current = setInterval(() => {
            // Adds "jitter" to the pour to make it harder
            const jitter = (Math.random() - 0.5) * 0.5;
            setFillLevel(prev => {
                if (prev >= 100) {
                    stopFilling();
                    return 100;
                }
                return Math.max(0, prev + speed + jitter);
            });
        }, 50);
    };

    const stopFilling = () => {
        setFilling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setGameOver(true);

        const diff = Math.abs(fillLevel - target);
        let discount = 0;

        if (diff <= 0.3) discount = 5;
        else if (diff <= 0.8) discount = 3;
        else if (diff <= 1.5) discount = 2;
        else if (diff <= 3.0) discount = 1;

        if (discount > 0) {
            setWon(true);
            setDiscountWon(discount);
            setTimeout(() => onWin(discount), 1500);
            toast.success(`${discount}% DISCOUNT!`, { description: `Precision: ${diff.toFixed(2)}% difference` });
        } else {
            toast.error(`Missed!`, { description: `Target: ${target}%, You reached: ${fillLevel.toFixed(1)}%` });
        }
    };

    return (
        <div className="text-center p-6">
            <h3 className="text-lg font-bold mb-1 uppercase tracking-tighter">Perfect Pour Challenge</h3>
            <p className="text-gray-400 text-[10px] mb-4">STOP AT EXACTLY <span className="text-amber-400 font-bold">{target}%</span></p>

            <div className="flex justify-between text-[8px] text-gray-500 mb-2 uppercase font-bold">
                <span>Error 1.5% = 2% OFF</span>
                <span>Error 0.3% = 5% OFF</span>
            </div>

            <div className="relative w-20 h-48 mx-auto bg-gray-900/80 rounded-b-2xl border-x-4 border-b-4 border-gray-700 overflow-hidden shadow-2xl">
                <div
                    className="absolute w-full border-t-2 border-dashed border-cyan-400 z-10 opacity-50"
                    style={{ bottom: `${target}%` }}
                />

                <motion.div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 via-amber-400 to-white/20"
                    animate={{ height: `${fillLevel}%` }}
                    transition={{ duration: 0.1 }}
                />

                {fillLevel > 0 && (
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                )}
            </div>

            <p className="mt-4 text-3xl font-mono font-black text-white">{fillLevel.toFixed(1)}%</p>

            {!gameOver ? (
                <AnimatedButton
                    onPointerDown={startFilling}
                    onPointerUp={stopFilling}
                    className="mt-4 w-full h-16 text-lg font-black bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none transition-all"
                >
                    {filling ? "POURING..." : "HOLD TO FILL"}
                </AnimatedButton>
            ) : (
                <div className="mt-4">
                    {won ? (
                        <div className="animate-bounce">
                            <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                            <p className="text-amber-400 font-black">WINNER {discountWon}%</p>
                        </div>
                    ) : (
                        <Button onClick={() => { setGameOver(false); setFillLevel(0); }} variant="outline" className="w-full">
                            TRY AGAIN
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

// EXTREME Cocktail Memory Game
const CocktailMemoryGame = ({ onWin }: { onWin: (percentage: number) => void }) => {
    const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ec4899"];
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [level, setLevel] = useState(0);
    const [activeColor, setActiveColor] = useState<number | null>(null);

    const playSequence = async (seq: number[]) => {
        setIsPlaying(true);
        const speed = Math.max(150, 450 - seq.length * 30);

        for (const idx of seq) {
            await new Promise(r => setTimeout(r, 100));
            setActiveColor(idx);
            await new Promise(r => setTimeout(r, speed));
            setActiveColor(null);
        }
        setIsPlaying(false);
    };

    const nextLevel = () => {
        const next = Math.floor(Math.random() * 6);
        const newSeq = [...sequence, next];
        setSequence(newSeq);
        setPlayerSequence([]);
        setLevel(newSeq.length);
        playSequence(newSeq);
    };

    const handleClick = (idx: number) => {
        if (isPlaying || sequence.length === 0) return;

        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 150);

        const expected = sequence[playerSequence.length];
        if (idx !== expected) {
            handleGameOver();
            return;
        }

        const newPlayerSeq = [...playerSequence, idx];
        setPlayerSequence(newPlayerSeq);

        if (newPlayerSeq.length === sequence.length) {
            setTimeout(nextLevel, 500);
        }
    };

    const handleGameOver = () => {
        let discount = 0;
        if (level >= 12) discount = 5;
        else if (level >= 8) discount = 3;
        else if (level >= 5) discount = 2;
        else if (level >= 3) discount = 1;

        if (discount > 0) {
            toast.success(`GAME OVER! You won ${discount}% OFF!`);
            onWin(discount);
        } else {
            toast.error(`Fail! Reach at least level 3 to win.`);
            setSequence([]);
            setLevel(0);
        }
    };

    return (
        <div className="text-center p-6 bg-black/20">
            <h3 className="font-bold mb-1 uppercase text-pink-400">Sequence Challenge</h3>
            <p className="text-[10px] text-gray-500 mb-4 tracking-widest uppercase">Level 12 = 5% • Level 8 = 3% • Level 3 = 1%</p>

            <div className="text-4xl font-black mb-6 text-white">{level}</div>

            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
                {colors.map((color, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleClick(idx)}
                        whileTap={{ scale: 0.95 }}
                        className="aspect-square rounded-2xl transition-all border-4 border-white/5 shadow-lg"
                        style={{
                            backgroundColor: color,
                            opacity: activeColor === idx ? 1 : 0.3,
                            filter: activeColor === idx ? `brightness(1.5) drop-shadow(0 0 15px ${color}80)` : 'none',
                        }}
                    />
                ))}
            </div>

            {sequence.length === 0 && (
                <AnimatedButton onClick={nextLevel} className="mt-8 bg-pink-600 hover:bg-pink-700 w-full py-6 font-black">
                    START MEMORY TEST
                </AnimatedButton>
            )}
        </div>
    );
};

// PRO Glass Glide Game
const GlassGlideGame = ({ onWin, onPerfect }: { onWin: (percentage: number) => void, onPerfect?: () => void }) => {
    const [gameState, setGameState] = useState<"select" | "playing" | "result">("select");
    const [position, setPosition] = useState({ x: 5, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [obstacles, setObstacles] = useState<{ x: number, y: number, r: number, vx: number, vy: number }[]>([]);
    const [trackProgress, setTrackProgress] = useState(0);
    const gameRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();

    const initObstacles = () => {
        const obs = [];
        for (let i = 0; i < 12; i++) {
            obs.push({
                x: 20 + Math.random() * 60,
                y: 10 + Math.random() * 80,
                r: 15 + Math.random() * 15,
                vx: (Math.random() - 0.5) * 4, // Fast moving!
                vy: (Math.random() - 0.5) * 4
            });
        }
        setObstacles(obs);
    };

    const update = () => {
        if (gameState !== "playing") return;
        setObstacles(prev => prev.map(o => {
            let nx = o.x + o.vx;
            let ny = o.y + o.vy;
            let nvx = o.vx;
            let nvy = o.vy;
            if (nx < 15 || nx > 85) nvx *= -1;
            if (ny < 5 || ny > 95) nvy *= -1;
            return { ...o, x: nx, y: ny, vx: nvx, vy: nvy };
        }));
        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (gameState === "playing") requestRef.current = requestAnimationFrame(update);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [gameState]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || gameState !== "playing" || !gameRef.current) return;
        const rect = gameRef.current.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 100;
        const ny = ((e.clientY - rect.top) / rect.height) * 100;

        // Slippery physics - slight delay/drift
        setPosition(p => ({
            x: nx,
            y: ny
        }));

        setTrackProgress(p => Math.max(p, nx));

        // Check collision
        for (const o of obstacles) {
            const dx = nx - o.x;
            const dy = ny - o.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < (o.r / 2 + 3)) {
                handleGameOver(nx);
                return;
            }
        }

        if (nx >= 92) handleGameOver(100);
    };

    const handleGameOver = (finalX: number) => {
        setIsDragging(false);
        setGameState("result");
        let discount = 0;
        if (finalX >= 95) discount = 5;
        else if (finalX >= 70) discount = 3;
        else if (finalX >= 40) discount = 2;
        else if (finalX >= 20) discount = 1;

        if (discount > 0) {
            toast.success(`You reached ${finalX.toFixed(0)}%! Discount: ${discount}%`);
            if (finalX >= 100 && onPerfect) onPerfect();
            setTimeout(() => onWin(discount), 1000);
        } else {
            toast.error("Smashed! Try again.");
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-center font-black uppercase text-blue-400 mb-4 tracking-tighter">Obstacle Glide</h3>

            <div
                ref={gameRef}
                className="relative h-64 bg-gray-900 rounded-3xl border-4 border-gray-800 overflow-hidden touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
            >
                {gameState === "playing" ? (
                    <>
                        {obstacles.map((o, i) => (
                            <div
                                key={i}
                                className="absolute bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
                                style={{
                                    left: `${o.x}%`, top: `${o.y}%`, width: o.r, height: o.r,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        ))}
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] flex items-center justify-center">
                                <Martini className="w-5 h-5 text-white" />
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-xs text-gray-500 mb-4 uppercase">Win rates: Finsh 100%=5% • 70%=3% • 20%=1%</p>
                        <AnimatedButton
                            onClick={() => { initObstacles(); setGameState("playing"); setPosition({ x: 5, y: 50 }); setTrackProgress(0); }}
                            className="bg-blue-600 hover:bg-blue-700 font-black px-10 py-6 text-xl shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                        >
                            DRAG THE DRINK
                        </AnimatedButton>
                    </div>
                )}
            </div>

            <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-500" animate={{ width: `${trackProgress}%` }} />
            </div>
        </div>
    );
};

// Gamification Leaderboard Widget
const Leaderboard = () => {
    const scores = [
        { name: "Rahul S.", score: 100, game: "Glass Glide" },
        { name: "Priya V.", score: 98.4, game: "Pint Pour" },
        { name: "Anish K.", score: 15, game: "Mix Recall" },
        { name: "Sneha M.", score: 96.1, game: "Pint Pour" },
    ];

    return (
        <div className="mt-12 pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 text-center">Daily High Scorers</h4>
            <div className="space-y-3">
                {scores.map((s, i) => (
                    <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-gray-600">{i + 1}.</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-300 group-hover:text-amber-400 transition-colors">{s.name}</span>
                                <span className="text-[8px] uppercase tracking-tighter text-gray-600">{s.game}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500/30" style={{ width: `${(s.score / (s.game === 'Mix Recall' ? 20 : 100)) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-amber-500/80">{s.score}{s.game === 'Mix Recall' ? ' Lvl' : '%'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const GamificationHub = ({ onSecretUnlock }: { onSecretUnlock?: () => void }) => {
    const [activeGame, setActiveGame] = useState<"pint" | "memory" | "glide" | null>(null);
    const [discountWon, setDiscountWon] = useState<number | null>(null);
    const [coupon, setCoupon] = useState<string | null>(null);

    const handleWin = (discount: number) => {
        setDiscountWon(discount);
    };

    const handleClaim = (data: { phone: string; email: string, discount: number }) => {
        const code = `REWARD-${data.discount}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        setCoupon(code);
        sessionStorage.setItem("active_coupon", code);
        toast.success(`Coupon Generated: ${code}`);
    };

    useEffect(() => {
        const saved = sessionStorage.getItem("active_coupon");
        if (saved) setCoupon(saved);
    }, []);

    if (coupon) {
        return (
            <div className="p-8 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl border border-green-500/20 max-w-sm mx-auto my-8">
                <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white">REWARD CLAIMED</h3>
                <p className="text-sm text-gray-400 mb-6">Show this to your server</p>
                <div className="bg-black/50 p-6 rounded-2xl border-2 border-dashed border-green-500/50">
                    <span className="text-3xl font-mono font-black text-green-400">{coupon}</span>
                </div>
            </div>
        );
    }

    if (discountWon) {
        return (
            <div className="max-w-sm mx-auto my-8 px-4">
                <PrizeClaimForm percentage={discountWon} onClaim={handleClaim} />
            </div>
        );
    }

    return (
        <section className="py-12 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                        <Sparkles className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Skill Based Incentives</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 italic">WIN YOUR TAB</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">Elite skills get <span className="text-amber-400 font-bold">5% OFF</span>. Casuals get 1%. Are you good enough?</p>
                </div>

                {/* Group Goal / Community Achievement */}
                {!activeGame && (
                    <div className="mb-12 p-6 rounded-[2rem] bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-xs">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Community Goal
                                </h3>
                                <p className="text-[10px] text-gray-400 uppercase font-bold leading-relaxed">
                                    When 500 people win today, everyone gets a <span className="text-white">Secret Dessert unlock</span>!
                                </p>
                            </div>
                            <div className="flex-1 w-full max-w-md">
                                <div className="flex justify-between text-[10px] font-mono mb-2">
                                    <span className="text-blue-400">Progress: 412/500</span>
                                    <span className="text-gray-500">82% Achieved</span>
                                </div>
                                <div className="h-3 w-full bg-black/40 rounded-full border border-white/5 p-0.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "82%" }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!activeGame ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: "pint", icon: Beer, name: "PINT POUR", diff: "Normal", color: "amber" },
                            { id: "memory", icon: Martini, name: "MIX RECALL", diff: "Hard", color: "pink" },
                            { id: "glide", icon: Trophy, name: "GLASS GLIDE", diff: "Extreme", color: "blue" }
                        ].map((g) => (
                            <motion.button
                                key={g.id}
                                whileHover={{ scale: 1.05, translateY: -10 }}
                                onClick={() => setActiveGame(g.id as any)}
                                className={`p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center group relative overflow-hidden glass-advanced`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] bg-${g.color}-500/10 flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110`}>
                                    <g.icon className={`w-8 h-8 text-${g.color}-400`} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-1 tracking-tighter">{g.name}</h3>
                                <p className="text-[10px] uppercase font-bold text-gray-500 mb-4 tracking-tighter">Level: {g.diff}</p>
                                <div className={`text-[9px] font-black text-${g.color}-400 uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>Play Now →</div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-3xl relative">
                        <button onClick={() => setActiveGame(null)} className="absolute -top-3 -right-3 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 z-50">
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <div className="p-2">
                            {activeGame === "pint" && <PerfectPintGame onWin={handleWin} />}
                            {activeGame === "memory" && <CocktailMemoryGame onWin={handleWin} />}
                            {activeGame === "glide" && <GlassGlideGame onWin={handleWin} onPerfect={onSecretUnlock} />}
                        </div>
                    </motion.div>
                )}

                {/* Daily High-Score Leaderboard */}
                {!activeGame && <Leaderboard />}
            </div>
        </section>
    );
};

export default GamificationHub;
