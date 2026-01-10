import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface GuestData {
    venueName?: string;
    location?: string;
    industry?: string;
    menuItems?: any[];
    preferences?: {
        theme?: string;
        language?: string;
    };
}

interface GuestModeContextType {
    isGuestMode: boolean;
    guestData: GuestData;
    startGuestMode: () => void;
    exitGuestMode: () => void;
    convertToFullAccount: (email: string, password: string) => Promise<void>;
    updateGuestData: (data: Partial<GuestData>) => void;
    saveProgress: () => void;
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

const GUEST_DATA_KEY = 'menux_guest_data';
const GUEST_MODE_KEY = 'menux_guest_mode';

export const GuestModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, signUp } = useAuth();
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [guestData, setGuestData] = useState<GuestData>({});

    // Load guest data from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem(GUEST_MODE_KEY);
        const savedData = localStorage.getItem(GUEST_DATA_KEY);

        if (savedMode === 'true' && !user) {
            setIsGuestMode(true);
            if (savedData) {
                try {
                    setGuestData(JSON.parse(savedData));
                } catch (error) {
                    console.error('Failed to parse guest data:', error);
                }
            }
        }
    }, [user]);

    // Clear guest mode when user logs in
    useEffect(() => {
        if (user && isGuestMode) {
            // User logged in, exit guest mode
            exitGuestMode();
        }
    }, [user]);

    const startGuestMode = () => {
        setIsGuestMode(true);
        localStorage.setItem(GUEST_MODE_KEY, 'true');

        // Initialize with smart defaults
        const defaultData: GuestData = {
            preferences: {
                theme: 'cyberpunk-tech',
                language: 'en',
            },
        };
        setGuestData(defaultData);
        localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(defaultData));
    };

    const exitGuestMode = () => {
        setIsGuestMode(false);
        setGuestData({});
        localStorage.removeItem(GUEST_MODE_KEY);
        localStorage.removeItem(GUEST_DATA_KEY);
    };

    const updateGuestData = (data: Partial<GuestData>) => {
        const newData = { ...guestData, ...data };
        setGuestData(newData);
        localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(newData));
    };

    const saveProgress = () => {
        localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(guestData));
    };

    const convertToFullAccount = async (email: string, password: string) => {
        try {
            // Create full account
            const { error } = await signUp(email, password);

            if (error) {
                throw error;
            }

            // Guest data will be used to create venue after signup
            // The auto-onboarding trigger will handle venue creation
            // We can enhance it to use guest data if available

            // Exit guest mode
            exitGuestMode();

            return;
        } catch (error) {
            console.error('Failed to convert guest account:', error);
            throw error;
        }
    };

    return (
        <GuestModeContext.Provider
            value={{
                isGuestMode,
                guestData,
                startGuestMode,
                exitGuestMode,
                convertToFullAccount,
                updateGuestData,
                saveProgress,
            }}
        >
            {children}
        </GuestModeContext.Provider>
    );
};

export const useGuestMode = () => {
    const context = useContext(GuestModeContext);
    if (context === undefined) {
        throw new Error('useGuestMode must be used within a GuestModeProvider');
    }
    return context;
};
