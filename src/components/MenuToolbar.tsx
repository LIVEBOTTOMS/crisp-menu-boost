import { useState } from "react";
import { Download, Edit, Percent, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMenu } from "@/contexts/MenuContext";
import { PrintPreview } from "./PrintPreview";
import { toast } from "sonner";

export const MenuToolbar = () => {
  const { isEditMode, setIsEditMode, adjustPrices, resetToOriginal } = useMenu();
  const [pricePercent, setPricePercent] = useState("");
  const [priceScope, setPriceScope] = useState("all");
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const handlePriceAdjust = () => {
    const percent = parseFloat(pricePercent);
    if (isNaN(percent)) {
      toast.error("Please enter a valid percentage");
      return;
    }
    
    if (priceScope === "all") {
      adjustPrices(percent);
    } else {
      adjustPrices(percent, priceScope);
    }
    
    toast.success(`Prices ${percent >= 0 ? "increased" : "decreased"} by ${Math.abs(percent)}%`);
    setIsPriceDialogOpen(false);
    setPricePercent("");
  };

  const handleReset = () => {
    resetToOriginal();
    toast.success("Menu reset to original");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2 flex-wrap justify-end">
        {/* Download/Print Preview */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsPrintPreviewOpen(true)}
          className="bg-background/80 backdrop-blur-sm border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download / Print
        </Button>

        {/* Price Adjustment Dialog */}
        <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm border-neon-gold/30 hover:border-neon-gold hover:bg-neon-gold/10">
              <Percent className="w-4 h-4 mr-2" />
              Adjust Prices
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-orbitron text-foreground">Adjust Prices</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label className="text-foreground">Percentage Change</Label>
                <Input
                  type="number"
                  placeholder="e.g., 10 for +10%, -5 for -5%"
                  value={pricePercent}
                  onChange={(e) => setPricePercent(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground">Apply To</Label>
                <Select value={priceScope} onValueChange={setPriceScope}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="snacksAndStarters">Snacks & Starters</SelectItem>
                    <SelectItem value="foodMenu">Food Menu</SelectItem>
                    <SelectItem value="beveragesMenu">Beverages & Spirits</SelectItem>
                    <SelectItem value="sideItems">Side Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handlePriceAdjust} className="bg-neon-gold/20 hover:bg-neon-gold/30 text-neon-gold border border-neon-gold/50">
                Apply Price Change
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Mode Toggle */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={isEditMode 
            ? "bg-neon-magenta/20 border-neon-magenta text-neon-magenta hover:bg-neon-magenta/30" 
            : "bg-background/80 backdrop-blur-sm border-neon-magenta/30 hover:border-neon-magenta hover:bg-neon-magenta/10"
          }
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditMode ? "Exit Edit" : "Edit Menu"}
        </Button>

        {/* Reset Button */}
        <Button variant="outline" size="sm" onClick={handleReset} className="bg-background/80 backdrop-blur-sm border-destructive/30 hover:border-destructive hover:bg-destructive/10">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <PrintPreview isOpen={isPrintPreviewOpen} onClose={() => setIsPrintPreviewOpen(false)} />
    </>
  );
};
