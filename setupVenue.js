#!/usr/bin/env node

/**
 * Venue Setup Wizard
 * 
 * Interactive script to quickly configure a new venue
 * Run: node setupVenue.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    { key: 'name', question: 'Restaurant/Bar Name (e.g., LIVE BAR): ' },
    { key: 'tagline', question: 'Tagline (e.g., Eat.Drink.Code.Repeat): ' },
    { key: 'subtitle', question: 'Subtitle (e.g., FINE DINING • PUNE): ' },
    { key: 'establishedYear', question: 'Established Year (e.g., 2024): ' },
    { key: 'logoText', question: 'Logo Text (e.g., LIVE): ' },
    { key: 'logoSubtext', question: 'Logo Subtext (e.g., Eat • Drink • Code • Repeat): ' },
    { key: 'city', question: 'City (e.g., Pune): ' },
    { key: 'address', question: 'Full Address: ' },
    { key: 'phone', question: 'Phone Number (optional, press Enter to skip): ', optional: true },
    { key: 'email', question: 'Email (optional, press Enter to skip): ', optional: true },
    { key: 'qrCodeLabel', question: 'QR Code Label (e.g., Scan for Location): ' },
];

const answers = {};
let currentQuestionIndex = 0;

function askQuestion() {
    if (currentQuestionIndex >= questions.length) {
        generateConfig();
        return;
    }

    const current = questions[currentQuestionIndex];
    rl.question(current.question, (answer) => {
        if (answer.trim() || current.optional) {
            answers[current.key] = answer.trim();
        }
        currentQuestionIndex++;
        askQuestion();
    });
}

function generateConfig() {
    console.log('\n🎉 Generating venue configuration...\n');

    const configContent = `/**
 * Venue Configuration
 * 
 * This is the SINGLE SOURCE OF TRUTH for all venue-specific information.
 * Generated on: ${new Date().toISOString()}
 */

export interface VenueConfig {
  name: string;
  tagline: string;
  subtitle: string;
  establishedYear: string;
  logoText: string;
  logoSubtext: string;
  city: string;
  address: string;
  googleMapsUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  qrCodeUrl?: string;
  qrCodeLabel?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  features?: {
    enableOnlineOrdering?: boolean;
    enableReservations?: boolean;
    enableLoyaltyProgram?: boolean;
    enableReviews?: boolean;
    enableARExperience?: boolean;
  };
  copyrightText?: string;
}

export const venueConfig: VenueConfig = {
  // Basic Information
  name: "${answers.name || 'YOUR RESTAURANT'}",
  tagline: "${answers.tagline || 'Your Tagline'}",
  subtitle: "${answers.subtitle || 'RESTAURANT TYPE • CITY'}",
  establishedYear: "${answers.establishedYear || new Date().getFullYear()}",
  
  // Branding
  logoText: "${answers.logoText || answers.name || 'LOGO'}",
  logoSubtext: "${answers.logoSubtext || 'Your • Sub • Text'}",
  
  // Location
  city: "${answers.city || 'Your City'}",
  address: "${answers.address || 'Your Address'}",
  googleMapsUrl: "https://maps.google.com/?q=${encodeURIComponent(answers.address || 'Your Address')}",
  
  // Contact${answers.phone ? `\n  phone: "${answers.phone}",` : ''}${answers.email ? `\n  email: "${answers.email}",` : ''}
  
  // QR Code
  qrCodeLabel: "${answers.qrCodeLabel || 'Scan for Location'}",
  
  // Features
  features: {
    enableOnlineOrdering: false,
    enableReservations: false,
    enableLoyaltyProgram: true,
    enableReviews: true,
    enableARExperience: true,
  },
  
  // Footer
  copyrightText: "© ${answers.establishedYear || new Date().getFullYear()} ${answers.name || 'YOUR RESTAURANT'} • ${answers.subtitle || 'Fine Dining'}",
};

export const getVenueConfig = (): VenueConfig => venueConfig;
`;

    const configPath = path.join(__dirname, 'src', 'config', 'venueConfig.ts');

    try {
        fs.writeFileSync(configPath, configContent);
        console.log('✅ Venue configuration created successfully!');
        console.log(`📁 File saved to: ${configPath}\n`);
        console.log('📋 Next Steps:');
        console.log('1. Replace src/assets/qr-code.png with your QR code');
        console.log('2. Update .env with your Supabase credentials');
        console.log('3. Run: npm run dev');
        console.log('4. Go to http://localhost:5173/admin and sync menu\n');
        console.log('🎉 Your venue is ready to go!\n');
    } catch (error) {
        console.error('❌ Error creating config file:', error.message);
    }

    rl.close();
}

console.log('���� Welcome to the Venue Setup Wizard!\n');
console.log('This will help you configure your menu app for a new venue.\n');
console.log('Press Ctrl+C to cancel at any time.\n');

askQuestion();
