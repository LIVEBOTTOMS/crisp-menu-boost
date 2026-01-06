import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const loginForm = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const signupForm = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const handleLogin = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            toast({
                title: "Welcome back!",
                description: "You've successfully logged in.",
            });

            navigate('/menus');
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message || "Invalid email or password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (data: SignupForm) => {
        setIsLoading(true);
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    },
                },
            });

            if (error) throw error;

            toast({
                title: "Account created!",
                description: "Please check your email to verify your account.",
            });

            // Auto-switch to login after signup
            setMode('login');
            loginForm.setValue('email', data.email);
        } catch (error: any) {
            toast({
                title: "Signup failed",
                description: error.message || "Could not create account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="font-black text-2xl text-white">X</span>
                        </div>
                        <span className="font-black text-3xl tracking-tight">
                            MENU<span className="text-cyan-400">X</span>
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        {mode === 'login' ? 'Welcome back to MenuX Prime' : 'Start your premium menu journey'}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-scale-in">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-lg">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'login'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            style={mode === 'login' ? { color: '#ffffff' } : undefined}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === 'signup'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            style={mode === 'signup' ? { color: '#ffffff' } : undefined}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Login Form */}
                    {mode === 'login' && (
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...loginForm.register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {loginForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...loginForm.register('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {loginForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <AnimatedButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                                <ArrowRight className="w-5 h-5" />
                            </AnimatedButton>
                        </form>
                    )}

                    {/* Signup Form */}
                    {mode === 'signup' && (
                        <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...signupForm.register('name')}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {signupForm.formState.errors.name && (
                                    <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...signupForm.register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {signupForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...signupForm.register('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {signupForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        {...signupForm.register('confirmPassword')}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-500"
                                    />
                                </div>
                                {signupForm.formState.errors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <AnimatedButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                                <Sparkles className="w-5 h-5" />
                            </AnimatedButton>

                            <p className="text-xs text-gray-400 text-center">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </form>
                    )}
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
