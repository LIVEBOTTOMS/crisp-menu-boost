import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 30 seconds if not dismissed
            setTimeout(() => {
                const dismissed = localStorage.getItem('pwa-install-dismissed');
                if (!dismissed) {
                    setShowPrompt(true);
                }
            }, 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            setIsInstalled(true);
            setShowPrompt(false);
            localStorage.removeItem('pwa-install-dismissed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        console.log(`[PWA] User ${outcome} the install prompt`);

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');

        // Show again after 7 days
        setTimeout(() => {
            localStorage.removeItem('pwa-install-dismissed');
        }, 7 * 24 * 60 * 60 * 1000);
    };

    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-slide-up">
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-amber-500/10 border border-violet-500/30 backdrop-blur-xl shadow-2xl shadow-violet-500/20">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Content */}
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">M</span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white mb-1">Install MenuX App</h3>
                        <p className="text-sm text-gray-300 mb-3">
                            Get instant access, work offline, and enjoy a native app experience
                        </p>

                        {/* Features */}
                        <div className="space-y-1 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <span>Works offline</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span>Real-time updates</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                                <span>Fast & native feel</span>
                            </div>
                        </div>

                        {/* Install button */}
                        <button
                            onClick={handleInstall}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-[1.02]"
                        >
                            <Download className="w-4 h-4" />
                            Install Now
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
