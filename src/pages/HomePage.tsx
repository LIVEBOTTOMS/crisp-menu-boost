import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Zap,
    Smartphone,
    Menu as MenuIcon,
    X,
    ChevronRight,
    Star,
    ArrowRight,
    Globe,
    TrendingUp,
    Sparkles,
    Shield,
    Clock,
    QrCode,
    Palette,
    BarChart3,
    Play,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Real-Time Sync",
            description: "Update prices, add items, change descriptions—everything syncs instantly across all devices.",
            gradient: "from-amber-400 to-orange-500"
        },
        {
            icon: QrCode,
            title: "Smart QR Codes",
            description: "Generate beautiful, branded QR codes that customers can scan to view your menu instantly.",
            gradient: "from-violet-400 to-purple-600"
        },
        {
            icon: Palette,
            title: "Premium Themes",
            description: "Choose from stunning themes like Cyberpunk, Elegant Classic, and Vibrant Playful.",
            gradient: "from-fuchsia-400 to-pink-600"
        },
        {
            icon: Globe,
            title: "Multi-Venue",
            description: "Manage unlimited restaurant locations from a single dashboard. Each venue, its own menu.",
            gradient: "from-emerald-400 to-teal-600"
        },
        {
            icon: BarChart3,
            title: "Analytics",
            description: "Track menu views, popular items, peak hours, and customer engagement in real-time.",
            gradient: "from-blue-400 to-violet-600"
        },
        {
            icon: Shield,
            title: "Enterprise Ready",
            description: "Bank-grade security, 99.9% uptime, and dedicated support for your business.",
            gradient: "from-rose-400 to-red-600"
        }
    ];

    const testimonials = [
        {
            quote: "MenuX transformed how we handle our menu. Updates take seconds, not hours. Our customers love the sleek digital experience.",
            author: "Rahul Sharma",
            role: "Owner, The Grand Kitchen",
            avatar: "RS"
        },
        {
            quote: "The QR code feature alone saved us thousands in printing costs. Plus, the cyberpunk theme matches our bar's vibe perfectly!",
            author: "Priya Patel",
            role: "Manager, Neon Nights Lounge",
            avatar: "PP"
        },
        {
            quote: "Managing 5 restaurant locations was a nightmare. Now it's a breeze. One dashboard, all venues, real-time sync.",
            author: "Vikram Mehta",
            role: "CEO, FoodChain Group",
            avatar: "VM"
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
            {/* Animated Background - Premium Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,90,220,0.15),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(120,90,220,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,90,220,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[200px]" />
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 animate-pulse opacity-75 blur-sm" />
                                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
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
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
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
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-6 space-y-3">
                        <button onClick={() => { navigate('/menus'); setMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
                            Explore Menus
                        </button>
                        {user ? (
                            <button onClick={() => { navigate('/menus'); setMobileMenuOpen(false); }}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors font-medium">
                                    Sign In
                                </button>
                                <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">
                                    Get Started Free
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left - Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-8 animate-fade-in">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                                    #1 Digital Menu Platform in India
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-6">
                                <span className="text-white">Beautiful Menus</span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                                    That Convert
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                Create stunning digital menus in minutes. Real-time updates, QR codes, analytics & more.
                                <span className="text-amber-400 font-medium"> Trusted by 500+ restaurants.</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 font-bold text-lg transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <span>Start Free Trial</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/menus')}
                                    className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-lg transition-all flex items-center justify-center gap-3"
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Watch Demo</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                                <div className="flex -space-x-3">
                                    {['RS', 'PP', 'VM', 'AK'].map((initials, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 border-2 border-[#09090b] flex items-center justify-center text-xs font-bold">
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400">Loved by 500+ restaurants</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Phone Mockup */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative">
                                {/* Glow Effects */}
                                <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/30 to-amber-500/20 rounded-full blur-3xl opacity-50" />

                                {/* Phone Frame */}
                                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[40px] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl shadow-black/50">
                                    <div className="w-full h-full rounded-[32px] bg-[#0a0a0f] overflow-hidden relative">
                                        {/* Phone Notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />

                                        {/* Menu Preview */}
                                        <div className="w-full h-full p-4 pt-10 overflow-hidden">
                                            {/* Header */}
                                            <div className="text-center mb-6">
                                                <h3 className="font-black text-2xl bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">LIVE</h3>
                                                <p className="text-[10px] text-violet-400 tracking-[0.3em] uppercase">Fine Dining • Pune</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="space-y-3">
                                                {[
                                                    { name: "Truffle Fries", price: "₹350", tags: ["🔥 Best Seller"] },
                                                    { name: "Wagyu Sliders", price: "₹890", tags: ["👨‍🍳 Chef Special"] },
                                                    { name: "Lobster Roll", price: "₹1,250", tags: ["✨ Premium"] }
                                                ].map((item, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
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
                                                    <span key={i} className={`text-[10px] font-medium px-3 py-1 rounded-lg ${i === 0 ? 'bg-violet-500/20 text-violet-400' : 'text-gray-500'}`}>
                                                        {tab}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -left-12 top-20 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm animate-float">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="absolute -right-8 top-40 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}>
                                    <QrCode className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="absolute -left-6 bottom-32 p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-20 sm:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.02] to-white/[0.05] border border-white/5 backdrop-blur-sm">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-16 sm:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-semibold text-violet-400">Powerful Features</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
                            Everything You Need to
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                                Dominate Digital Dining
                            </span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            From QR codes to analytics, we've got every tool to make your menu stand out.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">
                            Loved by <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Restaurant Owners</span>
                        </h2>
                        <p className="text-gray-400">See what our customers have to say</p>
                    </div>

                    <div className="relative">
                        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5">
                            <div className="flex justify-center mb-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <blockquote className="text-xl sm:text-2xl text-center font-medium text-gray-200 mb-8 leading-relaxed">
                                "{testimonials[activeTestimonial].quote}"
                            </blockquote>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center font-bold">
                                    {testimonials[activeTestimonial].avatar}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">{testimonials[activeTestimonial].author}</div>
                                    <div className="text-sm text-gray-400">{testimonials[activeTestimonial].role}</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeTestimonial ? 'w-8 bg-violet-400' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 mb-6">
                            <span className="text-sm font-semibold text-amber-400">Simple Pricing</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
                            Choose Your <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Plan</span>
                        </h2>
                        <p className="text-lg text-gray-400">Start free, upgrade when you're ready</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${plan.popular
                                    ? 'bg-gradient-to-b from-violet-500/10 to-fuchsia-500/10 border-violet-500/30 shadow-xl shadow-violet-500/10'
                                    : 'bg-gradient-to-b from-white/[0.02] to-transparent border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 text-xs font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black">{plan.price}</span>
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
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular
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

            {/* Final CTA */}
            <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-12 sm:p-16 rounded-[40px] overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/15 to-amber-500/20" />
                        <div className="absolute inset-0 bg-[#09090b]/50" />
                        <div className="absolute inset-0 border border-violet-500/20 rounded-[40px]" />

                        <div className="relative text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
                                Ready to Go <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Digital</span>?
                            </h2>
                            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                                Join 500+ restaurants that trust MenuX for their digital menus. Start your free trial today.
                            </p>
                            <button
                                onClick={() => navigate('/auth')}
                                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 font-bold text-xl transition-all shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                            >
                                Start Your Free Trial →
                            </button>
                            <p className="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
                                <span className="font-bold text-sm">M</span>
                            </div>
                            <span className="font-bold text-lg">MenuX Prime</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Features</button>
                            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Pricing</button>
                            <button onClick={() => navigate('/menus')} className="hover:text-white transition-colors">Demo</button>
                        </div>
                        <p className="text-sm text-gray-600">
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
            `}</style>
        </div>
    );
};

export default HomePage;
