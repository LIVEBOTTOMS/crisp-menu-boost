import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Copy, Check, Palette, Image as ImageIcon } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "sonner";

interface QRCodeCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    defaultUrl: string;
    venueName: string;
    venueTheme?: {
        colors: {
            primary: string;
            secondary: string;
            accent: string;
        };
    };
}

export const QRCodeCustomizer = ({
    isOpen,
    onClose,
    defaultUrl,
    venueName,
    venueTheme
}: QRCodeCustomizerProps) => {
    const [qrUrl, setQrUrl] = useState(defaultUrl);
    const [fgColor, setFgColor] = useState(venueTheme?.colors.primary || '#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [size, setSize] = useState(512);
    const [includeMargin, setIncludeMargin] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        toast.success("URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadSVG = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${venueName.replace(/\s+/g, '-').toLowerCase()}-qr-code.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("QR Code SVG downloaded!");
    };

    const handleDownloadPNG = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx?.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${venueName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success("QR Code PNG downloaded!");
            });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const presetThemes = [
        { name: "Classic", fg: "#000000", bg: "#FFFFFF" },
        { name: "Neon Cyan", fg: venueTheme?.colors.primary || "#00f0ff", bg: "#0a0a0f" },
        { name: "Gold Luxe", fg: "#ffd700", bg: "#1a1a1f" },
        { name: "Magenta", fg: "#ff00ff", bg: "#0f0a0f" },
        { name: "Minimal", fg: "#1a1a1a", bg: "#f5f5f5" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-cinzel flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-neon-cyan" />
                        </div>
                        QR Code Designer
                    </DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-8 mt-4">
                    {/* Preview Section */}
                    <div className="space-y-4">
                        <div className="text-sm font-rajdhani text-gray-400 uppercase tracking-wider">Preview</div>
                        <div
                            className="rounded-xl p-8 flex items-center justify-center border-2"
                            style={{
                                backgroundColor: bgColor,
                                borderColor: fgColor + '20'
                            }}
                        >
                            <QRCodeSVG
                                id="qr-code-svg"
                                value={qrUrl}
                                size={Math.min(size, 300)}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level="H"
                                includeMargin={includeMargin}
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-rajdhani mb-2">Venue Name</p>
                            <p className="font-cinzel text-lg font-bold" style={{ color: fgColor }}>{venueName}</p>
                        </div>
                    </div>

                    {/* Customization Section */}
                    <div className="space-y-6">
                        {/* URL Input */}
                        <div>
                            <Label className="text-white font-rajdhani mb-2 block">QR Code URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={qrUrl}
                                    onChange={(e) => setQrUrl(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    placeholder="https://your-menu-url.com"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={handleCopyUrl}
                                    className="border-slate-700 hover:bg-slate-800"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Color Themes */}
                        <div>
                            <Label className="text-white font-rajdhani mb-2 block flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Color Presets
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {presetThemes.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => {
                                            setFgColor(theme.fg);
                                            setBgColor(theme.bg);
                                        }}
                                        className="p-3 rounded-lg border-2 border-slate-700 hover:border-neon-cyan transition-colors text-sm font-rajdhani"
                                        style={{
                                            background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg} 50%, ${theme.fg}20 100%)`
                                        }}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-white font-rajdhani mb-2 block">Foreground Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="h-10 w-16 p-1 border-slate-700"
                                    />
                                    <Input
                                        type="text"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-white font-rajdhani mb-2 block">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="h-10 w-16 p-1 border-slate-700"
                                    />
                                    <Input
                                        type="text"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Size Slider */}
                        <div>
                            <Label className="text-white font-rajdhani mb-2 block">
                                Export Size: {size}px × {size}px
                            </Label>
                            <input
                                type="range"
                                min="256"
                                max="2048"
                                step="256"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 font-rajdhani mt-1">
                                <span>256px</span>
                                <span>2048px</span>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="include-margin"
                                checked={includeMargin}
                                onChange={(e) => setIncludeMargin(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="include-margin" className="text-white font-rajdhani cursor-pointer">
                                Include Margin
                            </Label>
                        </div>

                        {/* Download Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <Button
                                onClick={handleDownloadSVG}
                                className="bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black font-rajdhani font-bold"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download SVG
                            </Button>
                            <Button
                                onClick={handleDownloadPNG}
                                className="bg-neon-gold/20 border border-neon-gold/50 text-neon-gold hover:bg-neon-gold hover:text-black font-rajdhani font-bold"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PNG
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
