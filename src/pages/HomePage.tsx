import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Zap,
    Smartphone,
    Menu as MenuIcon,
    X,
    ChevronRight,
    Star,
    Check,
    ArrowRight,
    Globe,
    Users,
    TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedButton } from "@/components/ui/animated-button";

interface Venue {
    id: string;
    name: string;
    slug: string;
}

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Real-Time Sync",
            description: "Update once, reflect everywhere instantly"
        },
        {
            icon: Smartphone,
            title: "Mobile-First Design",
            description: "Stunning on every device, every time"
        },
        {
            icon: Globe,
            title: "Multi-Venue",
            description: "Manage unlimited locations effortlessly"
        },
        {
            icon: TrendingUp,
            title: "Analytics Ready",
            description: "Track views, engagement, and trends"
        }
    ];

    const stats = [
        { label: "Active Restaurants", value: "500+" },
        { label: "Menus Created", value: "2K+" },
        { label: "Customer Satisfaction", value: "99%" }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                                <span className="font-black text-base sm:text-xl text-white">X</span>
                            </div>
                            <span className="font-black text-lg sm:text-2xl tracking-tight">
                                MENU<span className="text-cyan-400">X</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8">
                            <button
                                onClick={() => navigate('/menus')}
                                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                            >
                                Explore
                            </button>
                            {user ? (
                                <AnimatedButton
                                    onClick={() => navigate('/menus')}
                                    variant="primary"
                                    size="sm"
                                >
                                    Dashboard
                                </AnimatedButton>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                                    >
                                        Login
                                    </button>
                                    <AnimatedButton
                                        onClick={() => navigate('/auth')}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Get Started
                                    </AnimatedButton>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
                        <div className="px-4 py-6 space-y-4">
                            <button
                                onClick={() => {
                                    navigate('/menus');
                                    setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
                            >
                                Explore Menus
                            </button>
                            {user ? (
                                <button
                                    onClick={() => {
                                        navigate('/menus');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                                    style={{ color: '#ffffff' }}
                                >
                                    Dashboard
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate('/auth');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/auth');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                                        style={{ color: '#ffffff' }}
                                    >
                                        Get Started Free
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 fill-cyan-400" />
                            <span className="text-xs sm:text-sm font-bold text-gray-300">World-Class Menu Platform</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 sm:mb-8 leading-tight" style={{ color: '#ffffff' }}>
                        <span style={{ color: '#ffffff' }}>Create Premium</span>
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Digital Menus
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base sm:text-lg lg:text-xl text-gray-400 text-center max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4" style={{ color: '#9ca3af' }}>
                        The complete SaaS platform for restaurants. Real-time sync, multi-venue management, and stunning designs that convert.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <button
                            onClick={() => navigate('/create-menu')}
                            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-base sm:text-lg transition-all shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 flex items-center justify-center gap-3"
                            style={{ color: '#ffffff' }}
                        >
                            <span style={{ color: '#ffffff' }}>Start Creating Free</span>
                            <ArrowRight className="w-5 h-5" style={{ color: '#ffffff' }} />
                        </button>
                        <button
                            onClick={() => navigate('/menus')}
                            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl border-2 border-white/20 hover:bg-white/5 font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-3"
                            style={{ color: '#ffffff' }}
                        >
                            <span style={{ color: '#ffffff' }}>View Live Demos</span>
                            <ChevronRight className="w-5 h-5" style={{ color: '#ffffff' }} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-400 mb-1 sm:mb-2" style={{ color: '#22d3ee' }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 font-semibold" style={{ color: '#6b7280' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-cyan-950/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
                            Built for Modern Restaurants
                        </h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
                            Everything you need to manage and display your menus professionally
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="glass-card p-6 sm:p-8 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#ffffff' }} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: '#ffffff' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400 leading-relaxed" style={{ color: '#9ca3af' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 backdrop-blur-xl">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
                            Ready to Transform Your Menu?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10" style={{ color: '#9ca3af' }}>
                            Join hundreds of restaurants using MenuX Prime
                        </p>
                        <button
                            onClick={() => navigate('/create-menu')}
                            className="px-8 sm:px-12 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-base sm:text-xl transition-all shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
                            style={{ color: '#ffffff' }}
                        >
                            <span style={{ color: '#ffffff' }}>Start Free Trial</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-500" style={{ color: '#6b7280' }}>
                    © {new Date().getFullYear()} MenuX Prime. The premium menu platform for elite hospitality.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
