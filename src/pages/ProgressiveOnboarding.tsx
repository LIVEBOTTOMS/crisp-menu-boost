import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    CheckCircle2, ChevronRight, ChevronLeft, Sparkles,
    Store, MapPin, Palette, UtensilsCrossed, Rocket,
    Building2
} from 'lucide-react';
import { useGuestMode } from '@/contexts/GuestModeContext';
import {
    detectLocation,
    industryTemplates,
    suggestIndustry,
    generateSlug,
    getGreeting,
    type OnboardingStep
} from '@/lib/smartDefaults';
import { toast } from 'sonner';

const ProgressiveOnboarding = () => {
    const navigate = useNavigate();
    const { guestData, updateGuestData, isGuestMode } = useGuestMode();

    const [currentStep, setCurrentStep] = useState(0);
    const [venueName, setVenueName] = useState(guestData.venueName || '');
    const [industry, setIndustry] = useState('cafe');
    const [location, setLocation] = useState(guestData.location || '');
    const [theme, setTheme] = useState(guestData.preferences?.theme || 'cyberpunk-tech');
    const [detectedLocation, setDetectedLocation] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const steps: OnboardingStep[] = [
        {
            id: 'venue-name',
            title: 'Name your venue',
            description: 'What should we call your restaurant?',
            optional: false,
            completed: !!venueName,
        },
        {
            id: 'industry',
            title: 'Choose your category',
            description: 'Help us suggest the right menu structure',
            optional: false,
            completed: !!industry,
        },
        {
            id: 'location',
            title: 'Add location',
            description: 'Where is your venue located? (Optional)',
            optional: true,
            completed: !!location,
        },
        {
            id: 'theme',
            title: 'Pick a theme',
            description: 'Choose a visual style for your menu',
            optional: true,
            completed: !!theme,
        },
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;

    // Detect location on mount
    useEffect(() => {
        detectLocation().then(data => {
            const loc = data.city && data.country ? `${data.city}, ${data.country}` : data.country || '';
            setDetectedLocation(loc);
            if (!location && loc) {
                setLocation(loc);
            }
        });
    }, []);

    // Auto-suggest industry when venue name changes
    useEffect(() => {
        if (venueName && currentStep === 0) {
            const suggested = suggestIndustry(venueName);
            setIndustry(suggested.category);
        }
    }, [venueName]);

    const handleNext = () => {
        // Validate current step
        if (currentStep === 0 && !venueName.trim()) {
            toast.error('Please enter a venue name');
            return;
        }

        if (currentStep === 1 && !industry) {
            toast.error('Please select a category');
            return;
        }

        // Save progress
        updateGuestData({
            venueName: venueName.trim(),
            industry,
            location: location.trim(),
            preferences: {
                ...guestData.preferences,
                theme,
            },
        });

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step - create menu
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setLoading(true);

        // Save all data
        const template = industryTemplates[industry] || industryTemplates['cafe'];

        updateGuestData({
            venueName: venueName.trim(),
            industry,
            location: location.trim(),
            menuItems: template.sampleItems,
            preferences: {
                theme,
                language: 'en',
            },
        });

        toast.success('🎉 Your menu is ready!', {
            description: 'You can now start editing your menu items'
        });

        setTimeout(() => {
            navigate('/menus');
        }, 1000);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Venue Name
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mb-4">
                                <Store className="w-8 h-8 text-violet-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{getGreeting()}! 👋</h2>
                            <p className="text-gray-400">Let's create your digital menu in minutes</p>
                        </div>

                        <div>
                            <Label htmlFor="venue-name" className="text-lg font-semibold mb-2">
                                What's your venue called?
                            </Label>
                            <Input
                                id="venue-name"
                                type="text"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                                placeholder="e.g., The Coffee House, Mumbai Spice, etc."
                                className="mt-2 h-14 text-lg bg-white/5 border-white/10"
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                💡 Tip: We'll use this to suggest the best menu structure for you
                            </p>
                        </div>
                    </div>
                );

            case 1: // Industry
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fuchsia-500/20 mb-4">
                                <Building2 className="w-8 h-8 text-fuchsia-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">What type of venue?</h2>
                            <p className="text-gray-400">This helps us suggest the right menu categories</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(industryTemplates).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => setIndustry(key)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${industry === key
                                            ? 'border-violet-500 bg-violet-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="font-semibold mb-1">{template.name}</div>
                                    <div className="text-xs text-gray-400">
                                        {template.suggestedCategories.slice(0, 3).join(', ')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2: // Location
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
                                <MapPin className="w-8 h-8 text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Where are you located?</h2>
                            <p className="text-gray-400">Optional - helps with local SEO and currency</p>
                        </div>

                        <div>
                            <Label htmlFor="location" className="text-lg font-semibold mb-2">
                                City or Address
                            </Label>
                            <Input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={detectedLocation || "e.g., Mumbai, India"}
                                className="mt-2 h-14 text-lg bg-white/5 border-white/10"
                            />
                            {detectedLocation && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setLocation(detectedLocation)}
                                    className="mt-2 text-violet-400 hover:text-violet-300"
                                >
                                    Use detected: {detectedLocation}
                                </Button>
                            )}
                        </div>
                    </div>
                );

            case 3: // Theme
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 mb-4">
                                <Palette className="w-8 h-8 text-rose-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Choose your style</h2>
                            <p className="text-gray-400">Pick a theme that matches your venue's vibe</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'cyberpunk-tech', name: 'Cyberpunk Tech', desc: 'Futuristic neon aesthetic', gradient: 'from-violet-500 to-fuchsia-500' },
                                { id: 'elegant-classic', name: 'Elegant Classic', desc: 'Timeless sophistication', gradient: 'from-amber-600 to-orange-600' },
                                { id: 'vibrant-playful', name: 'Vibrant Playful', desc: 'Fun and energetic', gradient: 'from-pink-500 to-rose-500' },
                                { id: 'minimal-modern', name: 'Minimal Modern', desc: 'Clean and simple', gradient: 'from-slate-500 to-gray-500' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${theme === t.id
                                            ? 'border-violet-500 bg-violet-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${t.gradient}`} />
                                    <div>
                                        <div className="font-semibold">{t.name}</div>
                                        <div className="text-xs text-gray-400">{t.desc}</div>
                                    </div>
                                    {theme === t.id && <CheckCircle2 className="w-5 h-5 text-violet-400 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,90,220,0.15),transparent)]" />
                <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px] animate-pulse" />
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <span className="text-sm text-violet-400 font-medium">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Card */}
                <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    {/* Step Content */}
                    {renderStepContent()}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0 || loading}
                            className="text-gray-400 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back
                        </Button>

                        <div className="flex items-center gap-2">
                            {steps[currentStep].optional && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Skip
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={loading}
                                className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-amber-600"
                            >
                                {loading ? (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : currentStep === steps.length - 1 ? (
                                    <>
                                        <Rocket className="w-5 h-5 mr-2" />
                                        Create My Menu
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="w-5 h-5 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Guest Mode Indicator */}
                {isGuestMode && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            🎭 Guest Mode - Your progress is saved locally
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressiveOnboarding;
