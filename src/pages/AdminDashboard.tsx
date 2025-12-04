import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMenu } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Menu, Users, Settings, ShieldCheck, ShieldX, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { menuData, setIsEditMode, isEditMode } = useMenu();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const toggleEditMode = () => {
    if (!isAdmin) {
      toast({
        title: 'Access denied',
        description: 'You need admin privileges to edit the menu.',
        variant: 'destructive',
      });
      return;
    }
    setIsEditMode(!isEditMode);
    toast({
      title: isEditMode ? 'Edit mode disabled' : 'Edit mode enabled',
      description: isEditMode 
        ? 'You can no longer make changes to the menu.' 
        : 'You can now edit menu items.',
    });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-300 mt-1">Manage your menu and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
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
        <Card className="bg-slate-800/80 border-purple-500/30 mb-6">
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
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800/80 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Menu Sections</CardDescription>
              <CardTitle className="text-3xl text-white">{totalSections}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/80 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Categories</CardDescription>
              <CardTitle className="text-3xl text-white">{totalCategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/80 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Menu Items</CardDescription>
              <CardTitle className="text-3xl text-white">{totalItems}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-slate-800/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Menu Management
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
                onClick={toggleEditMode}
                disabled={!isAdmin}
                className={isEditMode 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "bg-purple-600 hover:bg-purple-700"}
              >
                <Menu className="h-4 w-4 mr-2" />
                {isEditMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
              </Button>
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
    </div>
  );
};

export default AdminDashboard;
