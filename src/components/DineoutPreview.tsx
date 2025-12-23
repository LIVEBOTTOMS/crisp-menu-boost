import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, X, FileText, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { MenuItem, MenuSection } from "@/data/menuData";
import { format } from "date-fns";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DineoutPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    menuData: any;
    platform: string;
    markup: number;
}

// Spreading logic: Splits categories into pages of max 6 items
const splitIntoPages = (menuData: any, multiplier: number) => {
    const pages: any[] = [];

    // Page 1: Cover
    pages.push({ type: 'cover' });

    // Page 2: Intro
    pages.push({ type: 'intro' });

    const processSection = (section: MenuSection) => {
        section.categories.forEach(category => {
            const items = category.items.map(item => ({
                ...item,
                finalPrice: item.price ? `₹${Math.round(parseFloat(item.price.replace(/[₹,]/g, "")) * multiplier)}` : undefined,
                finalHalf: item.halfPrice ? `₹${Math.round(parseFloat(item.halfPrice.replace(/[₹,]/g, "")) * multiplier)}` : undefined,
                finalFull: item.fullPrice ? `₹${Math.round(parseFloat(item.fullPrice.replace(/[₹,]/g, "")) * multiplier)}` : undefined,
                finalSizes: item.sizes ? item.sizes.map(s => `₹${Math.round(parseFloat(s.replace(/[₹,]/g, "")) * multiplier)}`) : undefined,
            }));

            // Split items into chunks of 6
            for (let i = 0; i < items.length; i += 6) {
                const chunk = items.slice(i, i + 6);
                pages.push({
                    type: 'content',
                    sectionTitle: section.title,
                    categoryTitle: i === 0 ? category.title : `${category.title} (Cont.)`,
                    items: chunk,
                    icon: category.icon
                });
            }
        });
    };

    // Order of sections
    if (menuData.snacksAndStarters) processSection(menuData.snacksAndStarters);
    if (menuData.foodMenu) processSection(menuData.foodMenu);
    if (menuData.beveragesMenu) processSection(menuData.beveragesMenu);
    if (menuData.sideItems) processSection(menuData.sideItems);

    // Page Last: Back Cover
    pages.push({ type: 'outro' });

    return pages;
};

