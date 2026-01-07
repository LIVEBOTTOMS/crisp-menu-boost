import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Store,
    Users,
    CreditCard,
    BarChart3,
    ArrowLeft,
    Settings
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/platform-admin' },
    { icon: Store, label: 'Venues', path: '/platform-admin/venues' },
    { icon: Users, label: 'Users', path: '/platform-admin/users' },
    { icon: CreditCard, label: 'Payments', path: '/platform-admin/payments' },
    { icon: BarChart3, label: 'Analytics', path: '/platform-admin/analytics' },
];

export function PlatformSidebar() {
    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    MenuX Master
                </h1>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    Platform Control
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/platform-admin'}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                            isActive
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                            "group-hover:text-cyan-400"
                        )} />
                        <span className="font-medium tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Exit to Home</span>
                </NavLink>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-left">Settings</span>
                </button>
            </div>
        </div>
    );
}
