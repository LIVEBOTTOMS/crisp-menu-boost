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

// Main Gamification Hub
export const GamificationHub = () => {
    const [activeGame, setActiveGame] = useState<"pint" | "memory" | null>(null);
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
                        Beat the challenge. Claim your discount!
                    </p>
                    <p className="text-red-400 text-[10px] mt-1">⚠️ EXTREME DIFFICULTY</p>
                </div>

                <AnimatePresence mode="wait">
                    {!activeGame ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame("pint")}
                                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                            >
                                <Beer className="w-8 h-8 text-amber-400 mb-2" />
                                <h3 className="font-bold text-sm mb-1">Perfect Pint</h3>
                                <p className="text-gray-400 text-[10px]">Pour to exact %</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame("memory")}
                                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors"
                            >
                                <Martini className="w-8 h-8 text-pink-400 mb-2" />
                                <h3 className="font-bold text-sm mb-1">Cocktail Recall</h3>
                                <p className="text-gray-400 text-[10px]">Memory challenge</p>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default GamificationHub;
