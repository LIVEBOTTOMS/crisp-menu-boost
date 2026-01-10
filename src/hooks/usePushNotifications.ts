import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

interface UsePushNotificationsReturn {
    isSupported: boolean;
    isPermissionGranted: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    requestPermission: () => Promise<boolean>;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
    sendTestNotification: (title: string, body: string) => Promise<void>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
    const [isSupported] = useState(() => 'Notification' in window && 'serviceWorker' in navigator);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isSupported) {
            setIsPermissionGranted(Notification.permission === 'granted');
            checkSubscription();
        }
    }, [isSupported]);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('[Push] Error checking subscription:', error);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        if (!isSupported) {
            toast.error('Push notifications not supported in this browser');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            const granted = permission === 'granted';

            setIsPermissionGranted(granted);

            if (granted) {
                toast.success('Notifications enabled!');
            } else {
                toast.error('Notification permission denied');
            }

            return granted;
        } catch (error) {
            console.error('[Push] Error requesting permission:', error);
            toast.error('Failed to request notification permission');
            return false;
        }
    };

    const subscribe = async (): Promise<boolean> => {
        if (!isSupported || !isPermissionGranted) {
            toast.error('Please enable notifications first');
            return false;
        }

        setIsLoading(true);

        try {
            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                // Subscribe to push notifications
                // NOTE: You'll need to generate VAPID keys for production
                // Use: npx web-push generate-vapid-keys
                const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY ||
                    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'; // Demo key - replace in production

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });
            }

            // Save subscription to database
            const { user } = await supabase.auth.getUser();

            if (!user.data.user) {
                toast.error('Please log in to enable notifications');
                return false;
            }

            const subscriptionData: PushSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
                    auth: arrayBufferToBase64(subscription.getKey('auth')!),
                },
            };

            const { error } = await supabase
                .from('push_subscriptions')
                .upsert({
                    user_id: user.data.user.id,
                    endpoint: subscriptionData.endpoint,
                    keys: subscriptionData.keys,
                    user_agent: navigator.userAgent,
                    device_type: getDeviceType(),
                    is_active: true,
                    last_used_at: new Date().toISOString(),
                }, {
                    onConflict: 'endpoint'
                });

            if (error) throw error;

            setIsSubscribed(true);
            toast.success('Push notifications enabled!');
            return true;

        } catch (error) {
            console.error('[Push] Error subscribing:', error);
            toast.error('Failed to enable push notifications');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async (): Promise<boolean> => {
        setIsLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                // Mark as inactive in database
                const { error } = await supabase
                    .from('push_subscriptions')
                    .update({ is_active: false })
                    .eq('endpoint', subscription.endpoint);

                if (error) throw error;
            }

            setIsSubscribed(false);
            toast.success('Push notifications disabled');
            return true;

        } catch (error) {
            console.error('[Push] Error unsubscribing:', error);
            toast.error('Failed to disable push notifications');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const sendTestNotification = async (title: string, body: string) => {
        if (!isSubscribed) {
            toast.error('Please enable notifications first');
            return;
        }

        try {
            // This would normally be done server-side
            // For testing, we'll create a local notification
            const registration = await navigator.serviceWorker.ready;

            await registration.showNotification(title, {
                body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 'test-notification'
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View',
                    },
                    {
                        action: 'close',
                        title: 'Close',
                    }
                ]
            });

            toast.success('Test notification sent!');
        } catch (error) {
            console.error('[Push] Error sending test notification:', error);
            toast.error('Failed to send test notification');
        }
    };

    return {
        isSupported,
        isPermissionGranted,
        isSubscribed,
        isLoading,
        requestPermission,
        subscribe,
        unsubscribe,
        sendTestNotification,
    };
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}
