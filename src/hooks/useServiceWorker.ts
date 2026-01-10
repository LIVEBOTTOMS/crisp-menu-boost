import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ServiceWorkerState {
    isSupported: boolean;
    isRegistered: boolean;
    isUpdateAvailable: boolean;
    registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
    const [state, setState] = useState<ServiceWorkerState>({
        isSupported: 'serviceWorker' in navigator,
        isRegistered: false,
        isUpdateAvailable: false,
        registration: null,
    });

    useEffect(() => {
        if (!state.isSupported) {
            console.log('[SW] Service Workers not supported');
            return;
        }

        registerServiceWorker();
    }, [state.isSupported]);

    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('[SW] Registration successful:', registration);

            setState(prev => ({
                ...prev,
                isRegistered: true,
                registration,
            }));

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;

                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is ready
                            setState(prev => ({ ...prev, isUpdateAvailable: true }));

                            toast.info('New version available!', {
                                description: 'Click to update',
                                action: {
                                    label: 'Update',
                                    onClick: () => {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                        window.location.reload();
                                    },
                                },
                                duration: Infinity,
                            });
                        }
                    });
                }
            });

            // Handle controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[SW] Controller changed, reloading...');
                window.location.reload();
            });

        } catch (error) {
            console.error('[SW] Registration failed:', error);
            toast.error('Failed to enable offline mode');
        }
    };

    const updateServiceWorker = () => {
        if (state.registration) {
            state.registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }
    };

    const unregisterServiceWorker = async () => {
        if (state.registration) {
            const success = await state.registration.unregister();

            if (success) {
                setState(prev => ({
                    ...prev,
                    isRegistered: false,
                    registration: null,
                }));
                toast.success('Offline mode disabled');
            }
        }
    };

    const clearCache = async () => {
        if (state.registration?.active) {
            state.registration.active.postMessage({ type: 'CLEAR_CACHE' });
            toast.success('Cache cleared');
        }
    };

    return {
        ...state,
        updateServiceWorker,
        unregisterServiceWorker,
        clearCache,
    };
};
