import { Check, Loader2, AlertCircle, Clock } from 'lucide-react';
import { SaveStatus } from '@/hooks/useAutoSave';
import { formatDistanceToNow } from 'date-fns';

interface SaveIndicatorProps {
    status: SaveStatus;
    lastSaved: Date | null;
    error: Error | null;
    onRetry?: () => void;
}

export const SaveIndicator = ({ status, lastSaved, error, onRetry }: SaveIndicatorProps) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: Loader2,
                    text: 'Saving...',
                    className: 'text-blue-500',
                    iconClassName: 'animate-spin',
                };
            case 'saved':
                return {
                    icon: Check,
                    text: lastSaved ? `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}` : 'All changes saved',
                    className: 'text-green-500',
                    iconClassName: '',
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    text: error?.message || 'Failed to save',
                    className: 'text-red-500',
                    iconClassName: '',
                };
            case 'unsaved':
                return {
                    icon: Clock,
                    text: 'Unsaved changes',
                    className: 'text-yellow-500',
                    iconClassName: '',
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-2 text-sm ${config.className}`}>
            <Icon className={`w-4 h-4 ${config.iconClassName}`} />
            <span>{config.text}</span>
            {status === 'error' && onRetry && (
                <button
                    onClick={onRetry}
                    className="ml-2 text-xs underline hover:no-underline"
                >
                    Retry
                </button>
            )}
        </div>
    );
};
