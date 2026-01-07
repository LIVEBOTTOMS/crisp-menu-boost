import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/hooks/use-toast';

export const GlobalShortcuts = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    useKeyboardShortcuts({
        shortcuts: [
            {
                key: 'a',
                ctrl: true,
                shift: true,
                action: () => {
                    toast({
                        title: "Super Admin Gateway",
                        description: "Redirecting to Platform Admin...",
                        className: "bg-slate-900 text-cyan-400 border-cyan-500/50"
                    });
                    navigate('/platform-admin');
                },
                description: 'Go to Master Admin Dashboard',
            }
        ],
        enabled: true
    });

    return null;
};
