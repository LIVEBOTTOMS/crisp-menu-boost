import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beer, Martini, Trophy, X, RotateCcw, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Prize Claim Form - Requires phone and email
const PrizeClaimForm = ({ onClaim }: { onClaim: (data: { phone: string; email: string }) => void }) => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
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
        onClaim({ phone, email });
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center"
        >
            <Gift className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
            <p className="text-gray-400 text-sm mb-6">
                Enter your details to claim your <span className="text-amber-400 font-bold">5% discount</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-black/30 border-amber-500/30 text-center"
                    required
                />
                <Input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-amber-500/30 text-center"
                    required
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Claiming...
                        </>
                    ) : (
                        "Claim My Prize"
                    )}
                </Button>
            </form>
        </motion.div>
    );
};

// HARD Perfect Pint Game - Requires precision within 2%
const PerfectPintGame = ({ onWin }: { onWin: () => void }) => {
    const [filling, setFilling] = useState(false);
    const [fillLevel, setFillLevel] = useState(0);
    const [target] = useState(Math.floor(Math.random() * 20) + 70); // 70-90%
    const [speed] = useState(3 + Math.random() * 2); // Variable speed makes it harder
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startFilling = () => {
        if (gameOver) return;
        setFilling(true);
        intervalRef.current = setInterval(() => {
            setFillLevel(prev => {
                if (prev >= 100) {
                    stopFilling();
                    return 100;
                }
                return prev + speed;
            });
        }, 50);
    };

    const stopFilling = () => {
        setFilling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setGameOver(true);
        setAttempts(a => a + 1);

        const diff = Math.abs(fillLevel - target);
        if (diff <= 2) { // Must be within 2% - Very hard!
            setWon(true);
            onWin();
            toast.success("🍺 PERFECT POUR!", { description: "Incredible precision!" });
        } else {
            toast.error(`Missed by ${diff.toFixed(1)}%`, { description: `Target was ${target}%` });
        }
    };

    const reset = () => {
        setFillLevel(0);
        setGameOver(false);
        setWon(false);
    };

    return (
        <div className="text-center p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Beer className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold">The Perfect Pint</h3>
            </div>
            <p className="text-gray-400 text-xs mb-1">Fill to EXACTLY {target}%</p>
            <p className="text-red-400 text-[10px] mb-4">⚠️ Must be within 2% to win!</p>

            <div className="relative w-16 h-40 mx-auto bg-gray-800 rounded-b-xl border-4 border-gray-600 overflow-hidden">
                {/* Target line */}
                <div
                    className="absolute w-full border-t-2 border-dashed border-green-400 z-10"
                    style={{ bottom: `${target}%` }}
                >
                    <span className="absolute -right-8 -top-2 text-[8px] text-green-400">{target}%</span>
                </div>
                {/* Fill */}
                <motion.div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 to-amber-300"
                    animate={{ height: `${fillLevel}%` }}
                    transition={{ duration: 0.05 }}
                />
                {/* Foam effect */}
                {fillLevel > 5 && (
                    <div
                        className="absolute w-full h-3 bg-white/80 rounded-t-full"
                        style={{ bottom: `${Math.min(fillLevel, 97)}%` }}
                    />
                )}
            </div>

            <p className="mt-3 text-xl font-mono font-bold">{fillLevel.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Attempts: {attempts}</p>

            {!gameOver ? (
                <Button
                    onMouseDown={startFilling}
                    onMouseUp={stopFilling}
                    onMouseLeave={() => filling && stopFilling()}
                    onTouchStart={startFilling}
                    onTouchEnd={stopFilling}
                    className="mt-4 w-full bg-amber-500 hover:bg-amber-600 active:scale-95"
                >
                    {filling ? "🍺 POURING..." : "HOLD TO POUR"}
                </Button>
            ) : (
                <div className="mt-4 space-y-2">
                    <p className={`text-sm font-bold ${won ? "text-green-400" : "text-red-400"}`}>
                        {won ? "🎉 PERFECT!" : `❌ Off by ${Math.abs(fillLevel - target).toFixed(1)}%`}
                    </p>
                    {!won && (
                        <Button onClick={reset} variant="outline" size="sm" className="gap-2">
                            <RotateCcw className="w-4 h-4" /> Try Again
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

// HARD Cocktail Memory Game - Must reach level 7
const CocktailMemoryGame = ({ onWin }: { onWin: () => void }) => {
    const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ec4899"];
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [level, setLevel] = useState(1);
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const [showSpeed, setShowSpeed] = useState(500);
    const winLevel = 7; // Must reach level 7 to win

    const startGame = () => {
        const newSeq = [Math.floor(Math.random() * 6)];
        setSequence(newSeq);
        setPlayerSequence([]);
        setLevel(1);
        setShowSpeed(500);
        playSequence(newSeq);
    };

    const playSequence = async (seq: number[]) => {
        setIsPlaying(true);
        await new Promise(r => setTimeout(r, 500));

        for (const idx of seq) {
            setActiveColor(idx);
            await new Promise(r => setTimeout(r, showSpeed));
            setActiveColor(null);
            await new Promise(r => setTimeout(r, 150));
        }
        setIsPlaying(false);
    };

    const handleClick = (idx: number) => {
        if (isPlaying) return;

        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 150);

        const newPlayerSeq = [...playerSequence, idx];
        setPlayerSequence(newPlayerSeq);

        // Check if wrong
        if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
            toast.error("Wrong sequence!", { description: `You reached level ${level}` });
            setSequence([]);
            setPlayerSequence([]);
            return;
        }

        // Check if completed current level
        if (newPlayerSeq.length === sequence.length) {
            if (level >= winLevel) {
                onWin();
                toast.success("🎉 MASTER MIXOLOGIST!", { description: "You won!" });
                return;
            }

            // Next level - faster and longer
            const newSeq = [...sequence, Math.floor(Math.random() * 6)];
            setSequence(newSeq);
            setPlayerSequence([]);
            setLevel(l => l + 1);
            setShowSpeed(s => Math.max(200, s - 30)); // Gets faster each level
            setTimeout(() => playSequence(newSeq), 800);
        }
    };

    return (
        <div className="text-center p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Martini className="w-6 h-6 text-pink-400" />
                <h3 className="text-lg font-bold">Cocktail Recall</h3>
            </div>
            <p className="text-gray-400 text-xs mb-1">Reach level {winLevel} to win!</p>
            <p className="text-violet-400 font-bold text-sm mb-4">Level: {level}/{winLevel}</p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                    animate={{ width: `${(level / winLevel) * 100}%` }}
                />
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-40 mx-auto mb-4">
                {colors.map((color, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleClick(idx)}
                        disabled={isPlaying || sequence.length === 0}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-lg transition-all duration-100 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: color,
                            opacity: activeColor === idx ? 1 : 0.4,
                            boxShadow: activeColor === idx ? `0 0 20px ${color}` : 'none',
                            transform: activeColor === idx ? 'scale(1.1)' : 'scale(1)',
                        }}
                    />
                ))}
            </div>

            {sequence.length === 0 && (
                <Button onClick={startGame} className="bg-pink-500 hover:bg-pink-600">
                    Start Challenge
                </Button>
            )}

            {isPlaying && (
                <p className="text-xs text-gray-400 animate-pulse">Watch carefully...</p>
            )}
        </div>
    );
};

// EXTREMELY HARD Glass Glide Game
const GlassGlideGame = ({ onWin }: { onWin: () => void }) => {
    const [gameState, setGameState] = useState<"select" | "playing" | "won" | "lost">("select");
    const [drink, setDrink] = useState<"beer" | "martini" | "whiskey">("beer");
    const [position, setPosition] = useState({ x: 10, y: 50 }); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const [obstacles, setObstacles] = useState<{ x: number, y: number, type: "ice" | "lemon", size: number, vy: number }[]>([]);
    const gameRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();

    const initGame = (selectedDrink: "beer" | "martini" | "whiskey") => {
        setDrink(selectedDrink);
        setGameState("playing");
        setPosition({ x: 5, y: 50 });

        // Create random difficult obstacles
        const newObstacles = Array.from({ length: 8 }).map((_, i) => ({
            x: 20 + i * 10,
            y: Math.random() * 80 + 10,
            type: Math.random() > 0.5 ? "ice" : "lemon" as const,
            size: 15 + Math.random() * 10,
            vy: (Math.random() - 0.5) * 2 // Moving obstacles make it 20% win rate hard
        }));
        setObstacles(newObstacles);
    };

    const update = () => {
        if (gameState !== "playing") return;

        setObstacles(prev => prev.map(obs => {
            let newY = obs.y + obs.vy;
            let newVy = obs.vy;
            if (newY < 5 || newY > 95) newVy *= -1;
            return { ...obs, y: newY, vy: newVy };
        }));

        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || gameState !== "playing" || !gameRef.current) return;

        const rect = gameRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Bounds check
        const newX = Math.max(0, Math.min(100, x));
        const newY = Math.max(0, Math.min(100, y));

        // Collision Detection
        for (const obs of obstacles) {
            const dx = newX - obs.x;
            const dy = newY - obs.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (obs.size / 2 + 5)) { // 5 is roughly drink radius
                setGameState("lost");
                setIsDragging(false);
                toast.error("💥 SPILL!", { description: "You hit an obstacle!" });
                return;
            }
        }

        setPosition({ x: newX, y: newY });

        if (newX > 90) {
            setGameState("won");
            setIsDragging(false);
            onWin();
            toast.success("🥂 SMOOTH!", { description: "Delivery successful!" });
        }
    };

    if (gameState === "select") {
        return (
            <div className="p-6 text-center">
                <h3 className="font-bold mb-4">Select Your Vessel</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: "beer" as const, icon: Beer, label: "Pint" },
                        { id: "martini" as const, icon: Martini, label: "Cocktail" },
                        { id: "whiskey" as const, icon: Gift, label: "On Rocks" },
                    ].map((v) => (
                        <button
                            key={v.id}
                            onClick={() => initGame(v.id)}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all flex flex-col items-center gap-2"
                        >
                            <v.icon className="w-8 h-8 text-amber-400" />
                            <span className="text-[10px] uppercase font-bold">{v.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 select-none">
            <div className="flex justify-between items-center mb-4 text-[10px] uppercase font-bold text-gray-500">
                <span>Start</span>
                <span className="text-amber-500 text-center px-2">Glide the drink to the end without hitting ice or lemons</span>
                <span>Goal</span>
            </div>

            <div
                ref={gameRef}
                className="relative h-64 bg-black/40 rounded-xl border border-white/10 overflow-hidden cursor-crosshair touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
            >
                {/* Track Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* Start & End Zones */}
                <div className="absolute inset-y-0 left-0 w-[10%] bg-green-500/10 border-r border-green-500/20 flex items-center justify-center">
                    <div className="[writing-mode:vertical-lr] text-[8px] text-green-500/50 font-black">START</div>
                </div>
                <div className="absolute inset-y-0 right-0 w-[10%] bg-amber-500/10 border-l border-amber-500/20 flex items-center justify-center">
                    <div className="[writing-mode:vertical-lr] text-[8px] text-amber-500/50 font-black">FINISH</div>
                </div>

                {/* Obstacles */}
                {obstacles.map((obs, i) => (
                    <motion.div
                        key={i}
                        className="absolute flex items-center justify-center pointer-events-none"
                        style={{
                            left: `${obs.x}%`,
                            top: `${obs.y}%`,
                            width: obs.size,
                            height: obs.size,
                            marginLeft: -obs.size / 2,
                            marginTop: -obs.size / 2
                        }}
                    >
                        {obs.type === "ice" ? (
                            <div className="w-full h-full bg-blue-200/40 rounded-sm border border-blue-100/50 backdrop-blur-sm rotate-12 shadow-[0_0_10px_rgba(191,219,254,0.3)]" />
                        ) : (
                            <div className="w-full h-full bg-yellow-400/60 rounded-full border border-yellow-200/50 shadow-[0_0_10px_rgba(250,204,21,0.3)] flex items-center justify-center text-[10px]">🍋</div>
                        )}
                    </motion.div>
                ))}

                {/* The Drink */}
                <motion.div
                    className="absolute z-20 cursor-grab active:cursor-grabbing"
                    style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        marginLeft: -20,
                        marginTop: -20
                    }}
                    onPointerDown={() => setIsDragging(true)}
                >
                    <div className={`p-2 rounded-full shadow-2xl transition-transform ${isDragging ? 'scale-125' : 'scale-100'}`}>
                        {drink === "beer" && <Beer className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}
                        {drink === "martini" && <Martini className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />}
                        {drink === "whiskey" && <Gift className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />}
                    </div>
                </motion.div>

                {/* Overlay for Game Over */}
                {gameState === "lost" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                        <h4 className="text-red-500 font-bold mb-2">TRY AGAIN?</h4>
                        <Button onClick={() => setGameState("select")} size="sm" variant="outline" className="gap-2">
                            <RotateCcw className="w-4 h-4" /> Restart
                        </Button>
                    </div>
                )}
            </div>

            <p className="text-[10px] text-gray-500 text-center mt-4 uppercase tracking-widest">
                Drag the drink from left to right. Don't touch the ice or lemons!
            </p>
        </div>
    );
};

