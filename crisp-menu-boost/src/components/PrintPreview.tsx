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
        <div className="flex justify-end gap-4 px-4 pb-2 border-b border-gray-800">
          {category.items[0].sizes.length === 4 ? (
            <>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">30ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">60ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">90ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">180ml</span>
            </>
          ) : (
            category.items[0].sizes.map((_, i) => (
              <span key={i} className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">
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

// Cover Page Component
const CoverPage = ({
  pageRef,
  variant
}: {
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col overflow-hidden items-center justify-center"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* Enhanced Border Frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-[12px] border-2" style={{ borderColor: `${accentColor}60`, boxShadow: `inset 0 0 50px ${accentColor}15` }} />

        {/* Animated Corner Accents */}
        <div className="absolute top-[12px] left-[12px] w-32 h-32">
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 left-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute top-[12px] right-[12px] w-32 h-32">
          <div className="absolute top-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 right-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute bottom-[12px] left-[12px] w-32 h-32">
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 left-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute bottom-[12px] right-[12px] w-32 h-32">
          <div className="absolute bottom-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 right-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
        </div>
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-magenta-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
          <img
            src="/live_cover_logo.jpg"
            alt="LIVE - Bar & Kitchen"
            className="relative w-[600px] h-auto drop-shadow-2xl"
            style={{ filter: "brightness(1.1) contrast(1.1)" }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
          <div className="w-4 h-4 rotate-45" style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
          <div className="w-32 h-[2px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}, transparent)` }} />
        </div>

        {/* Restaurant Info */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-[0.3em] text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
            Bar & Kitchen
          </h2>

          <div className="space-y-2">
            <p className="text-base tracking-[0.2em] text-gray-300 uppercase font-medium">
              Premium Dining & Spirits
            </p>
            <p className="text-sm tracking-[0.15em] text-gray-400">
              Opp Pune Bakery, Wakad, Pune
            </p>
          </div>

          {/* Contact Information */}
          <div className="pt-6 space-y-3 border-t border-gray-700/50">
            <p className="text-sm text-cyan-400 tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              www.livebar.in
            </p>
            <p className="text-xs text-gray-500 tracking-wide">
              Reservations: +91 7507066880
            </p>
          </div>

          {/* QR Code Placeholder (Optional) */}
          <div className="pt-8">
            <p className="text-xs tracking-[0.25em] text-gray-600 uppercase">
              Menu • {new Date().getFullYear()}
            </p>
          </div>
        </div>
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
  isCover = false
}: {
  section: MenuSectionType;
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
  pageNumber: number;
  totalPages: number;
  isCover?: boolean;
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  // Render cover page
  if (isCover) {
    return <CoverPage pageRef={pageRef} variant={variant} />;
  }

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* World-Class Boundary System - A4 Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer Frame */}
        <div className="absolute inset-[12px] border border-gray-800/60" />

        {/* Inner Frame with Accent Glow */}
        <div
          className="absolute inset-[20px] border-2"
          style={{
            borderColor: `${accentColor}40`,
            boxShadow: `inset 0 0 30px ${accentColor}10`
          }}
        />

        {/* Corner Accents - Premium Tech Style */}
        <div className="absolute top-[20px] left-[20px] w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute top-[20px] right-[20px] w-20 h-20">
          <div className="absolute top-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute bottom-[20px] left-[20px] w-20 h-20">
          <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute bottom-[20px] right-[20px] w-20 h-20">
          <div className="absolute bottom-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        {/* Side Circuit Lines */}
        <div className="absolute top-1/2 left-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
        <div className="absolute top-1/2 right-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(-90deg, ${accentColor}80, transparent)` }} />
      </div>

      {/* ENHANCED HEADER - Compact & Premium */}
      <div className="pt-6 pb-3 text-center relative z-10 flex-shrink-0">
        <div className="flex items-center justify-center gap-6">
          {/* Left Decorative Line */}
          <div className="flex-1 max-w-[120px] h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60)` }} />

          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <img
              src="/live_header_logo.png"
              alt="LIVE - Bar & Kitchen"
              className="h-16 w-auto"
              style={{ filter: "brightness(1.1) contrast(1.05)" }}
            />
          </div>

          {/* Right Decorative Line */}
          <div className="flex-1 max-w-[120px] h-[1px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}60)` }} />
        </div>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <span className="text-[8px] tracking-[0.3em] uppercase text-cyan-400/80 font-semibold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Eat • Drink • Code • Repeat
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-magenta-500/50 to-transparent" />
        </div>
      </div>

      {/* Section Title - Always at Top */}
      <div className="mb-4 px-12 relative flex-shrink-0">
        <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-gray-800/50 -z-10" />
        <div className="text-center">
          <span
            className="inline-block px-10 py-2 bg-[#0a0a0f] text-2xl font-bold tracking-[0.3em] uppercase"
            style={{
              color: accentColor,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 20px ${accentColor}40`,
              borderTop: `1px solid ${accentColor}30`,
              borderBottom: `1px solid ${accentColor}30`
            }}
          >
            {section.title}
          </span>
        </div>
      </div>

      {/* Content Area - Expanded for A4 */}
      <div className="flex-1 px-12 pb-6 overflow-hidden">
        <div className="max-w-2xl mx-auto h-full">
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

      {/* ENHANCED FOOTER - Premium & Informative */}
      <div className="py-4 px-12 relative z-10 flex-shrink-0 border-t border-gray-800/30">
        <div className="flex justify-between items-center">
          {/* Left - Location */}
          <div className="text-left flex-1">
            <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">Live Bar & Kitchen</p>
            <p className="text-[8px] text-gray-600">Pune, Maharashtra</p>
          </div>

          {/* Center - Page Number */}
          <div className="text-center flex-shrink-0 px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50)` }} />
              <div className="flex flex-col items-center">
                <p className="text-[7px] uppercase tracking-widest mb-0.5" style={{ color: accentColor }}>Page</p>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {String(pageNumber).padStart(2, '0')}
                  <span className="text-gray-600 text-xs ml-1">/ {String(totalPages).padStart(2, '0')}</span>
                </p>
              </div>
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}50)` }} />
            </div>
          </div>

          {/* Right - Contact */}
          <div className="text-right flex-1">
            <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">Premium Dining</p>
            <p className="text-[8px] text-gray-600">www.livebar.in</p>
          </div>
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

  // Optimized A4 page layout - 9 pages total (1 cover + 8 menu pages)
  const pages = [
    // Page 0: COVER PAGE
    {
      section: {
        title: "COVER",
        categories: []
      },
      variant: "cyan" as const,
      key: "cover",
      isCover: true
    },
    // Page 1: ALL APPETIZERS (Veg + Non-Veg)
    {
      section: {
        title: "ARTISAN APPETIZERS",
        categories: [
          menuData.snacksAndStarters.categories[0], // VEG
          menuData.snacksAndStarters.categories[1]  // NON-VEG
        ]
      },
      variant: "cyan" as const,
      key: "appetizers-all"
    },
    // Page 2: CURRIES & MAINS
    {
      section: {
        title: "SIGNATURE MAINS",
        categories: [
          menuData.foodMenu.categories[0], // Handi & Firepot
          menuData.foodMenu.categories[1], // Mutton
          menuData.foodMenu.categories[2]  // Thalis
        ]
      },
      variant: "magenta" as const,
      key: "food-mains"
    },
    // Page 3: VEG MAINS & SIDES
    {
      section: {
        title: "VEGETARIAN & SIDES",
        categories: [
          menuData.foodMenu.categories[3],    // Veg Chef's Mains
          menuData.sideItems.categories[1],   // Bar Bites
          menuData.sideItems.categories[2]    // Rice
        ]
      },
      variant: "magenta" as const,
      key: "veg-sides"
    },
    // Page 4: BEERS & COOLERS
    {
      section: {
        title: "CRAFT BREWS & COOLERS",
        categories: [
          menuData.beveragesMenu.categories[0], // Large Beers
          menuData.beveragesMenu.categories[1], // Pints
          menuData.beveragesMenu.categories[2]  // Breezers
        ]
      },
      variant: "cyan" as const,
      key: "beers-coolers"
    },
    // Page 5: VODKAS, RUMS & SPIRITS
    {
      section: {
        title: "SPIRITS COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[8], // Premium Vodkas
          menuData.beveragesMenu.categories[3], // Crystal Vodkas
          menuData.beveragesMenu.categories[4], // Rums
          menuData.beveragesMenu.categories[10] // Gin & Brandy
        ]
      },
      variant: "cyan" as const,
      key: "spirits"
    },
    // Page 6: WHISKIES (Indian + World)
    {
      section: {
        title: "WHISKY COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[5], // Indian Reserves
          menuData.beveragesMenu.categories[6]  // World Whiskies
        ]
      },
      variant: "gold" as const,
      key: "whiskies"
    },
    // Page 7: CELEBRATION BOTTLES & WINES
    {
      section: {
        title: "PREMIUM SELECTION",
        categories: [
          menuData.beveragesMenu.categories[7],  // Celebration Bottles
          menuData.beveragesMenu.categories[9],  // Wines
          menuData.beveragesMenu.categories[11]  // Liqueurs
        ]
      },
      variant: "gold" as const,
      key: "premium"
    },
    // Page 8: REFRESHMENTS
    {
      section: {
        title: "REFRESHMENTS",
        categories: [
          menuData.sideItems.categories[0],       // Water/Soda
          menuData.beveragesMenu.categories[12]   // Soft Drinks
        ]
      },
      variant: "cyan" as const,
      key: "refreshments"
    },
  ];

  const capturePageAtIndex = async (index: number): Promise<HTMLCanvasElement | null> => {
    // First make sure the page is visible for capture
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);

    const page = pages[index];
    const accentColor = page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700";

    // Auto-detect Veg/Non-Veg for PDF generation
    const isVeg = page.section.title.includes("VEG") && !page.section.title.includes("NON");
    const isNonVeg = page.section.title.includes("NON-VEG") || page.section.title.includes("MEAT") || page.section.title.includes("CHICKEN");
    const showDietIcon = isVeg || isNonVeg;

    const pageElement = document.createElement("div");

    // Check if this is the cover page
    if ((page as any).isCover) {
      // Cover Page HTML
      pageElement.innerHTML = `
        <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column; overflow: hidden; align-items: center; justify-content: center;">
          
          <!-- Enhanced Border Frame -->
          <div style="position: absolute; inset: 0; pointer-events: none;">
            <div style="position: absolute; inset: 12px; border: 2px solid ${accentColor}60; box-shadow: inset 0 0 50px ${accentColor}15;"></div>
            
            <!-- Corner Accents -->
            <div style="position: absolute; top: 12px; left: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; top: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; top: 12px; right: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; top: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; top: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; left: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; bottom: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; right: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; bottom: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; bottom: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
          </div>

          <!-- Logo Section -->
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; margin-bottom: 48px;">
              <img src="/live_cover_logo.jpg" alt="LIVE - Bar & Kitchen" style="width: 600px; height: auto; display: block; filter: brightness(1.1) contrast(1.1);" />
            </div>

            <!-- Divider -->
            <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 32px;">
              <div style="width: 128px; height: 2px; background: linear-gradient(90deg, transparent, ${accentColor}, transparent);"></div>
              <div style="width: 16px; height: 16px; transform: rotate(45deg); background-color: ${accentColor}; box-shadow: 0 0 20px ${accentColor};"></div>
              <div style="width: 128px; height: 2px; background: linear-gradient(-90deg, transparent, ${accentColor}, transparent);"></div>
            </div>

            <!-- Restaurant Info -->
            <div style="text-align: center;">
              <h2 style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: white; text-transform: uppercase; font-family: 'Cinzel', serif; margin: 0 0 24px 0;">
                Bar & Kitchen
              </h2>
              
              <div style="margin-bottom: 24px;">
                <p style="font-size: 16px; letter-spacing: 0.2em; color: #d1d5db; text-transform: uppercase; font-weight: 500; margin: 0 0 8px 0;">
                  Premium Dining & Spirits
                </p>
                <p style="font-size: 14px; letter-spacing: 0.15em; color: #9ca3af; margin: 0;">
                  Opp Pune Bakery, Wakad, Pune
                </p>
              </div>

              <!-- Contact Information -->
              <div style="padding-top: 24px; border-top: 1px solid rgba(55, 65, 81, 0.5);">
                <p style="font-size: 14px; color: #22d3ee; letter-spacing: 0.1em; font-family: 'Orbitron', sans-serif; margin: 0 0 12px 0;">
                  www.livebar.in
                </p>
                <p style="font-size: 12px; color: #6b7280; letter-spacing: 0.05em; margin: 0;">
                  Reservations: +91 7507066880
                </p>
              </div>

              <!-- Year -->
              <div style="padding-top: 32px;">
                <p style="font-size: 12px; letter-spacing: 0.25em; color: #4b5563; text-transform: uppercase; margin: 0;">
                  Menu • ${new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // A4 Dimensions: 210mm x 297mm (~794px x 1123px at 96dpi)
      pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column; overflow: hidden;">
        
        <!-- World-Class Boundary System A4 -->
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <div style="position: absolute; inset: 12px; border: 1px solid rgba(55,65,81,0.6);"></div>
          <div style="position: absolute; inset: 20px; border: 2px solid ${accentColor}40; box-shadow: inset 0 0 30px ${accentColor}10;"></div>
          
          <!-- Corner Accents -->
          <div style="position: absolute; top: 20px; left: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 0; left: 0; height: 100%; width: 3px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; top: 20px; right: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; top: 0; right: 0; width: 100%; height: 3px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 0; right: 0; height: 100%; width: 3px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; bottom: 20px; left: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 0; left: 0; height: 100%; width: 3px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; bottom: 0; right: 0; width: 100%; height: 3px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 0; right: 0; height: 100%; width: 3px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          
          <div style="position: absolute; top: 50%; left: 20px; width: 40px; height: 2px; transform: translateY(-50%); background: linear-gradient(90deg, ${accentColor}80, transparent);"></div>
          <div style="position: absolute; top: 50%; right: 20px; width: 40px; height: 2px; transform: translateY(-50%); background: linear-gradient(-90deg, ${accentColor}80, transparent);"></div>
        </div>

        <!-- Enhanced Header -->
        <div style="padding-top: 24px; padding-bottom: 12px; text-align: center; position: relative; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 24px;">
            <div style="flex: 1; max-width: 120px; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}60);"></div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <img src="/live_header_logo.png" alt="LIVE - Bar & Kitchen" style="height: 64px; width: auto; display: block; filter: brightness(1.1) contrast(1.05);" />
            </div>
            <div style="flex: 1; max-width: 120px; height: 1px; background: linear-gradient(-90deg, transparent, ${accentColor}60);"></div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 8px;">
            <div style="width: 48px; height: 1px; background: linear-gradient(to right, transparent, rgba(6,182,212,0.5), transparent);"></div>
            <span style="font-size: 8px; letter-spacing: 0.3em; color: rgba(34,211,238,0.8); text-transform: uppercase; font-weight: 600; font-family: 'Orbitron', sans-serif;">Eat • Drink • Code • Repeat</span>
            <div style="width: 48px; height: 1px; background: linear-gradient(to left, transparent, rgba(217,70,239,0.5), transparent);"></div>
          </div>
        </div>

        <!-- Section Title -->
        <div style="margin-bottom: 16px; padding-left: 48px; padding-right: 48px; position: relative; text-align: center;">
          <div style="position: absolute; top: 50%; left: 48px; right: 48px; height: 1px; background-color: rgba(31,41,55,0.5); z-index: 0;"></div>
          <span style="display: inline-block; padding: 8px 40px; background-color: #0a0a0f; font-size: 24px; font-weight: bold; letter-spacing: 0.3em; text-transform: uppercase; border-top: 1px solid ${accentColor}30; border-bottom: 1px solid ${accentColor}30; color: ${accentColor}; font-family: 'Orbitron', sans-serif; position: relative; z-index: 1; text-shadow: 0 0 20px ${accentColor}40;">
            ${escapeHtml(page.section.title)}
          </span>
        </div>

        <!-- Content -->
        <div style="flex: 1; padding-left: 48px; padding-right: 48px; padding-bottom: 24px; overflow: hidden;">
          <div style="max-width: 672px; margin: 0 auto;">
          ${page.section.categories.map((category, catIdx) => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 4px; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}88, transparent);"></div>
                ${category.icon ? `<span style="font-size: 16px;">${escapeHtml(category.icon)}</span>` : ""}
                <h3 style="font-size: 12px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: ${accentColor};">${escapeHtml(category.title)}</h3>
                ${showDietIcon ? `
                  <div style="margin-left: auto; border: 1px solid ${isVeg ? "#22c55e" : "#ef4444"}; padding: 2px; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; border-radius: 2px;">
                     <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${isVeg ? "#22c55e" : "#ef4444"};"></div>
                  </div>
                ` : ""}
              </div>
              ${category.items[0]?.sizes ? `
                <div style="display: flex; justify-content: flex-end; gap: 16px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                  ${category.items[0].sizes.length === 4 ? `
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">30ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">60ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">90ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">180ml</span>
                  ` : `
                    ${category.items[0].sizes.map((_, i) => `<span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right;">Size ${i + 1}</span>`).join("")}
                  `}
                </div>
              ` : category.items[0]?.halfPrice ? `
                 <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Half</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Full</span>
                 </div>
              ` : ""}
              <div style="display: flex; flex-direction: column; gap: 1px; margin-top: 4px;">
                ${category.items.map((item, idx) => `
                  <div style="padding: 10px 12px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.02);" : ""}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                      <div style="flex: 1;">
                        <h4 style="font-size: 14px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase;">${escapeHtml(item.name)}</h4>
                        ${item.description ? `<p style="font-size: 10px; color: #9ca3af; margin-top: 3px; font-style: italic; line-height: 1.5;">${escapeHtml(item.description)}</p>` : ""}
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        ${item.sizes ? `
                          <div style="display: flex; gap: 16px; justify-content: flex-end;">
                            ${item.sizes.map(size => `<span style="font-size: 12px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right; width: 50px;">${escapeHtml(size)}</span>`).join("")}
                          </div>
                        ` : item.halfPrice && item.fullPrice ? `
                          <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
                            <span style="font-size: 12px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.halfPrice)}</span>
                            <span style="font-size: 12px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.fullPrice)}</span>
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

        <!-- Enhanced Footer -->
        <div style="padding: 16px 48px; position: relative; z-index: 10; border-top: 1px solid rgba(55,65,81,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: left; flex: 1;">
              <p style="font-size: 9px; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; font-weight: 500; margin: 0 0 2px 0;">Live Bar & Kitchen</p>
              <p style="font-size: 8px; color: #4b5563; margin: 0;">Pune, Maharashtra</p>
            </div>
            <div style="text-align: center; flex-shrink: 0; padding: 0 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}50);"></div>
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <p style="font-size: 7px; text-transform: uppercase; letter-spacing: 0.15em; color: ${accentColor}; margin: 0 0 2px 0;">Page</p>
                  <p style="font-size: 18px; font-weight: bold; color: white; font-family: 'Orbitron', sans-serif; margin: 0;">${String(index + 1).padStart(2, '0')}<span style="font-size: 12px; color: #4b5563; margin-left: 4px;">/ ${String(pages.length).padStart(2, '0')}</span></p>
                </div>
                <div style="width: 32px; height: 1px; background: linear-gradient(-90deg, transparent, ${accentColor}50);"></div>
              </div>
            </div>
            <div style="text-align: right; flex: 1;">
              <p style="font-size: 9px; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; font-weight: 500; margin: 0 0 2px 0;">Premium Dining</p>
              <p style="font-size: 8px; color: #4b5563; margin: 0;">www.livebar.in</p>
            </div>
          </div>
        </div>
      </div>
    `;
    }
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
        width: 794, // A4 width
        height: 1123, // A4 height
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
        format: "a5", // A5 Format
        compress: true
      });

      const pagesToExport = allPages ? pages.map((_, i) => i) : [currentPage];
      const pdfWidth = 148; // A5 width
      const pdfHeight = 210; // A5 height
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

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Menu - ${pages[currentPage].section.title}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                @page { size: A5; margin: 0; }
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
                isCover={(pages[currentPage] as any).isCover}
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
