import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    return (
        <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            <Globe className="w-4 h-4" />
            <span className="font-semibold">
                {language === 'en' ? 'हिन्दी' : 'English'}
            </span>
        </Button>
    );
};