// Main Gamification Hub
export const GamificationHub = () => {
    const [activeGame, setActiveGame] = useState<"pint" | "memory" | "glide" | null>(null);
    const [hasWon, setHasWon] = useState(false);
    const [coupon, setCoupon] = useState<string | null>(null);
    const [claimData, setClaimData] = useState<{ phone: string; email: string } | null>(null);

    const handleWin = () => {
        setHasWon(true);
    };

    const handleClaim = (data: { phone: string; email: string }) => {
        const code = `WIN5-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setCoupon(code);
        setClaimData(data);
        sessionStorage.setItem("gameCoupon", code);
        sessionStorage.setItem("gameClaimData", JSON.stringify(data));
        toast.success("Prize claimed!", { description: `Code: ${code}` });
    };

    useEffect(() => {
        const savedCoupon = sessionStorage.getItem("gameCoupon");
        const savedData = sessionStorage.getItem("gameClaimData");
        if (savedCoupon && savedData) {
            setCoupon(savedCoupon);
            setClaimData(JSON.parse(savedData));
        }
    }, []);

    // Already claimed
    if (coupon && claimData) {
        return (
            <section className="py-8 px-4">
                <div className="max-w-sm mx-auto">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center"
                    >
                        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-1">🎉 You Won!</h3>
                        <p className="text-gray-400 text-sm mb-4">Show this code at checkout</p>
                        <div className="bg-black/50 rounded-xl p-4">
                            <p className="text-2xl font-mono font-bold text-amber-400">{coupon}</p>
                            <p className="text-xs text-gray-400 mt-1">5% OFF your bill</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Won but need to claim
    if (hasWon && !coupon) {
        return (
            <section className="py-8 px-4">
                <div className="max-w-sm mx-auto">
                    <PrizeClaimForm onClaim={handleClaim} />
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                        🎮 WIN 5% OFF
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Beat the extreme challenge to claim your discount!
                    </p>
                    <p className="text-red-400 text-[10px] mt-1 uppercase tracking-tighter">⚠️ Maximum difficulty: Only 20% win chance</p>
                </div>

                <AnimatePresence mode="wait">
                    {!activeGame ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-3 gap-3"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame("pint")}
                                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                            >
                                <Beer className="w-8 h-8 text-amber-400 mb-2 mx-auto" />
                                <h3 className="font-bold text-[10px] mb-1 uppercase">Pint Pour</h3>
                                <p className="text-gray-400 text-[8px]">Precision pour</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame("memory")}
                                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors"
                            >
                                <Martini className="w-8 h-8 text-pink-400 mb-2 mx-auto" />
                                <h3 className="font-bold text-[10px] mb-1 uppercase">Mix Recall</h3>
                                <p className="text-gray-400 text-[8px]">Memory test</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame("glide")}
                                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors border-dashed"
                            >
                                <div className="relative mb-2 w-8 h-8 mx-auto">
                                    <Beer className="w-8 h-8 text-cyan-400" />
                                    <div className="absolute -right-2 -top-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[7px] font-black text-white">NEW</div>
                                </div>
                                <h3 className="font-bold text-[10px] mb-1 uppercase">Glass Glide</h3>
                                <p className="text-gray-400 text-[8px]">Dodge ice cubes</p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-card/50 backdrop-blur border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="flex justify-end p-3 border-b border-white/5">
                                <button
                                    onClick={() => setActiveGame(null)}
                                    className="text-gray-400 hover:text-white p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {activeGame === "pint" && <PerfectPintGame onWin={handleWin} />}
                            {activeGame === "memory" && <CocktailMemoryGame onWin={handleWin} />}
                            {activeGame === "glide" && <GlassGlideGame onWin={handleWin} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default GamificationHub;
