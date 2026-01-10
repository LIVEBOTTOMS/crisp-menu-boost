import { useState, useEffect, useRef, TouchEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Zap,
    Smartphone,
    Menu as MenuIcon,
    X,
    Star,
    ArrowRight,
    Globe,
    TrendingUp,
    Sparkles,
    Shield,
    QrCode,
    Palette,
    BarChart3,
    Play,
    CheckCircle2,
    ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Touch swipe handling for testimonials
    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            // Swipe left
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }

        if (touchStart - touchEnd < -75) {
            // Swipe right
            setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
        }
    };

    const features = [
        {
            icon: Zap,
            title: "Real-Time Sync",
            description: "Update prices, add items, change descriptions—everything syncs instantly across all devices.",
            gradient: "from-amber-400 to-orange-500",
            color: "amber"
        },
        {
            icon: QrCode,
            title: "Smart QR Codes",
            description: "Generate beautiful, branded QR codes that customers can scan to view your menu instantly.",
            gradient: "from-violet-400 to-purple-600",
            color: "violet"
        },
        {
            icon: Palette,
            title: "Premium Themes",
            description: "Choose from stunning themes like Cyberpunk, Elegant Classic, and Vibrant Playful.",
            gradient: "from-fuchsia-400 to-pink-600",
            color: "fuchsia"
        },
        {
            icon: Globe,
            title: "Multi-Venue",
            description: "Manage unlimited restaurant locations from a single dashboard. Each venue, its own menu.",
            gradient: "from-emerald-400 to-teal-600",
            color: "emerald"
        },
        {
            icon: BarChart3,
            title: "Analytics",
            description: "Track menu views, popular items, peak hours, and customer engagement in real-time.",
            gradient: "from-blue-400 to-violet-600",
            color: "blue"
        },
        {
            icon: Shield,
            title: "Enterprise Ready",
            description: "Bank-grade security, 99.9% uptime, and dedicated support for your business.",
            gradient: "from-rose-400 to-red-600",
            color: "rose"
        }
    ];

    const testimonials = [
        {
            quote: "MenuX transformed how we handle our menu. Updates take seconds, not hours. Our customers love the sleek digital experience.",
            author: "Rahul Sharma",
            role: "Owner, The Grand Kitchen",
            avatar: "RS",
            rating: 5
        },
        {
            quote: "The QR code feature alone saved us thousands in printing costs. Plus, the cyberpunk theme matches our bar's vibe perfectly!",
            author: "Priya Patel",
            role: "Manager, Neon Nights Lounge",
            avatar: "PP",
            rating: 5
        },
        {
            quote: "Managing 5 restaurant locations was a nightmare. Now it's a breeze. One dashboard, all venues, real-time sync.",
            author: "Vikram Mehta",
            role: "CEO, FoodChain Group",
            avatar: "VM",
            rating: 5
        }
    ];

    const stats = [
        { value: "500+", label: "Restaurants", icon: "🍽️" },
        { value: "50K+", label: "Menus Served", icon: "📱" },
        { value: "99.9%", label: "Uptime", icon: "⚡" },
        { value: "4.9★", label: "Rating", icon: "⭐" }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for trying out MenuX",
            features: ["1 Menu", "Basic Themes", "QR Code", "Email Support"],
            cta: "Start Free",
            popular: false
        },
        {
            name: "Pro",
            price: "₹999",
            period: "/month",
            description: "For growing restaurants",
            features: ["5 Menus", "All Premium Themes", "Custom QR Codes", "Analytics", "Priority Support", "PDF Export"],
            cta: "Get Pro",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For restaurant chains",
            features: ["Unlimited Menus", "White-label Solution", "API Access", "Dedicated Manager", "SLA Guarantee", "Custom Integrations"],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
            {/* Animated Background with Parallax */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,90,220,0.15),transparent)]" />
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(120,90,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,90,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px] transition-transform duration-300"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                />
                <div
                    className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px] animate-pulse"
                    style={{ animationDuration: '8s' }}
                />
                <div
                    className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[180px] animate-pulse"
                    style={{ animationDelay: '2s', animationDuration: '10s' }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[200px]"
                    style={{ animationDelay: '4s', animationDuration: '12s' }}
                />
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-[#09090b]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo with pulse animation */}
                        <div className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/')}>
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 touch-manipulation">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 animate-pulse opacity-75 blur-sm" />
                                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform">
                                    <span className="font-black text-xl text-white drop-shadow-lg">M</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl sm:text-2xl tracking-tight leading-none">
                                    MENU<span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">X</span>
                                </span>
                                <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-medium">Premium Menus</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Features
                            </button>
                            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Pricing
                            </button>
                            <button onClick={() => navigate('/menus')}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Demos
                            </button>
                            {user ? (
                                <button
                                    onClick={() => navigate('/menus')}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105 active:scale-95"
                                >
                                    Dashboard →
                                </button>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button onClick={() => navigate('/auth')}
                                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95 touch-manipulation"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu with slide animation */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-6 space-y-3">
                        <button onClick={() => { navigate('/menus'); setMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium active:scale-98 touch-manipulation">
                            Explore Menus
                        </button>
                        {user ? (
                            <button onClick={() => { navigate('/menus'); setMobileMenuOpen(false); }}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold active:scale-98 touch-manipulation">
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium active:scale-98 touch-manipulation">
                                    Sign In
                                </button>
                                <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold active:scale-98 touch-manipulation">
                                    Get Started Free
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section with enhanced mobile design */}
            <section ref={heroRef} className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left - Content */}
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            {/* Badge with bounce animation */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-6 sm:mb-8 animate-bounce-slow">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                                    #1 Digital Menu Platform in India
                                </span>
                            </div>

                            {/* Headline with gradient animation */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-4 sm:mb-6">
                                <span className="text-white animate-fade-in-up">Beautiful Menus</span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent animate-gradient-x">
                                    That Convert
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Create stunning digital menus in minutes. Real-time updates, QR codes, analytics & more.
                                <span className="text-amber-400 font-medium"> Trusted by 500+ restaurants.</span>
                            </p>

                            {/* CTA Buttons - Touch optimized */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="group w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 font-bold text-base sm:text-lg transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95 touch-manipulation flex items-center justify-center gap-3"
                                >
                                    <span>Start Free Trial</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/menus')}
                                    className="group w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-base sm:text-lg transition-all active:scale-95 touch-manipulation flex items-center justify-center gap-3"
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Watch Demo</span>
                                </button>
                            </div>

                            {/* Trust Indicators - Mobile optimized */}
                            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="flex -space-x-3">
                                    {['RS', 'PP', 'VM', 'AK'].map((initials, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 border-2 border-[#09090b] flex items-center justify-center text-xs font-bold animate-fade-in-up"
                                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                        >
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Loved by 500+ restaurants</p>
                                </div>
                            </div>

                            {/* Scroll indicator - Mobile only */}
                            <div className="mt-12 lg:hidden flex justify-center animate-bounce">
                                <ChevronDown className="w-6 h-6 text-violet-400" />
                            </div>
                        </div>

                        {/* Right - Phone Mockup with 3D effect */}
                        <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                            <div className="relative group">
                                {/* Enhanced Glow Effects */}
                                <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/30 to-amber-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
                                <div className="absolute -inset-5 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 rounded-full blur-2xl opacity-30 animate-pulse" />

                                {/* Phone Frame with 3D transform */}
                                <div
                                    className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[40px] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl shadow-black/50 transform-gpu transition-transform duration-300 hover:scale-105"
                                    style={{
                                        transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`
                                    }}
                                >
                                    <div className="w-full h-full rounded-[32px] bg-[#09090b] overflow-hidden relative">
                                        {/* Phone Notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />

                                        {/* Menu Preview with animations */}
                                        <div className="w-full h-full p-4 pt-10 overflow-hidden">
                                            {/* Header */}
                                            <div className="text-center mb-6 animate-fade-in">
                                                <h3 className="font-black text-2xl bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">LIVE</h3>
                                                <p className="text-[10px] text-violet-400 tracking-[0.3em] uppercase">Fine Dining • Pune</p>
                                            </div>

                                            {/* Menu Items with stagger animation */}
                                            <div className="space-y-3">
                                                {[
                                                    { name: "Truffle Fries", price: "₹350", tags: ["🔥 Best Seller"], delay: "0.1s" },
                                                    { name: "Wagyu Sliders", price: "₹890", tags: ["👨‍🍳 Chef Special"], delay: "0.2s" },
                                                    { name: "Lobster Roll", price: "₹1,250", tags: ["✨ Premium"], delay: "0.3s" }
                                                ].map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-slide-up"
                                                        style={{ animationDelay: item.delay }}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="font-bold text-sm text-white">{item.name}</span>
                                                                <div className="flex gap-1 mt-1">
                                                                    {item.tags.map((tag, j) => (
                                                                        <span key={j} className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-amber-400 font-bold text-sm">{item.price}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bottom Nav */}
                                            <div className="absolute bottom-4 left-4 right-4 p-2 rounded-xl bg-white/5 backdrop-blur-sm flex justify-around">
                                                {['Snacks', 'Mains', 'Drinks', 'Sides'].map((tab, i) => (
                                                    <span key={i} className={`text-[10px] font-medium px-3 py-1 rounded-lg transition-all active:scale-95 ${i === 0 ? 'bg-violet-500/20 text-violet-400' : 'text-gray-500'}`}>
                                                        {tab}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements with better mobile positioning */}
                                <div className="absolute -left-6 sm:-left-12 top-20 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm animate-float shadow-lg">
                                    <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
                                </div>
                                <div className="absolute -right-4 sm:-right-8 top-40 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm animate-float shadow-lg" style={{ animationDelay: '0.5s' }}>
                                    <QrCode className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
                                </div>
                                <div className="absolute -left-3 sm:-left-6 bottom-32 p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm animate-float shadow-lg" style={{ animationDelay: '1s' }}>
                                    <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar - Touch friendly cards on mobile */}
                    <div className="mt-16 sm:mt-20 lg:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.05] border border-white/5 backdrop-blur-sm hover:border-violet-500/20 transition-all active:scale-95 touch-manipulation group"
                            >
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                    <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - Card swipe on mobile */}
            <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span className="text-sm font-semibold text-violet-400">Powerful Features</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
                            Everything You Need to
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                                Dominate Digital Dining
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                            From QR codes to analytics, we've got every tool to make your menu stand out.
                        </p>
                    </div>

                    {/* Feature cards - Optimized for touch */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 active:scale-95 touch-manipulation"
                            >
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg touch-manipulation`}>
                                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-amber-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Swipeable on mobile */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4">
                            Loved by <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Restaurant Owners</span>
                        </h2>
                        <p className="text-gray-400">See what our customers have to say</p>
                        <p className="text-xs sm:text-sm text-violet-400 mt-2 lg:hidden">👈 Swipe to see more 👉</p>
                    </div>

                    <div
                        className="relative"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 touch-manipulation">
                            <div className="flex justify-center mb-4 sm:mb-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <blockquote className="text-lg sm:text-xl lg:text-2xl text-center font-medium text-gray-200 mb-6 sm:mb-8 leading-relaxed px-2">
                                "{testimonials[activeTestimonial].quote}"
                            </blockquote>
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center font-bold text-sm sm:text-base">
                                    {testimonials[activeTestimonial].avatar}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-sm sm:text-base">{testimonials[activeTestimonial].author}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">{testimonials[activeTestimonial].role}</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Dots - Touch friendly */}
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`h-2 rounded-full transition-all touch-manipulation active:scale-95 ${idx === activeTestimonial ? 'w-8 bg-violet-400' : 'w-2 bg-white/20'}`}
                                    aria-label={`Testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section - Optimized for mobile scrolling */}
            <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-6">
                            <span className="text-sm font-semibold text-amber-400">Simple Pricing</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
                            Choose Your <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Plan</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-400">Start free, upgrade when you're ready</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative p-6 sm:p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 active:scale-98 touch-manipulation ${plan.popular
                                    ? 'bg-gradient-to-b from-violet-500/10 to-fuchsia-500/10 border-violet-500/30 shadow-xl shadow-violet-500/10'
                                    : 'bg-gradient-to-b from-white/[0.02] to-transparent border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 text-xs font-bold whitespace-nowrap">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                            <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => navigate('/auth')}
                                    className={`w-full py-3 sm:py-4 rounded-xl font-bold transition-all touch-manipulation active:scale-95 ${plan.popular
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/25'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - Large touch targets */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-8 sm:p-12 lg:p-16 rounded-[32px] sm:rounded-[40px] overflow-hidden">
                        {/* Enhanced Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/15 to-amber-500/20 animate-pulse" />
                        <div className="absolute inset-0 bg-[#09090b]/50" />
                        <div className="absolute inset-0 border border-violet-500/20 rounded-[32px] sm:rounded-[40px]" />

                        <div className="relative text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
                                Ready to Go <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Digital</span>?
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto px-4">
                                Join 500+ restaurants that trust MenuX for their digital menus. Start your free trial today.
                            </p>
                            <button
                                onClick={() => navigate('/auth')}
                                className="px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 font-bold text-lg sm:text-xl transition-all shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95 touch-manipulation"
                            >
                                Start Your Free Trial →
                            </button>
                            <p className="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer - Touch friendly links */}
            <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
                                <span className="font-bold text-sm">M</span>
                            </div>
                            <span className="font-bold text-lg">MenuX Prime</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors touch-manipulation active:scale-95">Features</button>
                            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors touch-manipulation active:scale-95">Pricing</button>
                            <button onClick={() => navigate('/menus')} className="hover:text-white transition-colors touch-manipulation active:scale-95">Demo</button>
                        </div>
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            © {new Date().getFullYear()} MenuX Prime. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out forwards;
                    opacity: 0;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
                .active\\:scale-95:active {
                    transform: scale(0.95);
                }
                .active\\:scale-98:active {
                    transform: scale(0.98);
                }
                .touch-manipulation {
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
