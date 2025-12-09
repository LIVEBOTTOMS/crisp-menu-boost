# Menu Pricing & Quality Audit Report

**Date:** 2025-12-09
**Status:** Action Required

After a comprehensive review of your menu data (`src/data/menuData.ts`), I have identified several critical logical errors, inconsistencies, and opportunities for optimization.

---

## 🚨 Critical logical Errors (Must Fix)

### 1. "Indian Reserve Whiskies" Pricing Logic
**Issue:** For several brands, buying **bulk (90ml or 180ml) is MORE expensive** than buying individual 30ml pegs. This discourages customers from ordering larger pours.

*   **Royal Stag**
    *   30ml: ₹115
    *   90ml: **₹379** (Buying 3x 30ml = ₹345. You lose ₹34 ordering the large.)
    *   180ml: **₹749** (Buying 6x 30ml = ₹690. You lose ₹59 ordering the quarter.)
*   **Royal Stag Barrel / Signature**
    *   30ml: ₹135
    *   90ml: **₹449** (vs ₹405 for 3x pegs)
    *   180ml: **₹849** (vs ₹810 for 6x pegs)
*   **McDowell's No.1 / Rockford Classic**
    *   30ml: ₹129
    *   90ml: **₹429** (vs ₹387 for 3x pegs)
*   **DSP Black / Oaken Glow**
    *   30ml: ₹139
    *   90ml: **₹469** (vs ₹417 for 3x pegs)

**Recommendation:** Adjust 90ml price to be ~2.8x of 30ml, and 180ml to be ~5.5x of 30ml (or at least strictly less than 3x and 6x).

### 2. Duplicate Check
*   **Chicken Lollipop**: Appears twice with different prices/spellings.
    *   Under *Non-Veg Appetizers*: "Chicken Lollypop" - **₹250**
    *   Under *Gourmet Bar Bites*: "Chicken Lollipop" - **₹299**
    *   **Action:** Standardize spelling and decide on a single price.

### 3. Potential Miscategorization
*   **Veg Spring Roll** (₹418) & **Honey Chilli Potato** (₹384) are listed under **"Vegetarian Chef's Mains"**.
    *   These are typically **Appetizers/Starters**.
    *   The prices (~₹400) are high for a starter compared to Veg Munchies (~₹180). If they are Main Course portions (Gravy), the category is fine. If they are dry starters, they are misplaced and overpriced.

---

## 🔍 Pricing Anomalies & Formatting

### 1. "Tax-Calculated" Odd Prices
Many items have specific, non-standard prices strings that look like raw calculations rather than psychological menu prices.
*   **Fried Papad:** ₹116 -> Suggest **₹119**
*   **Masala Papad:** ₹126 -> Suggest **₹129**
*   **Paneer Pakoda:** ₹194 -> Suggest **₹199**
*   **Cheese Pakoda:** ₹213 -> Suggest **₹219**
*   **Peri Peri Fries:** ₹212 -> Suggest **₹219**
*   **Chicken 65:** **₹452** (Very high compared to Paneer 65 at ₹220. Is this a typo for ₹252?)
*   **Sula Red Wine (Half):** ₹1,066 -> Suggest **₹1,099**

**Recommendation:** Round all prices to end in 0, 5, or 9 for a cleaner, premium appeal.

### 2. Spelling & Typos
*   `Corn Crisipie` -> **Corn Crispy**
*   `Paneer & Chillie` -> **Paneer & Chilli**
*   `Blender's Pride` -> **Blenders Pride** (No apostrophe, usually)

---

## 💡 Strategic Observations

### 1. "World Whisky" Linear Pricing
*   Brands like *Ballantine's* and *Black & White* have exact linear pricing (90ml is exactly 3x, 180ml is exactly 6x).
*   While not an "error", offering a small discount on the Quarter (180ml) often encourages upselling.

### 2. Volume Transparency
*   The Menu Display shows "30ml | 60ml | 90ml | 180ml" headers for all spirits.
*   The underlying data for some sections (like Indian Reserve) just lists 4 prices without explicit labels in the data. Ensure the headers in the print preview (which are hardcoded) match these implied sizes. (They do appear to match the standard Peg/Large/Quarter system).

---

**Next Steps:**
1.  **Approve auto-correction** for rounding odd prices (e.g. 116->119).
2.  **Clarify "Royal Stag"** and related reserve whisky pricing strategy.
3.  **Confirm Chicken 65 price** (₹452 vs ₹252?).
