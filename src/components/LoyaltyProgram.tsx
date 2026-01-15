import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const LoyaltyProgram = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [passCode, setPassCode] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill all fields");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const code = `MENUX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setPassCode(code);
        setIsSubmitting(false);
        toast.success("Welcome to the club!", { description: `Your pass code: ${code}` });
    };

    if (!isOpen) {
        return (
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-amber-600/20 border border-white/10 p-8 sm:p-12 text-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 shadow-lg shadow-violet-500/25">
                                <Gift className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">
                                Join Our <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Loyalty Club</span>
                            </h2>

                            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                                Get exclusive discounts, early access to new features, and special offers.
                            </p>

                            <Button
                                onClick={() => setIsOpen(true)}
                                className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                            >
                                Get Your Free Pass
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (passCode) {
        return (
            <section className="py-16 px-4">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Club!</h3>
                        <p className="text-green-300 mb-6">Your loyalty pass is ready</p>
                        <div className="bg-black/50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-gray-400 mb-1">Your Pass Code</p>
                            <p className="text-2xl font-mono font-bold text-white">{passCode}</p>
                        </div>
                        <p className="text-sm text-gray-400">Save this code to unlock exclusive rewards!</p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-card/50 backdrop-blur border border-white/10 rounded-3xl p-8"
                >
                    <h3 className="text-2xl font-bold text-center mb-6">Create Your Pass</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="bg-white/5 border-white/10"
                        />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="bg-white/5 border-white/10"
                        />
                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="bg-white/5 border-white/10"
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Pass...
                                </>
                            ) : (
                                "Create My Pass"
                            )}
                        </Button>
                    </form>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-4 text-sm text-gray-500 hover:text-white"
                    >
                        Cancel
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default LoyaltyProgram;
