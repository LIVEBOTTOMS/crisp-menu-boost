# MenuX PWA Icons

This directory contains all the icons needed for the Progressive Web App (PWA) implementation.

## Required Icons

You need to generate the following icon sizes:

- **icon-72x72.png** (72x72px)
- **icon-96x96.png** (96x96px)  
- **icon-128x128.png** (128x128px)
- **icon-144x144.png** (144x144px)
- **icon-152x152.png** (152x152px)
- **icon-192x192.png** (192x192px) - **Required for PWA**
- **icon-384x384.png** (384x384px)
- **icon-512x512.png** (512x512px) - **Required for PWA**

## How to Generate Icons

### Option 1: Use an Online Tool
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo (ideally 512x512px or larger)
3. Download the generated icon pack
4. Place all icons in this directory

### Option 2: Use ImageMagick (Command Line)
```bash
# Starting from a 512x512 source image
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

### Option 3: Use Figma/Photoshop
1. Create a 512x512px artboard
2. Design your icon with the "M" logo and violet/amber gradient
3. Export at all the sizes listed above

## Design Guidelines

- **Background**: Violet/amber gradient (#8B5CF6 to #F59E0B)
- **Icon**: White "M" letter, bold, centered
- **Padding**: Leave 10% padding around the edges
- **Shape**: Rounded rectangle (20px border radius for 512px version)
- **Shadow**: Optional subtle shadow for depth

## Temporary Placeholder

Until you generate the actual icons, you can use the online generator at:
https://favicon.io/favicon-generator/

Or create a simple colored square with the "M" letter as a temporary solution.
