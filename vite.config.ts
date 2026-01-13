import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 800,

    // Optimize bundle with rollup options
    rollupOptions: {
      output: {
        // Simplified manual chunks
        manualChunks(id) {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Animation
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Radix UI
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Query
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
          }
        },
      },
    },
  },
}));
