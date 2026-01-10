import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useMenu } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogOut, Menu, Users, Settings, ShieldCheck, ShieldX, Home, Percent, Download, Edit, QrCode, Archive, RotateCcw, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PrintPreview } from '@/components/PrintPreview';
import { SwiggyZomatoManager } from '@/components/SwiggyZomatoManager';
import { QRCodeCustomizer } from '@/components/QRCodeCustomizer';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { ArchivedMenus } from '@/components/ArchivedMenus';
import { LeadManagement } from '@/components/LeadManagement';
import { ThemeSelector } from '@/components/ThemeSelector';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { supabase } from '@/integrations/supabase/client';
import { getVenueConfig } from '@/config/venueConfig';
import { MenuTheme, menuThemes } from '@/config/menuThemes';

interface VenueData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  subtitle: string | null;
  logo_text: string | null;
  logo_subtext: string | null;
  logo_image_url: string | null;
  theme?: string;
}

const AdminDashboard = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { canAccess, isPremium, isPremiumPlus, plan } = useSubscription();
  const { menuData, venueData, setIsEditMode, isEditMode, adjustPrices, resetDatabase, setActiveVenueSlug, refreshMenu } = useMenu();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoadingVenue, setIsLoadingVenue] = useState(false);
  const defaultVenue = getVenueConfig();

  const [pricePercent, setPricePercent] = useState("");
  const [priceScope, setPriceScope] = useState("all");
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isQRCodeCustomizerOpen, setIsQRCodeCustomizerOpen] = useState(false);
  const [isSwiggyManagerOpen, setIsSwiggyManagerOpen] = useState(false);
  const [isArchivedMenusOpen, setIsArchivedMenusOpen] = useState(false);
  const [isLeadManagementOpen, setIsLeadManagementOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showPDFPrompt, setShowPDFPrompt] = useState(false);

  // Load venue data if slug is provided
  useEffect(() => {
    setActiveVenueSlug(slug || 'live');
  }, [slug, setActiveVenueSlug]);

  // Use venue data if available, otherwise use default
  const currentVenue = venueData || {
    name: defaultVenue.name,
    subtitle: defaultVenue.subtitle,
    logo_text: defaultVenue.logoText,
    logo_subtext: defaultVenue.logoSubtext,
    logo_image_url: null,
    tagline: null,
    theme: 'cyberpunk-tech',
    id: 'default',
  };

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
    navigate('/');
  };

  const handleResetDatabase = async () => {
    const success = await resetDatabase();
    if (success) {
      toast({
        title: 'Database Reset',
        description: 'Menu has been reset to default values.',
      });
      setIsResetDialogOpen(false);
    } else {
      toast({
        title: 'Reset Failed',
        description: 'Failed to reset database. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  const toggleEditMode = () => {
    if (!isAdmin) {
      toast({
        title: 'Access denied',
        description: 'You need admin privileges to edit the menu.',
        variant: 'destructive',
      });
      return;
    }

    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);

    toast({
      title: newEditMode ? 'Edit mode enabled' : 'Edit mode disabled',
      description: newEditMode
        ? 'You can now edit menu items.'
        : 'You can no longer make changes to the menu.',
    });

    // Navigate to menu page when enabling edit mode
    if (newEditMode) {
      navigate(slug ? `/menu/${slug}` : '/');
    }
  };

  const handleThemeUpdate = async (themeId: string) => {
    if (!venueData?.id) return;

    try {
      const { error } = await supabase
        .from('venues')
        .update({ theme: themeId })
        .eq('id', venueData.id);

      if (error) throw error;

      toast({
        title: 'Theme Updated',
        description: `Successfully switched to the brand new theme!`,
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update theme in the database.',
        variant: 'destructive',
      });
    }
  };

  const handlePriceAdjust = async () => {
    const percent = parseFloat(pricePercent);
    if (isNaN(percent)) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid percentage',
        variant: 'destructive',
      });
      return;
    }

    if (priceScope === "all") {
      await adjustPrices(percent);
    } else {
      await adjustPrices(percent, priceScope);
    }

    toast({
      title: 'Prices updated',
      description: `Prices ${percent >= 0 ? "increased" : "decreased"} by ${Math.abs(percent)}%. Previous menu archived.`,
    });
    setIsPriceDialogOpen(false);
    setPricePercent("");

    // Show PDF prompt after price adjustment
    setShowPDFPrompt(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Count menu items
  const totalSections = Object.keys(menuData).length;
  const totalCategories = Object.values(menuData).reduce(
    (acc, section) => acc + (section?.categories?.length || 0),
    0
  );
  const totalItems = Object.values(menuData).reduce(
    (acc, section) => acc + (section?.categories?.reduce(
      (catAcc, cat) => catAcc + (cat?.items?.length || 0),
      0
    ) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background relative p-4 md:p-8 font-rajdhani overflow-hidden">
      <BackgroundEffects />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-orbitron tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {currentVenue.logo_text || currentVenue.name} <span className="text-neon-cyan">ADMIN</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-[1px] w-12 bg-neon-cyan/50" />
              <p className="text-neon-cyan font-orbitron text-[10px] tracking-[0.3em] uppercase font-bold">
                {currentVenue.logo_subtext || currentVenue.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(slug ? `/menu/${slug}` : '/')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Home className="h-4 w-4 mr-2" />
              View Menu
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_0_30px_-10px_rgba(0,240,255,0.15)] mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Account
                </CardTitle>
                <CardDescription className="text-slate-300 mt-1">
                  {user.email}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={isAdmin ? "default" : "secondary"}
                  className={isAdmin ? "bg-green-600" : "bg-slate-600"}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <ShieldX className="h-3 w-3 mr-1" />
                      User
                    </>
                  )}
                </Badge>
                <Badge
                  className={
                    isPremiumPlus
                      ? "bg-gradient-to-r from-purple-500 to-pink-600"
                      : isPremium
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                        : "bg-slate-600"
                  }
                >
                  {plan?.name || 'Freemium'}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-neon-cyan/30 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Menu Sections</CardDescription>
              <CardTitle className="text-3xl text-white">{totalSections}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-neon-magenta/30 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Categories</CardDescription>
              <CardTitle className="text-3xl text-white">{totalCategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-neon-gold/30 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Menu Items</CardDescription>
              <CardTitle className="text-3xl text-white">{totalItems}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Menu Tools */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_0_30px_-10px_rgba(217,70,239,0.15)] mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Menu Tools
            </CardTitle>
            <CardDescription className="text-slate-300">
              Quick actions for menu management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {/* Adjust Prices */}
              <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!isAdmin}
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Adjust Prices
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Adjust Prices</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-slate-300">Percentage Change</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 10 for +10%, -5 for -5%"
                        value={pricePercent}
                        onChange={(e) => setPricePercent(e.target.value)}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Apply To</Label>
                      <Select value={priceScope} onValueChange={setPriceScope}>
                        <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="all">All Sections</SelectItem>
                          <SelectItem value="snacksAndStarters">Snacks & Starters</SelectItem>
                          <SelectItem value="foodMenu">Food Menu</SelectItem>
                          <SelectItem value="beveragesMenu">Beverages & Spirits</SelectItem>
                          <SelectItem value="sideItems">Side Items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handlePriceAdjust} className="bg-yellow-600 hover:bg-yellow-700">
                      Apply Price Change
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Menu - Premium Feature */}
              {canAccess('edit_access') ? (
                <Button
                  onClick={toggleEditMode}
                  disabled={!isAdmin}
                  variant="outline"
                  className={isEditMode
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Exit Edit' : 'Edit Menu'}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Menu (Premium)
                </Button>
              )}

              {/* Sync Database */}
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!isAdmin}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Sync from Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-600">
                  <DialogHeader>
                    <DialogTitle className="text-white text-red-500">⚠ Sync Database from Code</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      This will <strong>overwrite ALL menu items</strong> in the database with the data from your source code files (`menuData.ts`).
                      This adds new items, updates pricing (unless preserved), and syncs tags.
                    </p>
                    <p className="text-slate-400 text-sm">
                      Use this to push your code changes (new dishes, tags) to the live database.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={handleResetDatabase}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Sync Database
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Download/Print */}
              <Button
                variant="outline"
                onClick={async () => {
                  // Refresh menu data to ensure we have the latest prices
                  await refreshMenu();
                  setIsPrintPreviewOpen(true);
                }}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download / Print
              </Button>

              {/* QR Code Designer - Premium Feature */}
              {canAccess('qr_codes') ? (
                <Button
                  variant="outline"
                  onClick={() => setIsQRCodeCustomizerOpen(true)}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code Designer
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code Designer (Premium)
                </Button>
              )}

              {/* Swiggy/Zomato Menu */}
              <Button
                variant="outline"
                onClick={() => setIsSwiggyManagerOpen(true)}
                className="border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Swiggy/Zomato Menu
              </Button>

              {/* Lead Management */}
              <Button
                variant="outline"
                onClick={() => setIsLeadManagementOpen(true)}
                className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Customer Leads
              </Button>

              {/* Archived Menus - Hidden for MoonWalk */}
              {!(slug && slug.toLowerCase().includes('moonwalk')) && !currentVenue.name?.toLowerCase().includes('moonwalk') && (
                <Button
                  variant="outline"
                  onClick={() => setIsArchivedMenusOpen(true)}
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Menu Archives
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visual Branding & Theme Selector */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 font-cinzel">
              <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-neon-cyan" />
              </div>
              Menu Branding & Themes
            </CardTitle>
            <CardDescription className="text-slate-300">
              Personalize the look and feel of your menu. Changes reflect instantly on your public menu and print exports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector
              currentTheme={(venueData?.theme as MenuTheme) || 'elegant-classic'}
              onThemeSelect={handleThemeUpdate}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Quick Navigation
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isAdmin
                ? 'You have admin privileges. You can edit the menu.'
                : 'You do not have admin privileges. Contact an administrator to get access.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Go to Menu {isEditMode && '(Edit Mode Active)'}
              </Button>
            </div>

            {!isAdmin && (
              <div className="p-4 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> To get admin access, an existing admin needs to add your user ID to the user_roles table with the 'admin' role.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PrintPreview
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        venueName={currentVenue.name}
        venueSubtitle={currentVenue.subtitle || undefined}
        logoText={currentVenue.logo_text || undefined}
        logoSubtext={currentVenue.logo_subtext || undefined}
        venueSlug={slug || 'live'}
        logoUrl={currentVenue.logo_image_url || undefined}
      />
      <QRCodeCustomizer
        isOpen={isQRCodeCustomizerOpen}
        onClose={() => setIsQRCodeCustomizerOpen(false)}
        defaultUrl={`${window.location.origin}/menu/${slug || 'live'}`}
        venueName={currentVenue.name}
        venueTheme={currentVenue.theme ? menuThemes[currentVenue.theme as MenuTheme] : undefined}
      />
      <SwiggyZomatoManager isOpen={isSwiggyManagerOpen} onClose={() => setIsSwiggyManagerOpen(false)} />
      <ArchivedMenus isOpen={isArchivedMenusOpen} onClose={() => setIsArchivedMenusOpen(false)} />
      <LeadManagement isOpen={isLeadManagementOpen} onClose={() => setIsLeadManagementOpen(false)} />

      {/* PDF Prompt Dialog after price adjustment */}
      <Dialog open={showPDFPrompt} onOpenChange={setShowPDFPrompt}>
        <DialogContent className="bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Download Updated Menu PDF?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-300 text-sm">
            Prices have been updated {currentVenue.name.toLowerCase().includes('moonwalk') ? '' : 'and the previous menu has been archived'}. Would you like to download the new menu as a PDF?
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={async () => {
                setShowPDFPrompt(false);
                // Refresh menu data before opening print preview
                await refreshMenu();
                setIsPrintPreviewOpen(true);
              }}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {!(slug && slug.toLowerCase().includes('moonwalk')) && !currentVenue.name?.toLowerCase().includes('moonwalk') && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowPDFPrompt(false);
                  setIsArchivedMenusOpen(true);
                }}
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                <Archive className="w-4 h-4 mr-2" />
                View Archives
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setShowPDFPrompt(false)}
              className="text-slate-400"
            >
              Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
