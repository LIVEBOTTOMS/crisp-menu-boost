import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShoppingBag, Download, Plus, Save, Trash2, FileSpreadsheet, RefreshCw, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMenu } from "@/contexts/MenuContext";
import { MenuItem, MenuSection } from "@/data/menuData";
import { DineoutPreview } from "./DineoutPreview";

interface PlatformMenu {
    id: string;
    platform_name: string;
    menu_data: any;
    markup_percentage: number;
    notes: string | null;
    created_at: string;
}

interface SwiggyZomatoManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SwiggyZomatoManager = ({ isOpen, onClose }: SwiggyZomatoManagerProps) => {
    const { menuData } = useMenu();
    const [savedMenus, setSavedMenus] = useState<PlatformMenu[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("convert");
    const [isDineoutPreviewOpen, setIsDineoutPreviewOpen] = useState(false);

    // Conversion state
    const [markup, setMarkup] = useState<number>(25);
    const [platform, setPlatform] = useState<string>("Swiggy");
    const [notes, setNotes] = useState<string>("");
    const [convertedMenu, setConvertedMenu] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            fetchSavedMenus();
        }
    }, [isOpen]);

    const fetchSavedMenus = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("platform_menus" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSavedMenus((data || []) as unknown as PlatformMenu[]);
        } catch (error) {
            console.error("Error fetching platform menus:", error);
            // Don't toast error if table doesn't exist yet (first time)
        } finally {
            setIsLoading(false);
        }
    };

    const handleConvert = () => {
        const multiplier = 1 + markup / 100;

        const convertItem = (item: MenuItem): MenuItem => {
            const newItem = { ...item };

            const adjustPrice = (priceStr?: string) => {
                if (!priceStr) return undefined;
                const price = parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
                return `₹${Math.round(price * multiplier)}`;
            };

            if (item.price) newItem.price = adjustPrice(item.price);
            if (item.halfPrice) newItem.halfPrice = adjustPrice(item.halfPrice);
            if (item.fullPrice) newItem.fullPrice = adjustPrice(item.fullPrice);
            if (item.sizes) {
                newItem.sizes = item.sizes.map(s => adjustPrice(s) || s);
            }

            // Delivery specific name suffix optionally
            // newItem.name = `${item.name} (Delivery)`;

            return newItem;
        };

        const newMenuData = JSON.parse(JSON.stringify(menuData));
        Object.keys(newMenuData).forEach(sectionKey => {
            const section = newMenuData[sectionKey] as MenuSection;
            section.categories.forEach(category => {
                category.items = category.items.map(convertItem);
            });
        });

        setConvertedMenu(newMenuData);
        toast.success(`Converted menu with ${markup}% markup for ${platform}`);
    };

    const handleSave = async () => {
        if (!convertedMenu) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("platform_menus" as any)
                .insert({
                    platform_name: platform,
                    menu_data: convertedMenu,
                    markup_percentage: markup,
                    notes: notes
                });

            if (error) throw error;

            toast.success("Platform menu saved successfully");
            fetchSavedMenus();
            setActiveTab("saved");
        } catch (error: any) {
            console.error("Error saving platform menu:", error);
            toast.error(`Failed to save: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this menu?")) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("platform_menus" as any)
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast.success("Menu deleted");
            fetchSavedMenus();
        } catch (error) {
            console.error("Error deleting menu:", error);
            toast.error("Failed to delete menu");
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = (menu: any) => {
        // Basic Swiggy/Zomato bulk upload format simulation
        const rows = [
            ["Category", "Item Name", "Description", "Price", "Veb/Non-Veg"]
        ];

        Object.values(menu).forEach((section: any) => {
            section.categories.forEach((cat: any) => {
                cat.items.forEach((item: any) => {
                    rows.push([
                        cat.title,
                        item.name,
                        item.description || "",
                        item.price || item.fullPrice || (item.sizes ? item.sizes[0] : "0"),
                        item.isVeg ? "Veg" : "Non-Veg"
                    ]);
                });
            });
        });

        const csvContent = rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${platform}_menu_${format(new Date(), "yyyy-MM-dd")}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-neon-cyan font-orbitron">
                        <ShoppingBag className="h-6 w-6" />
                        Swiggy & Zomato Menu Manager
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                    <TabsList className="bg-slate-800 border-slate-700 w-full justify-start overflow-x-auto">
                        <TabsTrigger value="convert" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black">
                            <Plus className="w-4 h-4 mr-2" />
                            Convert Current
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Saved Menus ({savedMenus.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="convert" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <select
                                    id="platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                >
                                    <option value="Swiggy">Swiggy</option>
                                    <option value="Zomato">Zomato</option>
                                    <option value="MagicPin">MagicPin</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="markup">Markup Percentage (%)</Label>
                                <Input
                                    id="markup"
                                    type="number"
                                    value={markup}
                                    onChange={(e) => setMarkup(Number(e.target.value))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="space-y-2 flex items-end">
                                <Button
                                    onClick={handleConvert}
                                    className="w-full bg-neon-cyan hover:bg-cyan-400 text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                >
                                    Apply & Preview
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes / Version Label</Label>
                            <Input
                                id="notes"
                                placeholder="e.g., Summer 2024 Campaign"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        {convertedMenu && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                                    <h3 className="text-lg font-bold text-neon-cyan">Preview: {platform} Menu</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDineoutPreviewOpen(true)}
                                            className="border-neon-gold text-neon-gold hover:bg-neon-gold/10"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Preview Dineout Edition
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => exportToCSV(convertedMenu)}
                                            className="border-green-600 text-green-400 hover:bg-green-600/10"
                                        >
                                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save to Tab
                                        </Button>
                                    </div>
                                </div>

                                <ScrollArea className="h-[40vh] border border-slate-800 rounded-lg p-4 bg-black/40">
                                    <div className="space-y-4">
                                        {Object.entries(convertedMenu).map(([key, section]: [string, any]) => (
                                            <div key={key} className="space-y-2">
                                                <h4 className="text-neon-magenta font-bold uppercase text-xs tracking-widest">{section.title}</h4>
                                                {section.categories.map((cat: any, cIdx: number) => (
                                                    <div key={cIdx} className="pl-4 space-y-1">
                                                        <h5 className="text-slate-400 text-xs font-bold">{cat.title}</h5>
                                                        {cat.items.slice(0, 5).map((item: any, iIdx: number) => (
                                                            <div key={iIdx} className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                                                                <span className="text-slate-200">{item.name}</span>
                                                                <span className="text-neon-gold font-bold">{item.price || item.fullPrice || (item.sizes ? item.sizes[0] : "N/A")}</span>
                                                            </div>
                                                        ))}
                                                        {cat.items.length > 5 && (
                                                            <p className="text-[10px] text-slate-500 italic pl-2">... and {cat.items.length - 5} more items</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="saved" className="mt-6">
                        <ScrollArea className="h-[60vh] pr-4">
                            {isLoading && savedMenus.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
                                </div>
                            ) : savedMenus.length === 0 ? (
                                <div className="text-center py-20 text-slate-500 space-y-4">
                                    <ShoppingBag className="h-16 w-16 mx-auto opacity-20" />
                                    <p className="text-lg">No delivery menus saved yet.</p>
                                    <Button variant="link" onClick={() => setActiveTab("convert")} className="text-neon-cyan">
                                        Create your first platform menu
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {savedMenus.map((item) => (
                                        <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <CardTitle className="text-white text-lg font-bold">{item.platform_name}</CardTitle>
                                                            <span className="bg-neon-cyan/20 text-neon-cyan text-[10px] px-2 py-0.5 rounded font-bold">
                                                                {item.markup_percentage}% Markup
                                                            </span>
                                                        </div>
                                                        <CardDescription className="text-slate-400 mt-1 flex items-center gap-2 text-xs">
                                                            {format(new Date(item.created_at), "PPP p")}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => exportToCSV(item.menu_data)}
                                                            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                                        >
                                                            <FileSpreadsheet className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {item.notes && <p className="text-sm text-slate-300 italic mb-2">"{item.notes}"</p>}
                                                <div className="flex justify-between items-center text-xs text-slate-500">
                                                    <span>Categories: {Object.values(item.menu_data).reduce((acc: number, s: any) => acc + (s.categories?.length || 0), 0) as number}</span>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => {
                                                            setConvertedMenu(item.menu_data);
                                                            setPlatform(item.platform_name);
                                                            setMarkup(item.markup_percentage);
                                                            setNotes(item.notes || "");
                                                            setActiveTab("convert");
                                                            toast.info("Menu loaded into preview for editing/resaving");
                                                        }}
                                                        className="text-neon-cyan h-auto p-0"
                                                    >
                                                        View & Edit
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>

            <DineoutPreview
                isOpen={isDineoutPreviewOpen}
                onClose={() => setIsDineoutPreviewOpen(false)}
                menuData={menuData}
                platform={platform}
                markup={markup}
            />
        </Dialog>
    );
};
