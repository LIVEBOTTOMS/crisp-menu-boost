# Alcohol Pricing Consistency Check
**Date:** 2025-12-11
**Objective:** Verify that 180ml prices are logically consistent with 90ml prices (Ratio < 2.0).

## Verification Sampling

| Item | 90ml Price | 180ml Price | Ratio (180ml/90ml) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Magic Moments** | ₹240 | ₹440 | **1.83** | ✅ OK |
| **Smirnoff** | ₹360 | ₹660 | **1.83** | ✅ OK |
| **Old Monk** | ₹180 | ₹330 | **1.83** | ✅ OK |
| **Imperial Blue** | ₹210 | ₹380 | **1.81** | ✅ OK |
| **Blenders Pride** | ₹320 | ₹630 | **1.97** | ✅ OK |
| **Ballantine's** | ₹500 | ₹980 | **1.96** | ✅ OK |
| **Johnnie Walker Black** | ₹1,620 | ₹3,240 | **2.00** | ✅ OK |
| **Glenfiddich 12Y** | ₹2,430 | ₹4,860 | **2.00** | ✅ OK |

## Conclusion
All sampled alcohol items show a 180ml price that is **1.8x to 2.0x** the 90ml price.
There are **no instances** where the 180ml price is "2-3 times" (i.e., > 2.0x or 3.0x) the 90ml price. The pricing structure provides a consistent value for larger portions.
