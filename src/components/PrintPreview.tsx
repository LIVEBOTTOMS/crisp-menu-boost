import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Printer, FileImage, FileText, X } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { MenuSection as MenuSectionType, MenuCategory as MenuCategoryType, MenuItem } from "@/data/menuData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

// HTML entity escaping to prevent XSS in PDF export
const escapeHtml = (text: string | undefined | null): string => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemRow = ({ item, isEven }: { item: MenuItem; isEven: boolean }) => {
  const hasSizes = item.sizes && item.sizes.length > 0;
  const hasHalfFull = item.halfPrice && item.fullPrice;

  return (
    <div className={`py-3 px-4 ${isEven ? "bg-white/[0.02]" : ""}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="text-[15px] font-semibold text-white tracking-wide uppercase">
            {item.name}
          </h4>
          {item.description && (
            <p className="text-[11px] text-gray-400 mt-1 italic leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {hasSizes ? (
            <div className="flex gap-4">
              {item.sizes!.map((size, i) => (
                <span key={i} className="text-[13px] font-medium text-amber-400 min-w-[50px] text-center">
                  {size}
                </span>
              ))}
            </div>
          ) : hasHalfFull ? (
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Half</span>
                <span className="text-[13px] font-medium text-amber-400">{item.halfPrice}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Full</span>
                <span className="text-[13px] font-medium text-amber-400">{item.fullPrice}</span>
              </div>
            </div>
          ) : (
            <span className="text-[14px] font-semibold text-amber-400">{item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryBlock = ({ category, index }: { category: MenuCategoryType; index: number }) => {
  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-700/50">
        {category.icon && <span className="text-lg">{category.icon}</span>}
        <h3 className="text-[13px] font-bold tracking-[0.2em] uppercase text-cyan-400">
          {category.title}
        </h3>
      </div>
      
      {/* Size Headers for drinks */}
      {category.items[0]?.sizes && (
        <div className="flex justify-end gap-4 px-4 pb-2 border-b border-gray-800">
          <span className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">30ml</span>
          <span className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">60ml</span>
          <span className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">90ml</span>
          <span className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">180ml</span>
        </div>
      )}
      
      {/* Items */}
      <div className="divide-y divide-gray-800/50">
        {category.items.map((item, idx) => (
          <MenuItemRow key={item.name} item={item} isEven={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

const PrintablePage = ({ 
  section, 
  pageRef,
  variant,
  pageNumber,
  totalPages
}: { 
  section: MenuSectionType; 
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
  pageNumber: number;
  totalPages: number;
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";
  
  return (
    <div 
      ref={pageRef}
      className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* Elegant Border */}
      <div className="absolute inset-4 border border-gray-700/30 pointer-events-none" />
      <div className="absolute inset-6 border border-gray-700/20 pointer-events-none" />
      
      {/* Header */}
      <div className="pt-12 pb-6 text-center">
        <div className="mb-2">
          <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">Est. 2024</span>
        </div>
        <h1 className="text-4xl font-bold tracking-[0.15em] text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          LIVE BAR
        </h1>
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gray-600" />
          <div className="w-2 h-2 rotate-45 border border-gray-600" />
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gray-600" />
        </div>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Fine Dining & Premium Spirits • Pune</p>
      </div>

      {/* Section Title */}
      <div className="text-center mb-6 px-12">
        <div className="inline-block">
          <h2 
            className="text-xl font-bold tracking-[0.2em] uppercase mb-2"
            style={{ color: accentColor, fontFamily: "'Orbitron', sans-serif" }}
          >
            {section.title}
          </h2>
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-10 pb-8">
        <div className={`grid gap-6 ${section.categories.length >= 2 ? "grid-cols-2" : "grid-cols-1 max-w-lg mx-auto"}`}>
          {section.categories.map((category, index) => (
            <CategoryBlock key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-[1px] w-16 bg-gray-700" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-500/50" />
          <div className="h-[1px] w-16 bg-gray-700" />
        </div>
        <p className="text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-1">
          All prices inclusive of applicable taxes
        </p>
        <p className="text-[9px] text-gray-600">
          Page {pageNumber} of {totalPages}
        </p>
      </div>
    </div>
  );
};

export const PrintPreview = ({ isOpen, onClose }: PrintPreviewProps) => {
  const { menuData } = useMenu();
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = [
    { section: menuData.snacksAndStarters, variant: "cyan" as const, key: "snacks" },
    { section: menuData.foodMenu, variant: "magenta" as const, key: "food" },
    { section: menuData.beveragesMenu, variant: "cyan" as const, key: "beverages" },
    { section: menuData.sideItems, variant: "gold" as const, key: "sides" },
  ];

  const capturePageAtIndex = async (index: number): Promise<HTMLCanvasElement | null> => {
    // First make sure the page is visible for capture
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);

    const page = pages[index];
    const pageElement = document.createElement("div");
    pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column;">
        <div style="position: absolute; inset: 16px; border: 1px solid rgba(55,65,81,0.3); pointer-events: none;"></div>
        <div style="position: absolute; inset: 24px; border: 1px solid rgba(55,65,81,0.2); pointer-events: none;"></div>
        
        <div style="padding-top: 48px; padding-bottom: 24px; text-align: center;">
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; letter-spacing: 0.4em; color: #6b7280; text-transform: uppercase;">Est. 2024</span>
          </div>
          <h1 style="font-size: 36px; font-weight: bold; letter-spacing: 0.15em; color: white; margin-bottom: 8px; font-family: 'Orbitron', sans-serif;">LIVE BAR</h1>
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
            <div style="height: 1px; width: 80px; background: linear-gradient(to right, transparent, #4b5563);"></div>
            <div style="width: 8px; height: 8px; transform: rotate(45deg); border: 1px solid #4b5563;"></div>
            <div style="height: 1px; width: 80px; background: linear-gradient(to left, transparent, #4b5563);"></div>
          </div>
          <p style="font-size: 10px; letter-spacing: 0.3em; color: #9ca3af; text-transform: uppercase;">Fine Dining & Premium Spirits • Pune</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 24px; padding: 0 48px;">
          <div style="display: inline-block;">
            <h2 style="font-size: 20px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; color: ${page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700"}; font-family: 'Orbitron', sans-serif;">
              ${escapeHtml(page.section.title)}
            </h2>
            <div style="height: 2px; width: 100%; background: linear-gradient(90deg, transparent, ${page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700"}, transparent);"></div>
          </div>
        </div>
        
        <div style="flex: 1; padding: 0 40px 32px;">
          <div style="display: grid; grid-template-columns: ${page.section.categories.length >= 2 ? "1fr 1fr" : "1fr"}; gap: 24px; ${page.section.categories.length < 2 ? "max-width: 512px; margin: 0 auto;" : ""}">
            ${page.section.categories.map((category, catIdx) => `
              <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(55,65,81,0.5);">
                  ${category.icon ? `<span style="font-size: 18px;">${escapeHtml(category.icon)}</span>` : ""}
                  <h3 style="font-size: 13px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #00f0ff;">${escapeHtml(category.title)}</h3>
                </div>
                ${category.items[0]?.sizes ? `
                  <div style="display: flex; justify-content: flex-end; gap: 16px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">30ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">60ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">90ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">180ml</span>
                  </div>
                ` : ""}
                <div>
                  ${category.items.map((item, idx) => `
                    <div style="padding: 12px 16px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.02);" : ""}">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                        <div style="flex: 1;">
                          <h4 style="font-size: 15px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase;">${escapeHtml(item.name)}</h4>
                          ${item.description ? `<p style="font-size: 11px; color: #9ca3af; margin-top: 4px; font-style: italic; line-height: 1.5;">${escapeHtml(item.description)}</p>` : ""}
                        </div>
                        <div style="flex-shrink: 0; text-align: right;">
                          ${item.sizes ? `
                            <div style="display: flex; gap: 16px;">
                              ${item.sizes.map(size => `<span style="font-size: 13px; font-weight: 500; color: #fbbf24; min-width: 50px; text-align: center;">${escapeHtml(size)}</span>`).join("")}
                            </div>
                          ` : item.halfPrice && item.fullPrice ? `
                            <div style="display: flex; gap: 16px; align-items: center;">
                              <div style="text-align: center;">
                                <span style="font-size: 9px; color: #6b7280; display: block; text-transform: uppercase; letter-spacing: 0.1em;">Half</span>
                                <span style="font-size: 13px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.halfPrice)}</span>
                              </div>
                              <div style="text-align: center;">
                                <span style="font-size: 9px; color: #6b7280; display: block; text-transform: uppercase; letter-spacing: 0.1em;">Full</span>
                                <span style="font-size: 13px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.fullPrice)}</span>
                              </div>
                            </div>
                          ` : `
                            <span style="font-size: 14px; font-weight: 600; color: #fbbf24;">${escapeHtml(item.price)}</span>
                          `}
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        
        <div style="padding-bottom: 32px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
            <div style="height: 1px; width: 64px; background: #374151;"></div>
            <div style="width: 6px; height: 6px; transform: rotate(45deg); background: rgba(245,158,11,0.5);"></div>
            <div style="height: 1px; width: 64px; background: #374151;"></div>
          </div>
          <p style="font-size: 9px; letter-spacing: 0.2em; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">All prices inclusive of applicable taxes</p>
          <p style="font-size: 9px; color: #4b5563;">Page ${index + 1} of ${pages.length}</p>
        </div>
      </div>
    `;
    tempDiv.appendChild(pageElement);

    try {
      const canvas = await html2canvas(pageElement.firstElementChild as HTMLElement, {
        scale: 3,
        backgroundColor: "#0a0a0f",
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123,
      });
      document.body.removeChild(tempDiv);
      return canvas;
    } catch (error) {
      document.body.removeChild(tempDiv);
      return null;
    }
  };

  const downloadCurrentAsImage = async (format: "png" | "jpg") => {
    setIsExporting(true);
    try {
      const canvas = await capturePageAtIndex(currentPage);
      if (!canvas) throw new Error("Failed to capture");
      
      const link = document.createElement("a");
      link.download = `menu-${pages[currentPage].key}.${format}`;
      link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 1.0);
      link.click();
      toast.success(`Page downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAllAsImages = async (format: "png" | "jpg") => {
    setIsExporting(true);
    try {
      for (let i = 0; i < pages.length; i++) {
        toast.info(`Exporting page ${i + 1} of ${pages.length}...`);
        const canvas = await capturePageAtIndex(i);
        if (canvas) {
          const link = document.createElement("a");
          link.download = `menu-${pages[i].key}.${format}`;
          link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 1.0);
          link.click();
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      toast.success(`All ${pages.length} pages downloaded`);
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsPDF = async (allPages: boolean) => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123],
      });

      const pagesToExport = allPages ? pages.map((_, i) => i) : [currentPage];

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageIndex = pagesToExport[i];
        toast.info(`Processing page ${i + 1} of ${pagesToExport.length}...`);
        const canvas = await capturePageAtIndex(pageIndex);
        if (canvas) {
          if (i > 0) pdf.addPage();
          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
        }
      }

      pdf.save(allPages ? "menu-complete.pdf" : `menu-${pages[currentPage].key}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to create PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const canvas = await capturePageAtIndex(currentPage);
      if (!canvas) throw new Error("Failed to capture");
      
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow popups for printing");
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Menu - ${pages[currentPage].section.title}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                @page { size: A4; margin: 0; }
              }
              body { display: flex; justify-content: center; margin: 0; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL()}" onload="setTimeout(function(){window.print();window.close();},300);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      toast.error("Failed to print");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-background border-border p-0 flex flex-col">
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-orbitron text-foreground">
              Print Preview - {pages[currentPage].section.title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="flex justify-center">
            <div className="shadow-2xl transform scale-[0.65] origin-top">
              <PrintablePage
                section={pages[currentPage].section}
                pageRef={{ current: null }}
                variant={pages[currentPage].variant}
                pageNumber={currentPage + 1}
                totalPages={pages.length}
              />
            </div>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {pages.map((page, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 h-8 rounded text-xs font-medium transition-colors ${
                      i === currentPage 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {page.key.charAt(0).toUpperCase() + page.key.slice(1)}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                disabled={currentPage === pages.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadCurrentAsImage("png")}
                disabled={isExporting}
              >
                <FileImage className="w-4 h-4 mr-1" />
                PNG
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadAllAsImages("png")}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-1" />
                All PNG
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadAsPDF(false)}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button 
                size="sm" 
                onClick={() => downloadAsPDF(true)}
                disabled={isExporting}
                className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50"
              >
                <FileText className="w-4 h-4 mr-1" />
                Full Menu PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                disabled={isExporting}
              >
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
          {isExporting && (
            <p className="text-sm text-muted-foreground mt-2 text-center">Generating high-quality export...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
