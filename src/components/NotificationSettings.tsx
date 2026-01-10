import { Bell, BellOff, Send } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const NotificationSettings = () => {
    const {
        isSupported,
        isPermissionGranted,
        isSubscribed,
        isLoading,
        requestPermission,
        subscribe,
        unsubscribe,
        sendTestNotification,
    } = usePushNotifications();

    if (!isSupported) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellOff className="w-5 h-5" />
                        Notifications Not Supported
                    </CardTitle>
                    <CardDescription>
                        Your browser doesn't support push notifications. Please use a modern browser like Chrome, Edge, or Firefox.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Push Notifications
                </CardTitle>
                <CardDescription>
                    Get notified about menu updates, new items, and special offers
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`} />
                        <div>
                            <p className="font-medium">
                                {isSubscribed ? 'Notifications Enabled' : 'Notifications Disabled'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {isSubscribed
                                    ? 'You will receive push notifications'
                                    : 'Enable to receive updates'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Permission Status */}
                {!isPermissionGranted && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            💡 Browser permission required to enable notifications
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                    {!isPermissionGranted && (
                        <Button
                            onClick={requestPermission}
                            disabled={isLoading}
                            className="w-full"
                            variant="default"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Request Permission
                        </Button>
                    )}

                    {isPermissionGranted && !isSubscribed && (
                        <Button
                            onClick={subscribe}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            {isLoading ? 'Enabling...' : 'Enable Notifications'}
                        </Button>
                    )}

                    {isSubscribed && (
                        <>
                            <Button
                                onClick={unsubscribe}
                                disabled={isLoading}
                                className="w-full"
                                variant="outline"
                            >
                                <BellOff className="w-4 h-4 mr-2" />
                                {isLoading ? 'Disabling...' : 'Disable Notifications'}
                            </Button>

                            <Button
                                onClick={() => sendTestNotification('Test Notification', 'This is a test from MenuX!')}
                                disabled={isLoading}
                                className="w-full"
                                variant="secondary"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Test Notification
                            </Button>
                        </>
                    )}
                </div>

                {/* Features List */}
                <div className="pt-4 border-t space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">What you'll receive:</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-0.5">✓</span>
                            <span>Menu update alerts</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-0.5">✓</span>
                            <span>New item announcements</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-0.5">✓</span>
                            <span>Special offers & promotions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-0.5">✓</span>
                            <span>Order status updates (coming soon)</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