export const DineoutPreview = ({ isOpen, onClose, menuData, platform, markup }: DineoutPreviewProps) => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const [isExporting, setIsExporting] = React.useState(false);
    const multiplier = 1 + markup / 100;

    const pages = useMemo(() => splitIntoPages(menuData, multiplier), [menuData, multiplier]);

    const handleExportPDF = async () => {
        setIsExporting(true);
        toast.info(`Generating ${pages.length}-page PDF... Please wait.`);

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [794, 1123],
            compress: true,
        });

        try {
            // First, render ALL pages to the hidden container for capture
            const hiddenContainer = document.getElementById('dineout-hidden-pages');
            if (!hiddenContainer) {
                toast.error("Hidden container not found");
                return;
            }

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage([794, 1123]);

                const pageId = `dineout-page-${i}`;
                let element = document.getElementById(pageId);

                if (!element) {
                    console.warn(`Page element ${pageId} not found, skipping`);
                    continue;
                }

                // High-quality capture settings
                const canvas = await html2canvas(element, {
                    scale: 3, // Higher resolution for crisp text
                    useCORS: true,
                    backgroundColor: "#1a0b0b",
                    logging: false,
                    imageTimeout: 0,
                    allowTaint: true,
                });

                // Use PNG for crisp text (no compression artifacts)
                const imgData = canvas.toDataURL("image/png", 1.0);
                pdf.addImage(imgData, "PNG", 0, 0, 794, 1123, undefined, 'FAST');

                // Progress update
                if (i % 10 === 0) {
                    toast.info(`Generating page ${i + 1} of ${pages.length}...`);
                }
            }

            pdf.save(`LIVE_${platform}_Menu_${format(new Date(), "yyyy-MM-dd")}.pdf`);
            toast.success(`✅ ${pages.length}-page PDF downloaded successfully!`);
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const renderPageContent = (page: any, index: number) => {
        // Fixed A4 dimensions for consistent PDF output
        const commonStyle = "text-white relative overflow-hidden flex flex-col";
        const pageStyle = { width: '794px', height: '1123px', background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d14 100%)' };

        if (page.type === 'cover') {
            return (
                <div id={`dineout-page-${index}`} style={pageStyle} className={commonStyle + " items-center justify-center text-center"}>
                    {/* Digital Rain Effect - Top */}
                    <div className="absolute top-0 left-0 right-0 h-40 opacity-30" style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)'
                    }} />

                    {/* Circuit Board Corner Decorations */}
                    <div className="absolute top-8 left-8 w-32 h-32 opacity-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#00f0ff" strokeWidth="2" />
                            <path d="M20 20 L50 20" fill="none" stroke="#00f0ff" strokeWidth="1" />
                            <path d="M20 20 L20 50" fill="none" stroke="#00f0ff" strokeWidth="1" />
                            <circle cx="20" cy="20" r="4" fill="#00f0ff" />
                            <circle cx="50" cy="20" r="2" fill="#00f0ff" />
                            <circle cx="20" cy="50" r="2" fill="#00f0ff" />
                        </svg>
                    </div>
                    <div className="absolute top-8 right-8 w-32 h-32 opacity-40" style={{ transform: 'scaleX(-1)' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#ff00ff" strokeWidth="2" />
                            <path d="M20 20 L50 20" fill="none" stroke="#ff00ff" strokeWidth="1" />
                            <path d="M20 20 L20 50" fill="none" stroke="#ff00ff" strokeWidth="1" />
                            <circle cx="20" cy="20" r="4" fill="#ff00ff" />
                            <circle cx="50" cy="20" r="2" fill="#ff00ff" />
                            <circle cx="20" cy="50" r="2" fill="#ff00ff" />
                        </svg>
                    </div>
                    <div className="absolute bottom-8 left-8 w-32 h-32 opacity-40" style={{ transform: 'scaleY(-1)' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#00f0ff" strokeWidth="2" />
                            <path d="M20 20 L50 20" fill="none" stroke="#00f0ff" strokeWidth="1" />
                            <circle cx="20" cy="20" r="4" fill="#00f0ff" />
                        </svg>
                    </div>
                    <div className="absolute bottom-8 right-8 w-32 h-32 opacity-40" style={{ transform: 'scale(-1, -1)' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#ff00ff" strokeWidth="2" />
                            <path d="M20 20 L50 20" fill="none" stroke="#ff00ff" strokeWidth="1" />
                            <circle cx="20" cy="20" r="4" fill="#ff00ff" />
                        </svg>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 space-y-6">
                        {/* LIVE Logo Text - Neon Circuit Style */}
                        <div className="relative">
                            <h1 className="font-orbitron text-[120px] font-black tracking-[0.1em] leading-none"
                                style={{
                                    background: 'linear-gradient(90deg, #00f0ff 0%, #00f0ff 25%, #a855f7 50%, #ff00ff 75%, #ff00ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.5)) drop-shadow(0 0 60px rgba(255,0,255,0.3))',
                                    textShadow: '0 0 40px rgba(0,240,255,0.8)'
                                }}
                            >
                                LIVE
                            </h1>
                            {/* Grid overlay effect on text */}
                            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 10px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 10px)'
                            }} />
                        </div>

                        {/* Divider with circuit nodes */}
                        <div className="flex items-center justify-center gap-4 py-4">
                            <div className="w-24 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #00f0ff)' }} />
                            <div className="w-3 h-3 rotate-45" style={{ background: '#00f0ff', boxShadow: '0 0 15px #00f0ff' }} />
                            <div className="w-16 h-[2px]" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)' }} />
                            <div className="w-3 h-3 rotate-45" style={{ background: '#ff00ff', boxShadow: '0 0 15px #ff00ff' }} />
                            <div className="w-24 h-[2px]" style={{ background: 'linear-gradient(-90deg, transparent, #ff00ff)' }} />
                        </div>

                        {/* Tagline */}
                        <h2 className="font-orbitron text-2xl tracking-[0.5em] text-white font-bold">
                            BAR & KITCHEN
                        </h2>

                        {/* EAT.DRINK.CODE.REPEAT */}
                        <p className="font-orbitron text-lg tracking-[0.3em] mt-8"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            EAT.DRINK.CODE.REPEAT
                        </p>

                        {/* Fork & Spoon Icon */}
                        <div className="flex justify-center items-center gap-2 mt-8 opacity-60">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1.5">
                                <path d="M5 3v18M5 3c0 3 2 5 2 8s-2 5-2 5M9 3v7c0 1-1 2-2 2" />
                            </svg>
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" strokeWidth="1.5">
                                <path d="M15 3c0 5-3 7-3 12v6M12 15c-3-5-3-7-3-12" />
                                <ellipse cx="12" cy="6" rx="3" ry="4" />
                            </svg>
                        </div>

                        {/* Binary Code */}
                        <div className="font-mono text-[8px] text-cyan-500/40 tracking-widest mt-6">
                            0011010100111101011011011<br />
                            0101010110110101011110111
                        </div>

                        {/* Location */}
                        <div className="mt-8 opacity-40">
                            <span className="text-xs tracking-[0.3em] uppercase font-orbitron">Pune • Est. 2024</span>
                        </div>
                    </div>

                    {/* Bottom disclaimer */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-[9px] text-slate-500 tracking-wide">We serve alcohol. Please ensure appropriate age.</p>
                    </div>

                    {/* Subtle grid background */}
                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            );
        }

        if (page.type === 'intro') {
            return (
                <div id={`dineout-page-${index}`} style={pageStyle} className={commonStyle + " p-16"}>
                    {/* Circuit board decorative lines */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #00f0ff, transparent 30%, transparent 70%, #ff00ff)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #00f0ff, transparent 30%, transparent 70%, #ff00ff)' }} />

                    {/* Small circuit nodes */}
                    <div className="absolute top-12 left-12 w-2 h-2 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }} />
                    <div className="absolute top-12 right-12 w-2 h-2 rounded-full" style={{ background: '#ff00ff', boxShadow: '0 0 10px #ff00ff' }} />

                    <div className="relative z-10 pt-16 px-8">
                        <h2 className="font-orbitron text-4xl font-bold mb-8"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            WHERE NIGHTS COME ALIVE
                        </h2>
                        <div className="w-32 h-[2px] mb-8" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)' }} />

                        <div className="space-y-6 text-xl leading-relaxed text-slate-200">
                            <p className="flex items-start gap-4">
                                <span className="text-cyan-400 font-mono text-sm mt-1">{'>'}</span>
                                Welcome to LIVE — Pune's ultimate destination for unforgettable nights. Step onto our signature dance floor and let the rhythm take over.
                            </p>
                            <p className="flex items-start gap-4">
                                <span className="text-purple-400 font-mono text-sm mt-1">{'>'}</span>
                                Every weekend, we bring you electrifying live music performances that set the vibe for an evening you won't forget.
                            </p>
                            <p className="flex items-start gap-4">
                                <span className="text-cyan-400 font-mono text-sm mt-1">{'>'}</span>
                                From handcrafted cocktails to premium spirits, our bar is stocked with the finest selections to keep your spirits high.
                            </p>
                            <p className="flex items-start gap-4">
                                <span className="text-purple-400 font-mono text-sm mt-1">{'>'}</span>
                                Whether you're here to dance, dine, or simply unwind — at LIVE, the party never stops.
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto flex justify-between items-end px-8 pb-8">
                        <div className="font-orbitron text-[10px] text-cyan-400/60 tracking-[0.3em] uppercase">
                            🎵 Live Music Every Weekend
                        </div>
                        <div className="font-orbitron text-purple-400/60 text-sm tracking-widest">
                            Pune
                        </div>
                    </div>

                    {/* Subtle grid background */}
                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            );
        }

        if (page.type === 'content') {
            // Check if this category has items with sizes (spirits)
            const hasSizes = page.items.some((item: any) => item.finalSizes);

            return (
                <div id={`dineout-page-${index}`} style={pageStyle} className={commonStyle + " p-10"}>
                    {/* Top border line */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #00f0ff, transparent 50%, #ff00ff)' }} />

                    {/* LIVE Logo watermark */}
                    <div className="absolute top-6 right-8 opacity-30">
                        <span className="font-orbitron text-lg" style={{
                            background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>LIVE</span>
                    </div>

                    {/* Category Header */}
                    <div className="mb-6 pb-3" style={{ borderBottom: '2px solid rgba(0,240,255,0.3)' }}>
                        <div className="flex items-center gap-3">
                            {page.icon && <span className="text-2xl">{page.icon}</span>}
                            <h3 className="font-orbitron text-xl font-bold tracking-[0.15em] uppercase"
                                style={{
                                    background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                {page.categoryTitle}
                            </h3>
                            <div className="w-2 h-2 rounded-full ml-2" style={{ background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
                        </div>
                    </div>

                    {/* Size Headers for Spirits */}
                    {hasSizes && (
                        <div className="flex justify-end gap-3 mb-4 pr-2 pb-2" style={{ borderBottom: '1px solid rgba(0,240,255,0.2)' }}>
                            <span className="text-[9px] text-cyan-400/80 w-12 text-center font-bold font-orbitron">30ml</span>
                            <span className="text-[9px] text-cyan-400/80 w-12 text-center font-bold font-orbitron">60ml</span>
                            <span className="text-[9px] text-cyan-400/80 w-12 text-center font-bold font-orbitron">90ml</span>
                            <span className="text-[9px] text-purple-400/80 w-12 text-center font-bold font-orbitron">180ml</span>
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="space-y-5 flex-1">
                        {page.items.map((item: any, idx: number) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-orbitron font-bold text-base tracking-tight text-white uppercase">
                                                {item.name}
                                            </h4>
                                            {item.isBestSeller && <span className="text-[8px] px-1.5 py-0.5 bg-neon-gold/20 text-neon-gold rounded font-bold">★ BEST SELLER</span>}
                                            {item.isChefSpecial && <span className="text-[8px] px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded font-bold">⭐ CHEF'S PICK</span>}
                                            {item.isPremium && <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-bold">✨ PREMIUM</span>}
                                        </div>
                                        {item.description && (
                                            <p className="font-cormorant italic text-sm text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right flex items-center">
                                        {item.finalSizes ? (
                                            <div className="flex gap-3">
                                                {item.finalSizes.map((s: string, sIdx: number) => (
                                                    <span key={sIdx} className="font-orbitron font-bold text-sm text-neon-gold w-12 text-center">
                                                        {s.replace('₹', '')}/-
                                                    </span>
                                                ))}
                                            </div>
                                        ) : item.finalHalf ? (
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] uppercase text-slate-500">Half</span>
                                                    <span className="font-orbitron font-bold text-sm text-neon-gold">{item.finalHalf.replace('₹', '')}/-</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[8px] uppercase text-slate-500">Full</span>
                                                    <span className="font-orbitron font-bold text-sm text-neon-gold">{item.finalFull.replace('₹', '')}/-</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="font-orbitron font-bold text-lg text-neon-gold">
                                                {(item.finalPrice || "").replace('₹', '')}/-
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(0,240,255,0.2)' }}>
                        <div className="flex justify-between items-center text-[8px] text-slate-500 tracking-wide">
                            <span>Govt. Taxes as Applicable | We levy a 5% Service Charge at Guest's Discretion</span>
                            <span className="font-orbitron text-cyan-400/60">Page {index + 1}</span>
                        </div>
                    </div>

                    {/* Subtle grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-3" style={{
                        backgroundImage: 'linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            );
        }

        if (page.type === 'outro') {
            return (
                <div id={`dineout-page-${index}`} style={pageStyle} className={commonStyle + " items-center justify-center text-center"}>
                    {/* Circuit corner decorations */}
                    <div className="absolute top-8 left-8 w-24 h-24 opacity-30">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#00f0ff" strokeWidth="2" />
                            <circle cx="20" cy="20" r="4" fill="#00f0ff" />
                        </svg>
                    </div>
                    <div className="absolute bottom-8 right-8 w-24 h-24 opacity-30" style={{ transform: 'scale(-1, -1)' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M0 20 L20 20 L20 0" fill="none" stroke="#ff00ff" strokeWidth="2" />
                            <circle cx="20" cy="20" r="4" fill="#ff00ff" />
                        </svg>
                    </div>

                    <div className="space-y-6">
                        {/* Pulsing circle */}
                        <div className="w-20 h-20 border-2 rounded-full flex items-center justify-center mx-auto mb-8"
                            style={{ borderColor: 'rgba(0,240,255,0.3)', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
                            <div className="w-3 h-3 rounded-full animate-ping" style={{ background: '#00f0ff' }} />
                        </div>

                        <h3 className="font-orbitron text-2xl tracking-[0.5em]"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            THANK YOU
                        </h3>

                        <p className="font-orbitron text-sm text-cyan-400/60 tracking-widest">
                            Follow us for more premium experiences
                        </p>

                        {/* Binary code */}
                        <div className="pt-8 font-mono text-[8px] text-purple-400/30 tracking-widest">
                            01001100.01001001.01010110.01000101
                        </div>

                        <div className="pt-8 text-[10px] text-slate-600 tracking-widest uppercase space-y-2">
                            <p>Taxes as applicable</p>
                            <p>Always drink responsibly</p>
                        </div>
                    </div>

                    {/* Grid background */}
                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1000px] h-[95vh] bg-slate-950 border-slate-800 p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neon-gold/20 rounded-lg">
                            <FileText className="w-6 h-6 text-neon-gold" />
                        </div>
                        <div>
                            <DialogTitle className="text-white text-xl font-orbitron">Dineout Premium Preview</DialogTitle>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{platform} • {markup}% Markup • {pages.length} Pages</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleExportPDF}
                            className="font-bold h-10 px-6"
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                color: '#000'
                            }}
                            disabled={isExporting}
                        >
                            {isExporting ? <span className="animate-spin mr-2">⏳</span> : <Download className="w-4 h-4 mr-2" />}
                            {isExporting ? 'Generating...' : `Download ${pages.length}-Page PDF`}
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Navigation/TOC Sidebar */}
                    <div className="w-64 border-r border-white/5 bg-black p-4 hidden md:block">
                        {/* Download Section */}
                        <div className="mb-6 p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,255,0.1))' }}>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">📥 Download Menu</h4>
                            <Button
                                onClick={handleExportPDF}
                                className="w-full font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(90deg, #00f0ff, #ff00ff)',
                                    color: '#000'
                                }}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span> Generating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Download className="w-4 h-4" /> PDF ({pages.length} pages)
                                    </span>
                                )}
                            </Button>
                            <p className="text-[9px] text-slate-500 mt-2 text-center">High-quality A4 format</p>
                        </div>

                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Page Index</h4>
                        <ScrollArea className="h-[calc(95vh-150px)]">
                            <div className="space-y-1">
                                {pages.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${currentPage === i ? 'bg-gold/20 text-neon-gold' : 'text-slate-400 hover:bg-white/5'}`}
                                    >
                                        {p.type === 'cover' ? 'Front Cover' :
                                            p.type === 'intro' ? 'Intro Page' :
                                                p.type === 'outro' ? 'Back Cover' :
                                                    `${p.categoryTitle}`}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Page Viewer */}
                    <div className="flex-1 bg-slate-900 overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
                        <div className="flex items-center gap-4 fixed bottom-12 z-50 bg-black/80 backdrop-blur px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}><ChevronLeft /></Button>
                            <span className="font-orbitron text-xs tracking-widest text-white min-w-[100px] text-center">PAGE {currentPage + 1} / {pages.length}</span>
                            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}><ChevronRight /></Button>
                        </div>

                        <div className="shadow-[0_0_100px_rgba(0,0,0,0.8)] scale-90 md:scale-100 origin-top">
                            {renderPageContent(pages[currentPage], currentPage)}
                        </div>

                        {/* Hidden render of ALL pages for PDF capture - must be visible but off-screen for html2canvas */}
                        <div id="dineout-hidden-pages" className="absolute left-[-9999px] top-0" style={{ width: '794px' }}>
                            {pages.map((p, i) => (
                                <div key={i} style={{ width: '794px', height: '1123px', marginBottom: '10px' }}>
                                    {renderPageContent(p, i)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
