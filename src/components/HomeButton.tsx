import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeButtonProps {
    className?: string;
    variant?: 'icon' | 'text' | 'full';
}

export const HomeButton = ({ className = '', variant = 'full' }: HomeButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                className={`p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-105 ${className}`}
                title="Go to Home"
            >
                <Home size={24} />
            </button>
        );
    }

    if (variant === 'text') {
        return (
            <button
                onClick={handleClick}
                className={`text-white/70 hover:text-white transition-colors underline ${className}`}
            >
                ← Back to Home
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
        border border-cyan-500/30 text-white hover:border-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30
        transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/10 ${className}`}
        >
            <Home size={18} />
            <span>Home</span>
        </button>
    );
};

export default HomeButton;
