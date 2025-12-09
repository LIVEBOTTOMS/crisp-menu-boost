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
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-semibold text-white tracking-wide uppercase truncate">
            {item.name}
          </h4>
          {item.description && (
            <p className="text-[10px] text-gray-400 mt-1 italic leading-relaxed truncate">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right ml-2">
          {hasSizes ? (
            <div className="flex gap-2">
              {item.sizes!.map((size, i) => (
                <span key={i} className="text-[11px] font-medium text-amber-400 min-w-[32px] text-right">
                  {size}
                </span>
              ))}
            </div>
          ) : hasHalfFull ? (
            <div className="flex gap-3 items-center">
              <div className="text-center">
                <span className="text-[8px] text-gray-500 block uppercase tracking-wider">Half</span>
                <span className="text-[11px] font-medium text-amber-400">{item.halfPrice}</span>
              </div>
              <div className="text-center">
                <span className="text-[8px] text-gray-500 block uppercase tracking-wider">Full</span>
                <span className="text-[11px] font-medium text-amber-400">{item.fullPrice}</span>
              </div>
            </div>
          ) : (
            <span className="text-[12px] font-semibold text-amber-400">{item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryBlock = ({
  category,
  index,
  accentColor = "#00f0ff",
  dietIcon = null
}: {
  category: MenuCategoryType;
  index: number;
  accentColor?: string;
  dietIcon?: "veg" | "non-veg" | null;
}) => {
  return (
    <div className="mb-6">
      {/* Category Header with Holographic Gradient */}
      <div className="flex items-center gap-3 mb-3 pb-2 relative">
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)` }}
        />

        {category.icon && <span className="text-lg">{category.icon}</span>}

        <h3 className="text-[13px] font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          {category.title}
        </h3>

        {/* Veg/Non-Veg Indicator */}
        {dietIcon && (
          <div className={`ml-auto border border-current p-[2px] ${dietIcon === "veg" ? "text-green-500" : "text-red-500"}`}>
            <div className={`w-2 h-2 rounded-full ${dietIcon === "veg" ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        )}
      </div>

      {/* Size Headers for drinks */}
      {category.items[0]?.sizes && (
        <div className="flex justify-end gap-2 px-4 pb-2 border-b border-gray-800">
          {category.items[0].sizes.length === 4 ? (
            <>
              <span className="text-[8px] text-gray-400 min-w-[32px] text-right uppercase tracking-wider font-semibold">30ml</span>
              <span className="text-[8px] text-gray-400 min-w-[32px] text-right uppercase tracking-wider font-semibold">60ml</span>
              <span className="text-[8px] text-gray-400 min-w-[32px] text-right uppercase tracking-wider font-semibold">90ml</span>
              <span className="text-[8px] text-gray-400 min-w-[32px] text-right uppercase tracking-wider font-semibold">180ml</span>
            </>
          ) : (
            category.items[0].sizes.map((_, i) => (
              <span key={i} className="text-[8px] text-gray-500 min-w-[32px] text-right uppercase tracking-wider">
                Size {i + 1}
              </span>
            ))
          )}
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

// A4 dimensions at 96dpi: 794px x 1123px
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Cover Page Component
const CoverPage = ({ pageRef }: { pageRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        width: `${A4_WIDTH}px`,
        minHeight: `${A4_HEIGHT}px`,
        background: "radial-gradient(ellipse at center, #0f0f18 0%, #0a0a0f 70%)"
      }}
    >
      {/* Rain Effect Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.03) 50%, transparent 100%)",
          backgroundSize: "3px 20px",
          animation: "rain 0.5s linear infinite"
        }}
      />

      {/* Elegant Boundary System */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer Frame */}
        <div className="absolute inset-[12px] border border-gray-800/60" />
        
        {/* Inner Frame with Gradient */}
        <div className="absolute inset-[20px] border border-opacity-30" style={{ borderColor: "#00f0ff" }} />

        {/* Corner Accents - Larger for cover */}
        <div className="absolute top-[20px] left-[20px] w-24 h-24 border-l-2 border-t-2" style={{ borderColor: "#00f0ff" }} />
        <div className="absolute top-[20px] right-[20px] w-24 h-24 border-r-2 border-t-2" style={{ borderColor: "#ff00ff" }} />
        <div className="absolute bottom-[20px] left-[20px] w-24 h-24 border-l-2 border-b-2" style={{ borderColor: "#ff00ff" }} />
        <div className="absolute bottom-[20px] right-[20px] w-24 h-24 border-r-2 border-b-2" style={{ borderColor: "#00f0ff" }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <img
          src="/live_logo_actual.jpg"
          alt="LIVE"
          className="h-56 w-auto object-contain"
          style={{ 
            filter: "brightness(1.2) contrast(1.1) saturate(1.2)",
            boxShadow: "0 0 60px rgba(0,240,255,0.3), 0 0 120px rgba(255,0,255,0.2)"
          }}
        />
      </div>

      {/* Tagline */}
      <div className="relative z-10 flex items-center justify-center gap-4 mb-12">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span 
          className="text-xl tracking-[0.3em] uppercase font-bold text-white/90"
          style={{ fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 20px rgba(0,240,255,0.5)" }}
        >
          EAT . DRINK . CODE . REPEAT
        </span>
        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent via-magenta-500 to-transparent" />
      </div>

      {/* Decorative Utensils & Binary */}
      <div className="relative z-10 flex flex-col items-center opacity-60">
        <div className="flex gap-3 text-3xl text-white/80">
          <span>🍴</span>
          <span>🥄</span>
        </div>
        <div className="mt-4 text-[10px] text-cyan-400/60 tracking-widest font-mono">
          00110101001111010110110011
        </div>
        <div className="text-[10px] text-magenta-400/60 tracking-widest font-mono">
          01010101101101010111111011
        </div>
      </div>

      {/* Menu Text at Bottom */}
      <div className="absolute bottom-16 left-0 right-0 text-center z-10">
        <span 
          className="text-5xl font-bold tracking-[0.5em] uppercase"
          style={{ 
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(90deg, #00f0ff, #ff00ff, #00f0ff)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px rgba(0,240,255,0.3)"
          }}
        >
          MENU
        </span>
      </div>
    </div>
  );
};

const PrintablePage = ({
  section,
  pageRef,
  variant,
  pageNumber,
  totalPages,
  isFirstPage = false
}: {
  section: MenuSectionType;
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
  pageNumber: number;
  totalPages: number;
  isFirstPage?: boolean;
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] relative flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        width: `${A4_WIDTH}px`,
        minHeight: `${A4_HEIGHT}px`
      }}
    >
      {/* Elegant Boundary System - A4 Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer Frame */}
        <div className="absolute inset-[12px] border border-gray-800/60" />
        
        {/* Inner Frame with Accent */}
        <div className="absolute inset-[20px] border border-opacity-20" style={{ borderColor: accentColor }} />

        {/* Corner Accents */}
        <div className="absolute top-[20px] left-[20px] w-16 h-16 border-l-2 border-t-2" style={{ borderColor: accentColor }} />
        <div className="absolute top-[20px] right-[20px] w-16 h-16 border-r-2 border-t-2" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-[20px] left-[20px] w-16 h-16 border-l-2 border-b-2" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-[20px] right-[20px] w-16 h-16 border-r-2 border-b-2" style={{ borderColor: accentColor }} />
      </div>

      {/* Compact Header - Only on first page or section headers */}
      {isFirstPage && (
        <div className="pt-8 pb-4 text-center relative z-10">
          <div className="flex justify-center mb-3">
            <div className="relative p-2 border border-dashed border-gray-700 rounded-lg bg-black/40">
              <img
                src="/live_logo_actual.jpg"
                alt="LIVE"
                className="h-20 w-auto object-contain"
                style={{ filter: "brightness(1.2) contrast(1.1) saturate(1.1)" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/90" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              EAT . DRINK . CODE . REPEAT
            </span>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-magenta-500 to-transparent" />
          </div>
        </div>
      )}

      {/* Section Title - Compact */}
      <div className={`${isFirstPage ? 'mb-4' : 'pt-6 mb-4'} px-10 relative`}>
        <div className="absolute top-1/2 left-10 right-10 h-[1px] bg-gray-800 -z-10" />
        <div className="text-center">
          <span
            className="inline-block px-6 py-1.5 bg-[#0a0a0f] text-xl font-bold tracking-[0.2em] uppercase border-y border-gray-800"
            style={{
              color: accentColor,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 8px ${accentColor}55`
            }}
          >
            {section.title}
          </span>
        </div>
      </div>

      {/* Content - Two Column Layout for A4 */}
      <div className="flex-1 px-10 pb-6">
        <div className="grid grid-cols-2 gap-6">
          {section.categories.map((category, index) => {
            const isVeg = section.title.includes("VEG") && !section.title.includes("NON");
            const isNonVeg = section.title.includes("NON-VEG") || section.title.includes("MEAT") || section.title.includes("CHICKEN");
            const showDietIcon = isVeg || isNonVeg;

            return (
              <CategoryBlock
                key={category.title}
                category={category}
                index={index}
                accentColor={accentColor}
                dietIcon={showDietIcon ? (isVeg ? "veg" : "non-veg") : null}
              />
            );
          })}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="pb-4 text-center relative z-10">
        <div className="flex justify-between items-center px-12">
          <p className="text-[7px] tracking-[0.15em] text-gray-600 uppercase">LIVE BAR • PUNE</p>
          <p className="text-[10px] font-bold text-white/80" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {pageNumber} <span className="text-gray-600 text-[8px]">/ {totalPages}</span>
          </p>
          <p className="text-[7px] tracking-[0.15em] text-gray-600 uppercase">FINE DINING</p>
        </div>
      </div>
    </div>
  );
};

export const PrintPreview = ({ isOpen, onClose }: PrintPreviewProps) => {
  const { menuData } = useMenu();
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smart grouping for A4 pages - Consolidated for fewer pages
  const menuPages = [
    // Page 1: All Appetizers (Veg + Non-Veg)
    {
      section: {
        title: "APPETIZERS",
        categories: [
          menuData.snacksAndStarters.categories[0],
          menuData.snacksAndStarters.categories[1]
        ]
      },
      variant: "cyan" as const,
      key: "appetizers",
      isFirstPage: true
    },
    // Page 2: All Curries & Mains
    {
      section: {
        title: "SIGNATURE MAINS",
        categories: [
          menuData.foodMenu.categories[0],
          menuData.foodMenu.categories[1],
          menuData.foodMenu.categories[3],
          menuData.foodMenu.categories[2]
        ]
      },
      variant: "magenta" as const,
      key: "mains",
      isFirstPage: false
    },
    // Page 3: Sides & Rice
    {
      section: {
        title: "SIDES & ACCOMPANIMENTS",
        categories: [
          menuData.sideItems.categories[1],
          menuData.sideItems.categories[2],
          menuData.sideItems.categories[0]
        ]
      },
      variant: "magenta" as const,
      key: "sides",
      isFirstPage: false
    },
    // Page 4: Beers & Coolers
    {
      section: {
        title: "BEERS & COOLERS",
        categories: [
          menuData.beveragesMenu.categories[0],
          menuData.beveragesMenu.categories[1],
          menuData.beveragesMenu.categories[2]
        ]
      },
      variant: "cyan" as const,
      key: "beers",
      isFirstPage: false
    },
    // Page 5: Vodkas, Rums & Gin
    {
      section: {
        title: "SPIRITS COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[8],
          menuData.beveragesMenu.categories[3],
          menuData.beveragesMenu.categories[4],
          menuData.beveragesMenu.categories[10]
        ]
      },
      variant: "cyan" as const,
      key: "spirits",
      isFirstPage: false
    },
    // Page 6: All Whiskies
    {
      section: {
        title: "WHISKY COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[5],
          menuData.beveragesMenu.categories[6]
        ]
      },
      variant: "gold" as const,
      key: "whiskies",
      isFirstPage: false
    },
    // Page 7: Wines, Bottles & Liqueurs
    {
      section: {
        title: "WINES & PREMIUM",
        categories: [
          menuData.beveragesMenu.categories[9],
          menuData.beveragesMenu.categories[7],
          menuData.beveragesMenu.categories[11]
        ]
      },
      variant: "magenta" as const,
      key: "wines",
      isFirstPage: false
    },
    // Page 8: Refreshments
    {
      section: {
        title: "REFRESHMENTS",
        categories: [
          menuData.beveragesMenu.categories[12],
        ]
      },
      variant: "cyan" as const,
      key: "refreshments",
      isFirstPage: false
    },
  ];

  // Pages array with cover page first
  const pages = [
    { type: "cover" as const, key: "cover" },
    ...menuPages.map(p => ({ type: "menu" as const, ...p }))
  ];

  const capturePageAtIndex = async (index: number): Promise<HTMLCanvasElement | null> => {
    // First make sure the page is visible for capture
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);

    const page = pages[index];
    
    // Handle cover page separately
    if (page.type === "cover") {
      const pageElement = document.createElement("div");
      pageElement.innerHTML = `
        <div style="font-family: 'Rajdhani', sans-serif; background: radial-gradient(ellipse at center, #0f0f18 0%, #0a0a0f 70%); width: ${A4_WIDTH}px; min-height: ${A4_HEIGHT}px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;">
          
          <!-- Elegant Boundary System -->
          <div style="position: absolute; inset: 0; pointer-events: none;">
            <div style="position: absolute; inset: 12px; border: 1px solid rgba(55,65,81,0.6);"></div>
            <div style="position: absolute; inset: 20px; border: 1px solid rgba(0,240,255,0.3);"></div>
            <div style="position: absolute; top: 20px; left: 20px; width: 96px; height: 96px; border-left: 2px solid #00f0ff; border-top: 2px solid #00f0ff;"></div>
            <div style="position: absolute; top: 20px; right: 20px; width: 96px; height: 96px; border-right: 2px solid #ff00ff; border-top: 2px solid #ff00ff;"></div>
            <div style="position: absolute; bottom: 20px; left: 20px; width: 96px; height: 96px; border-left: 2px solid #ff00ff; border-bottom: 2px solid #ff00ff;"></div>
            <div style="position: absolute; bottom: 20px; right: 20px; width: 96px; height: 96px; border-right: 2px solid #00f0ff; border-bottom: 2px solid #00f0ff;"></div>
          </div>

          <!-- Logo -->
          <div style="margin-bottom: 32px; position: relative; z-index: 10;">
            <img src="/live_logo_actual.jpg" style="height: 224px; width: auto; display: block; filter: brightness(1.2) contrast(1.1) saturate(1.2); box-shadow: 0 0 60px rgba(0,240,255,0.3), 0 0 120px rgba(255,0,255,0.2);" />
          </div>

          <!-- Tagline -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 48px; position: relative; z-index: 10;">
            <div style="height: 1px; width: 96px; background: linear-gradient(to right, transparent, #06b6d4, transparent);"></div>
            <span style="font-size: 20px; letter-spacing: 0.3em; color: rgba(255,255,255,0.9); text-transform: uppercase; font-weight: bold; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 20px rgba(0,240,255,0.5);">EAT . DRINK . CODE . REPEAT</span>
            <div style="height: 1px; width: 96px; background: linear-gradient(to left, transparent, #d946ef, transparent);"></div>
          </div>

          <!-- Decorative Utensils & Binary -->
          <div style="display: flex; flex-direction: column; align-items: center; opacity: 0.6; position: relative; z-index: 10;">
            <div style="display: flex; gap: 12px; font-size: 30px; color: rgba(255,255,255,0.8);">
              <span>🍴</span>
              <span>🥄</span>
            </div>
            <div style="margin-top: 16px; font-size: 10px; color: rgba(6,182,212,0.6); letter-spacing: 0.2em; font-family: monospace;">00110101001111010110110011</div>
            <div style="font-size: 10px; color: rgba(217,70,239,0.6); letter-spacing: 0.2em; font-family: monospace;">01010101101101010111111011</div>
          </div>

          <!-- Menu Text at Bottom -->
          <div style="position: absolute; bottom: 64px; left: 0; right: 0; text-align: center; z-index: 10;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 0.5em; text-transform: uppercase; font-family: 'Orbitron', sans-serif; background: linear-gradient(90deg, #00f0ff, #ff00ff, #00f0ff); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MENU</span>
          </div>
        </div>
      `;
      tempDiv.appendChild(pageElement);

      try {
        const canvas = await html2canvas(pageElement.firstElementChild as HTMLElement, {
          scale: 2,
          backgroundColor: "#0a0a0f",
          useCORS: true,
          logging: false,
          width: A4_WIDTH,
          height: A4_HEIGHT,
        });
        document.body.removeChild(tempDiv);
        return canvas;
      } catch (error) {
        console.error("Canvas capture error:", error);
        document.body.removeChild(tempDiv);
        return null;
      }
    }

    // Menu page handling
    const accentColor = page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700";

    // Auto-detect Veg/Non-Veg for PDF generation
    const isVeg = page.section.title.includes("VEG") && !page.section.title.includes("NON");
    const isNonVeg = page.section.title.includes("NON-VEG") || page.section.title.includes("MEAT") || page.section.title.includes("CHICKEN");
    const showDietIcon = isVeg || isNonVeg;

    const isFirstPage = page.isFirstPage || false;
    const pageElement = document.createElement("div");
    // A4 Dimensions: 210mm x 297mm (~794px x 1123px at 96dpi)
    pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: ${A4_WIDTH}px; min-height: ${A4_HEIGHT}px; position: relative; display: flex; flex-direction: column; overflow: hidden;">
        
        <!-- Elegant Boundary System - A4 Optimized -->
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <!-- Outer Frame -->
          <div style="position: absolute; inset: 12px; border: 1px solid rgba(55,65,81,0.6);"></div>
          <!-- Inner Frame with Accent -->
          <div style="position: absolute; inset: 20px; border: 1px solid ${accentColor}33;"></div>
          <!-- Corner Accents -->
          <div style="position: absolute; top: 20px; left: 20px; width: 64px; height: 64px; border-left: 2px solid ${accentColor}; border-top: 2px solid ${accentColor};"></div>
          <div style="position: absolute; top: 20px; right: 20px; width: 64px; height: 64px; border-right: 2px solid ${accentColor}; border-top: 2px solid ${accentColor};"></div>
          <div style="position: absolute; bottom: 20px; left: 20px; width: 64px; height: 64px; border-left: 2px solid ${accentColor}; border-bottom: 2px solid ${accentColor};"></div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 64px; height: 64px; border-right: 2px solid ${accentColor}; border-bottom: 2px solid ${accentColor};"></div>
        </div>

        ${isFirstPage ? `
        <!-- Compact Header - Only on first page -->
        <div style="padding-top: 24px; padding-bottom: 12px; text-align: center; position: relative; z-index: 10;">
          <div style="display: flex; justify-content: center; margin-bottom: 8px;">
            <div style="padding: 6px; border: 1px dashed #374151; border-radius: 8px; background: rgba(0,0,0,0.4);">
              <img src="/live_logo_actual.jpg" style="height: 72px; width: auto; display: block; filter: brightness(1.2) contrast(1.1) saturate(1.1);" />
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div style="height: 1px; width: 60px; background: linear-gradient(to right, transparent, #06b6d4, transparent);"></div>
            <span style="font-size: 8px; letter-spacing: 0.2em; color: rgba(255,255,255,0.9); text-transform: uppercase; font-weight: bold; font-family: 'Orbitron', sans-serif;">EAT . DRINK . CODE . REPEAT</span>
            <div style="height: 1px; width: 60px; background: linear-gradient(to left, transparent, #d946ef, transparent);"></div>
          </div>
        </div>
        ` : ''}

        <!-- Section Title - Compact -->
        <div style="${isFirstPage ? 'margin-bottom: 16px;' : 'padding-top: 24px; margin-bottom: 16px;'} padding-left: 40px; padding-right: 40px; position: relative; text-align: center;">
          <div style="position: absolute; top: 50%; left: 40px; right: 40px; height: 1px; background-color: #1f2937; z-index: 0;"></div>
          <span style="display: inline-block; padding: 5px 20px; background-color: #0a0a0f; font-size: 18px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; border-top: 1px solid #1f2937; border-bottom: 1px solid #1f2937; color: ${accentColor}; font-family: 'Orbitron', sans-serif; position: relative; z-index: 1; text-shadow: 0 0 8px ${accentColor}55;">
            ${escapeHtml(page.section.title)}
          </span>
        </div>

        <!-- Content - Two Column Layout for A4 -->
        <div style="flex: 1; padding-left: 32px; padding-right: 32px; padding-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${page.section.categories.map((category, catIdx) => `
            <div style="margin-bottom: 16px; break-inside: avoid;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; padding-bottom: 3px; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}66, transparent);"></div>
                ${category.icon ? `<span style="font-size: 14px;">${escapeHtml(category.icon)}</span>` : ""}
                <h3 style="font-size: 11px; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; color: ${accentColor}; margin: 0;">${escapeHtml(category.title)}</h3>
              </div>
              ${category.items[0]?.sizes ? `
                <div style="display: flex; justify-content: flex-end; gap: 6px; padding: 0 6px 6px; border-bottom: 1px solid rgba(31,41,55,0.8);">
                  ${category.items[0].sizes.length === 4 ? `
                    <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 30px;">30ml</span>
                    <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 30px;">60ml</span>
                    <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 30px;">90ml</span>
                    <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 30px;">180ml</span>
                  ` : `
                    ${category.items[0].sizes.map((_, i) => `<span style="font-size: 7px; color: #9ca3af; text-align: right; width: 30px;">Size ${i + 1}</span>`).join("")}
                  `}
                </div>
              ` : category.items[0]?.halfPrice ? `
                <div style="display: flex; justify-content: flex-end; gap: 8px; padding: 0 6px 6px; border-bottom: 1px solid rgba(31,41,55,0.8);">
                  <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Half</span>
                  <span style="font-size: 7px; color: #9ca3af; text-align: right; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Full</span>
                </div>
              ` : ""}
              <div style="display: flex; flex-direction: column; margin-top: 3px;">
                ${category.items.map((item, idx) => `
                  <div style="padding: 4px 6px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.015);" : ""}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">
                      <div style="flex: 1; min-width: 0; max-width: 65%;">
                        <h4 style="font-size: 10px; font-weight: 600; color: white; letter-spacing: 0.02em; text-transform: uppercase; margin: 0; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.name)}</h4>
                        ${item.description ? `<p style="font-size: 7px; color: #9ca3af; margin: 1px 0 0 0; font-style: italic; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.description)}</p>` : ""}
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        ${item.sizes ? `
                          <div style="display: flex; gap: 6px; justify-content: flex-end;">
                            ${item.sizes.map(size => `<span style="font-size: 9px; font-weight: 500; color: #fbbf24; width: 30px; text-align: right;">${escapeHtml(size)}</span>`).join("")}
                          </div>
                        ` : item.halfPrice && item.fullPrice ? `
                          <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
                            <span style="font-size: 9px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.halfPrice)}</span>
                            <span style="font-size: 9px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.fullPrice)}</span>
                          </div>
                        ` : `
                          <span style="font-size: 10px; font-weight: 600; color: #fbbf24;">${escapeHtml(item.price)}</span>
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

        <!-- Minimal Footer -->
        <div style="padding-bottom: 16px; text-align: center; position: relative; z-index: 10;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 48px;">
            <p style="font-size: 7px; letter-spacing: 0.12em; color: #4b5563; text-transform: uppercase; margin: 0;">LIVE BAR • PUNE</p>
            <p style="font-size: 10px; font-weight: bold; color: rgba(255,255,255,0.8); font-family: 'Orbitron', sans-serif; margin: 0;">
              ${index + 1} <span style="font-size: 8px; color: #4b5563;">/ ${pages.length}</span>
            </p>
            <p style="font-size: 7px; letter-spacing: 0.12em; color: #4b5563; text-transform: uppercase; margin: 0;">FINE DINING</p>
          </div>
        </div>
      </div>
    `;
    tempDiv.appendChild(pageElement);

    // Wait for images to load explicitly to ensure they are captured
    const images = Array.from(pageElement.getElementsByTagName("img"));
    await Promise.all(images.map((img: any) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(null);
        img.onerror = () => resolve(null);
        // Force resolve after 1s to prevent hanging
        setTimeout(() => resolve(null), 1000);
      });
    }));

    try {
      const canvas = await html2canvas(pageElement.firstElementChild as HTMLElement, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
        logging: false,
        width: A4_WIDTH,
        height: A4_HEIGHT,
      });
      document.body.removeChild(tempDiv);
      return canvas;
    } catch (error) {
      console.error("Canvas capture error:", error);
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
          await new Promise(resolve => setTimeout(resolve, 500));
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
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pagesToExport = allPages ? pages.map((_, i) => i) : [currentPage];
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      let pagesAdded = 0;

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageIndex = pagesToExport[i];
        toast.info(allPages ? `Processing page ${i + 1} of ${pages.length}...` : "Generating PDF...", {
          duration: 2000,
        });

        // Wait a bit to ensure browser doesn't freeze and DOM is ready
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await capturePageAtIndex(pageIndex);
        if (canvas) {
          if (pagesAdded > 0) pdf.addPage();

          // Use JPEG with high quality to ensure valid image data
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
          pagesAdded++;
        }
      }

      if (pagesAdded > 0) {
        const fileName = allPages ? "LiveBar-Full-Menu.pdf" : `LiveBar-Menu-${pages[currentPage].key}.pdf`;

        // Manual Blob download for maximum compatibility
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;
        const simpleName = allPages ? "LiveBar_Full_Menu.pdf" : "LiveBar_Page.pdf";
        link.setAttribute('download', simpleName); // Explicit attribute
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);

        toast.success("PDF downloaded successfully!");
      } else {
        throw new Error("No valid pages could be generated");
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to create PDF. Please try again.");
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

      const currentPageData = pages[currentPage];
      const pageTitle = currentPageData.type === "cover" ? "Cover" : currentPageData.section.title;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Menu - ${pageTitle}</title>
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

  const getCurrentPageTitle = () => {
    const currentPageData = pages[currentPage];
    return currentPageData.type === "cover" ? "Cover Page" : currentPageData.section.title;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-background border-border p-0 flex flex-col">
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-orbitron text-foreground">
              Print Preview - {getCurrentPageTitle()}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="flex justify-center">
            <div className="shadow-2xl transform scale-[0.5] origin-top">
              {pages[currentPage].type === "cover" ? (
                <CoverPage pageRef={{ current: null }} />
              ) : (
                <PrintablePage
                  section={pages[currentPage].section}
                  pageRef={{ current: null }}
                  variant={pages[currentPage].variant}
                  pageNumber={currentPage + 1}
                  totalPages={pages.length}
                  isFirstPage={pages[currentPage].isFirstPage}
                />
              )}
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
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${currentPage === i ? "bg-primary" : "bg-muted"
                      }`}
                  />
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
            <div className="flex items-center gap-2">
              <div className="flex gap-1 border-r border-border pr-2 mr-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  disabled={isExporting}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCurrentAsImage("png")}
                disabled={isExporting}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Current PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsPDF(false)}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                Current PDF
              </Button>
              <Button
                onClick={() => downloadAsPDF(true)}
                disabled={isExporting}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Full PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
