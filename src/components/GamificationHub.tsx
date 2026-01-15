import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Beer, Martini, Trophy, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Perfect Pint Game
const PerfectPintGame = ({ onWin }: { onWin: () => void }) => {
    const [filling, setFilling] = useState(false);
    const [fillLevel, setFillLevel] = useState(0);
    const [target] = useState(Math.floor(Math.random() * 30) + 60); // 60-90%
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
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
                return prev + 2;
            });
        }, 50);
    };

    const stopFilling = () => {
        setFilling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setGameOver(true);

        const diff = Math.abs(fillLevel - target);
        if (diff <= 3) {
            setWon(true);
            onWin();
            toast.success("Perfect pour! 🍺", { description: "You won 5% off!" });
        } else {
            toast.error(`Missed by ${diff}%!`, { description: "Try again!" });
        }
    };

    const reset = () => {
        setFillLevel(0);
        setGameOver(false);
        setWon(false);
    };

    return (
        <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Beer className="w-6 h-6 text-amber-400" />
                The Perfect Pint
            </h3>
            <p className="text-gray-400 text-sm mb-6">Fill to exactly {target}%!</p>

            <div className="relative w-20 h-48 mx-auto bg-gray-800 rounded-b-xl border-4 border-gray-600 overflow-hidden">
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all"
                    style={{ height: `${fillLevel}%` }}
                />
                <div className="absolute w-full border-t-2 border-dashed border-green-400"
                    style={{ bottom: `${target}%` }}
                />
            </div>

            <p className="mt-4 text-2xl font-mono">{fillLevel}%</p>

            {!gameOver ? (
                <Button
                    onMouseDown={startFilling}
                    onMouseUp={stopFilling}
                    onMouseLeave={stopFilling}
                    onTouchStart={startFilling}
                    onTouchEnd={stopFilling}
                    className="mt-4 w-full bg-amber-500 hover:bg-amber-600"
                >
                    {filling ? "POURING..." : "HOLD TO POUR"}
                </Button>
            ) : (
                <div className="mt-4 space-y-2">
                    <p className={won ? "text-green-400" : "text-red-400"}>
                        {won ? "🎉 Perfect!" : `❌ Target was ${target}%`}
                    </p>
                    {!won && (
                        <Button onClick={reset} variant="outline" className="gap-2">
                            <RotateCcw className="w-4 h-4" /> Try Again
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

// Cocktail Memory Game
const CocktailMemoryGame = ({ onWin }: { onWin: () => void }) => {
    const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308"];
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [level, setLevel] = useState(1);
    const [activeColor, setActiveColor] = useState<number | null>(null);

    const startGame = () => {
        const newSeq = [Math.floor(Math.random() * 4)];
        setSequence(newSeq);
        setPlayerSequence([]);
        setLevel(1);
        playSequence(newSeq);
    };

    const playSequence = async (seq: number[]) => {
        setIsPlaying(true);
        for (const idx of seq) {
            await new Promise(r => setTimeout(r, 500));
            setActiveColor(idx);
            await new Promise(r => setTimeout(r, 400));
            setActiveColor(null);
        }
        setIsPlaying(false);
    };

    const handleClick = (idx: number) => {
        if (isPlaying) return;

        const newPlayerSeq = [...playerSequence, idx];
        setPlayerSequence(newPlayerSeq);
        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 200);

        if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
            toast.error("Wrong! Game Over", { description: `You reached level ${level}` });
            setSequence([]);
            setPlayerSequence([]);
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            if (level >= 5) {
                onWin();
                toast.success("🎉 You won!", { description: "5% discount unlocked!" });
                return;
            }

            const newSeq = [...sequence, Math.floor(Math.random() * 4)];
            setSequence(newSeq);
            setPlayerSequence([]);
            setLevel(l => l + 1);
            setTimeout(() => playSequence(newSeq), 1000);
        }
    };

    return (
        <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Martini className="w-6 h-6 text-pink-400" />
                Cocktail Recall
            </h3>
            <p className="text-gray-400 text-sm mb-2">Reach level 5 to win!</p>
            <p className="text-violet-400 font-bold mb-4">Level: {level}/5</p>

            <div className="grid grid-cols-2 gap-3 max-w-48 mx-auto mb-6">
                {colors.map((color, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleClick(idx)}
                        disabled={isPlaying || sequence.length === 0}
                        className="w-20 h-20 rounded-xl transition-all duration-200"
                        style={{
                            backgroundColor: color,
                            opacity: activeColor === idx ? 1 : 0.5,
                            transform: activeColor === idx ? "scale(1.1)" : "scale(1)",
                        }}
                    />
                ))}
            </div>

            {sequence.length === 0 && (
                <Button onClick={startGame} className="bg-pink-500 hover:bg-pink-600">
                    Start Game
                </Button>
            )}
        </div>
    );
};

// Main Gamification Hub
export const GamificationHub = () => {
    const [activeGame, setActiveGame] = useState<"pint" | "memory" | null>(null);
    const [coupon, setCoupon] = useState<string | null>(null);

    const handleWin = () => {
        const code = `WIN5-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setCoupon(code);
        sessionStorage.setItem("gameCoupon", code);
    };

    useEffect(() => {
        const saved = sessionStorage.getItem("gameCoupon");
        if (saved) setCoupon(saved);
    }, []);

    if (coupon) {
        return (
            <section className="py-16 px-4">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-3xl p-8 text-center"
                    >
                        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">🎉 You Won!</h3>
                        <p className="text-gray-400 mb-6">Show this code at checkout</p>
                        <div className="bg-black/50 rounded-xl p-4">
                            <p className="text-3xl font-mono font-bold text-amber-400">{coupon}</p>
                            <p className="text-sm text-gray-400 mt-2">5% OFF your bill</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                        🎮 BAR CADE
                    </h2>
                    <p className="text-gray-400">
                        Beat a game. Win <span className="text-amber-400 font-bold">5% OFF</span> your bill!
                    </p>
                </div>

                {!activeGame ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveGame("pint")}
                            className="cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                        >
                            <Beer className="w-12 h-12 text-amber-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">The Perfect Pint</h3>
                            <p className="text-gray-400 text-sm">Pour the beer to the exact target level</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveGame("memory")}
                            className="cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors"
                        >
                            <Martini className="w-12 h-12 text-pink-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Cocktail Recall</h3>
                            <p className="text-gray-400 text-sm">Remember the color sequence</p>
                        </motion.div>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto bg-card/50 backdrop-blur border border-white/10 rounded-3xl">
                        <div className="flex justify-end p-4">
                            <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {activeGame === "pint" && <PerfectPintGame onWin={handleWin} />}
                        {activeGame === "memory" && <CocktailMemoryGame onWin={handleWin} />}
                    </div>
                )}
            </div>
        </section>
    );
};

export default GamificationHub;
