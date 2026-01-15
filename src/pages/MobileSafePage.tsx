import { useNavigate } from "react-router-dom";
import { SEO, getHomePageSEO } from "@/components/SEO";
import { Menu, Globe, Star } from "lucide-react";

export const MobileSafePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO {...getHomePageSEO()} />
            <div className="min-h-screen bg-[#09090b] text-white p-4">
                {/* Simple Header */}
                <header className="py-6 text-center border-b border-white/10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        MenuX Prime
                    </h1>
                    <p className="text-gray-400 mt-2">Beautiful Digital Menus</p>
                </header>

                {/* Main Content */}
                <main className="max-w-2xl mx-auto py-12 space-y-8">
                    {/* Hero */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black">
                            QR Code Menus <br />
                            <span className="text-violet-400">Made Simple</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Create stunning digital menus in minutes
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid gap-4 mt-12">
                        {[
                            { icon: Menu, title: "Easy Menu Builder", desc: "Drag & drop interface" },
                            { icon: Globe, title: "Multi-Language", desc: "Support 20+ languages" },
                            { icon: Star, title: "Analytics", desc: "Track views & engagement" }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <feature.icon className="w-8 h-8 text-violet-400 mb-3" />
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-lg w-full"
                        >
                            Get Started Free
                        </button>
                        <p className="text-gray-500 text-sm mt-4">No credit card required</p>
                    </div>

                    {/* View Demo */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/menus')}
                            className="text-violet-400 underline"
                        >
                            View Demo Menu
                        </button>
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center py-8 mt-12 border-t border-white/10">
                    <p className="text-gray-500 text-sm">© 2026 MenuX Prime</p>
                </footer>
            </div>
        </>
    );
};
