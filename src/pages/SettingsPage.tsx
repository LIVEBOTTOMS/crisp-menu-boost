import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Settings as SettingsIcon, Palette, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NotificationSettings } from '@/components/NotificationSettings';
import { ThemeSelector } from '@/components/ThemeSelector';
import { BackgroundEffects } from '@/components/BackgroundEffects';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('notifications');

    return (
        <div className="min-h-screen bg-background relative">
            <BackgroundEffects />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="border-border/30"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div>
                        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                            <SettingsIcon className="w-8 h-8 text-violet-400" />
                            Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your preferences and notifications
                        </p>
                    </div>
                </div>

                {/* Settings Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger value="account" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Account</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4">
                        <NotificationSettings />

                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Customize what notifications you want to receive
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Menu Updates</p>
                                        <p className="text-sm text-muted-foreground">Get notified when menus are updated</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600" />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">New Items</p>
                                        <p className="text-sm text-muted-foreground">Alerts for new menu items</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600" />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Promotions</p>
                                        <p className="text-sm text-muted-foreground">Special offers and discounts</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600" />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Order Updates</p>
                                        <p className="text-sm text-muted-foreground">Status updates for your orders (coming soon)</p>
                                    </div>
                                    <input type="checkbox" disabled className="w-5 h-5 accent-violet-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Selection</CardTitle>
                                <CardDescription>
                                    Choose the theme for your menu
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ThemeSelector />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Display Preferences</CardTitle>
                                <CardDescription>
                                    Customize how your content is displayed
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Dark Mode</p>
                                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600" />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Animations</p>
                                        <p className="text-sm text-muted-foreground">Enable smooth animations</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Manage your account details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Account management features coming soon!
                                </p>
                                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                    <p className="text-sm">
                                        💡 <strong>Coming Soon:</strong> Profile editing, password change, and more
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SettingsPage;
