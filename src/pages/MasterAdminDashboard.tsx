import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlatformSidebar } from '@/components/admin/PlatformSidebar';
import { PlatformOverview } from '@/components/admin/PlatformOverview';
import { VenueManagementPage } from '@/pages/VenueManagementPage';
import UserManagementPage from '@/pages/UserManagementPage';
import PaymentApprovalsPage from '@/pages/PaymentApprovalsPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function MasterAdminDashboard() {
    const { user, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-slate-400 mb-6">
                        You do not have the required permissions to access the Platform Control Center.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <PlatformSidebar />

            <main className="pl-64 min-h-screen transition-all">
                <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                            Platform Admin
                        </h2>
                        <div className="h-4 w-[1px] bg-slate-800" />
                        <span className="text-white font-medium">
                            Dashboard
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-bold text-white">{user.email}</div>
                            <div className="text-[10px] text-cyan-400 uppercase font-black">Super Admin</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/10" />
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<PlatformOverview />} />
                        <Route path="/venues" element={<VenueManagementPage />} />
                        <Route path="/users" element={<UserManagementPage />} />
                        <Route path="/payments" element={<PaymentApprovalsPage />} />
                        <Route path="/analytics" element={<div className="p-20 text-center text-slate-500 italic">Advanced Analytics module arriving soon...</div>} />
                        <Route path="*" element={<Navigate to="/platform-admin" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
