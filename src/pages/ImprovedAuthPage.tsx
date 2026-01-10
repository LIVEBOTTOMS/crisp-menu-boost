import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from '@/lib/validation';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { toast } from 'sonner';

const ImprovedAuthPage = () => {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState('');

    // Password strength indicator
    const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
        if (pwd.length === 0) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

        if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = isSignUp ? getPasswordStrength(password) : null;

    const validateForm = (): boolean => {
        setErrors({});

        try {
            if (isSignUp) {
                signupSchema.parse({ email, password, confirmPassword });
            } else {
                loginSchema.parse({ email, password });
            }
            return true;
        } catch (error: any) {
            const fieldErrors: Record<string, string> = {};
            error.errors?.forEach((err: any) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setErrors(fieldErrors);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        setSuccess('');

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password);

                if (error) {
                    if (error.message.includes('already registered')) {
                        setErrors({ email: 'This email is already registered' });
                        toast.error('Email already registered. Please sign in instead.');
                    } else {
                        toast.error(error.message || 'Failed to create account');
                    }
                } else {
                    setSuccess('Account created! Please check your email to verify your account.');
                    toast.success('🎉 Welcome to MenuX!', {
                        description: 'Check your email to verify your account'
                    });

                    // Clear form
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');

                    // Switch to login after 3 seconds
                    setTimeout(() => {
                        setIsSignUp(false);
                        setSuccess('');
                    }, 3000);
                }
            } else {
                const { error } = await signIn(email, password);

                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        setErrors({ password: 'Invalid email or password' });
                        toast.error('Invalid credentials. Please try again.');
                    } else if (error.message.includes('Email not confirmed')) {
                        toast.error('Please verify your email before logging in', {
                            description: 'Check your inbox for the verification link'
                        });
                    } else {
                        toast.error(error.message || 'Failed to sign in');
                    }
                } else {
                    toast.success('Welcome back! 👋');
                    navigate('/menus');
                }
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
            <BackgroundEffects />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to home</span>
                    </button>

                    {/* Auth Card */}
                    <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-amber-500 mb-4 shadow-lg">
                                <span className="text-2xl font-black">M</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mb-2">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {isSignUp
                                    ? 'Start creating beautiful menus in minutes'
                                    : 'Sign in to manage your menus'
                                }
                            </p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <Alert className="mb-6 bg-green-500/10 border-green-500/30">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <AlertDescription className="text-green-300 ml-2">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <div className="relative mt-1.5">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className={`pl-10 bg-white/5 border-white/10 focus:border-violet-500/50 ${errors.email ? 'border-red-500/50' : ''
                                            }`}
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative mt-1.5">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={isSignUp ? 'Min. 8 characters' : '••••••••'}
                                        className={`pl-10 pr-10 bg-white/5 border-white/10 focus:border-violet-500/50 ${errors.password ? 'border-red-500/50' : ''
                                            }`}
                                        disabled={loading}
                                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password}
                                    </p>
                                )}

                                {/* Password Strength Indicator */}
                                {isSignUp && password && passwordStrength && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-400">Password Strength</span>
                                            <span className="text-xs font-medium text-gray-300">{passwordStrength.label}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password (Sign Up only) */}
                            {isSignUp && (
                                <div>
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter password"
                                            className={`pl-10 pr-10 bg-white/5 border-white/10 focus:border-violet-500/50 ${errors.confirmPassword ? 'border-red-500/50' : ''
                                                }`}
                                            disabled={loading}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-amber-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                    </>
                                ) : (
                                    <>
                                        {isSignUp ? (
                                            <>
                                                <Sparkles className="w-5 h-5 mr-2" />
                                                Create Account
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-gray-500">OR</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Toggle Sign Up / Sign In */}
                        <div className="text-center">
                            <p className="text-sm text-gray-400">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                {' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setErrors({});
                                        setSuccess('');
                                        setPassword('');
                                        setConfirmPassword('');
                                    }}
                                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                                    disabled={loading}
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up Free'}
                                </button>
                            </p>
                        </div>

                        {/* Benefits (Sign Up only) */}
                        {isSignUp && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 mb-3">What you'll get:</p>
                                <ul className="space-y-2 text-xs text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                        <span>Instant access to your first menu with sample items</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                        <span>Premium themes and customization options</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                        <span>QR codes, analytics, and real-time updates</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-violet-400 hover:text-violet-300">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImprovedAuthPage;
