import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface LeadCaptureDialogProps {
    onAccessGranted: () => void;
}

export const LeadCaptureDialog = ({ onAccessGranted }: LeadCaptureDialogProps) => {
    const [open, setOpen] = useState(true);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const handleSubmit = async () => {
        if (!phone && !email) {
            toast.error(t('common.error'));
            return;
        }

        // Validate email if provided
        if (email && !email.includes('@')) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Supabase (Best effort)
            const { error } = await (supabase as any).from('customer_leads').insert({
                phone: phone || null,
                email: email || null,
                source: 'qr_lead',
                metadata: {
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            });

            if (error) {
                console.error("Failed to save lead:", error);
            }
        } catch (err) {
            console.error("Error saving lead:", err);
        }

        // Save logic to local storage
        const info = { phone, email, timestamp: new Date().toISOString() };
        localStorage.setItem("menux_customer_info", JSON.stringify(info));

        setIsSubmitting(false);
        toast.success(t('common.success'));
        setOpen(false);
        onAccessGranted();
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent
                className="sm:max-w-md bg-card border-primary/20"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-orbitron text-center text-gradient">{t('lead.welcome')}</DialogTitle>
                    <DialogDescription className="text-center">
                        {t('lead.subtitle')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('lead.phone')}</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="bg-background/50 border-white/10"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">{t('lead.or')}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('lead.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-background/50 border-white/10"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide"
                    >
                        {isSubmitting ? t('common.loading') : t('lead.submit')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
