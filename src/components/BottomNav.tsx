import { useState, useEffect } from 'react';
import { Home, Menu, QrCode, User, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomNavProps {
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        // Update active tab based on current route
        const path = location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path.includes('/menus')) setActiveTab('menus');
        else if (path.includes('/create')) setActiveTab('create');
        else if (path.includes('/admin')) setActiveTab('profile');
    }, [location]);

    const tabs = [
        { id: 'home', icon: Home, label: 'Home', path: '/' },
        { id: 'menus', icon: Menu, label: 'Menus', path: '/menus' },
        { id: 'create', icon: Plus, label: 'Create', path: '/create-menu', special: true },
        { id: 'scan', icon: QrCode, label: 'Scan', path: '/scan' },
        { id: 'profile', icon: User, label: 'Profile', path: '/admin' },
    ];

    const handleTabClick = (tab: typeof tabs[0]) => {
        setActiveTab(tab.id);
        navigate(tab.path);
    };

    return (
        <nav className={`fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe z-50 ${className}`}>
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-around h-16">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        if (tab.special) {
                            // Special floating action button
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab)}
                                    className="relative -mt-8"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </motion.button>
                            );
                        }

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className="flex flex-col items-center justify-center flex-1 h-full relative"
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}

                                {/* Icon */}
                                <Icon
                                    className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'
                                        }`}
                                />

                                {/* Label */}
                                <span
                                    className={`text-xs font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'
                                        }`}
                                >
                                    {tab.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
