import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, Crown, User, Mail } from 'lucide-react';

interface UserWithRole {
    id: string;
    email: string;
    role: 'admin' | 'user' | null;
    plan_name: string | null;
    created_at: string;
}

export default function UserManagementPage() {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserWithRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;
        fetchUsers();
    }, [isAdmin]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select(`
          user_id,
          role,
          users:auth.users!user_roles_user_id_fkey (
            id,
            email,
            created_at
          ),
          user_subscriptions (
            subscription_plans (
              name
            )
          )
        `);

            if (error) throw error;

            // Also get users without roles
            const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers();

            if (usersError) throw usersError;

            const formattedUsers: UserWithRole[] = allUsers.users.map((u) => {
                const userRole = data?.find((r: any) => r.user_id === u.id);
                return {
                    id: u.id,
                    email: u.email || '',
                    role: userRole?.role || null,
                    plan_name: userRole?.user_subscriptions?.[0]?.subscription_plans?.name || 'Freemium',
                    created_at: u.created_at,
                };
            });

            setUsers(formattedUsers);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast({
                title: "Error",
                description: "Could not load users",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAdminRole = async (userId: string, currentRole: string | null) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';

            const { error } = await supabase
                .from('user_roles')
                .upsert({
                    user_id: userId,
                    role: newRole,
                });

            if (error) throw error;

            toast({
                title: "Role updated",
                description: `User is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`,
            });

            fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Could not update role",
                variant: "destructive",
            });
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-gray-400">You must be an admin to view this page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">User Management</h1>
                    <p className="text-gray-400">Manage user roles and permissions</p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-400">Loading users...</div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((u) => (
                            <Card key={u.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                                {u.role === 'admin' ? (
                                                    <ShieldCheck className="w-6 h-6 text-white" />
                                                ) : (
                                                    <User className="w-6 h-6 text-white" />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-white">{u.email}</span>
                                                    {u.id === user?.id && (
                                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    Joined {new Date(u.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Plan Badge */}
                                            <Badge
                                                className={
                                                    u.plan_name === 'Premium+'
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                                                        : u.plan_name === 'Premium'
                                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                                                            : 'bg-slate-600'
                                                }
                                            >
                                                {u.plan_name || 'Freemium'}
                                            </Badge>

                                            {/* Role Badge */}
                                            <Badge
                                                className={
                                                    u.role === 'admin'
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                                        : 'bg-gray-600/20 text-gray-400 border-gray-600/50'
                                                }
                                            >
                                                {u.role === 'admin' ? (
                                                    <>
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        Admin
                                                    </>
                                                ) : (
                                                    'User'
                                                )}
                                            </Badge>

                                            {/* Toggle Admin Button */}
                                            {u.id !== user?.id && (
                                                <Button
                                                    onClick={() => toggleAdminRole(u.id, u.role)}
                                                    variant={u.role === 'admin' ? 'destructive' : 'default'}
                                                    size="sm"
                                                >
                                                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
