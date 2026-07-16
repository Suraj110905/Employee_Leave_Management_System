import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Production build optimizations
  build: {
    // Target modern browsers — reduces polyfill overhead
    target: "es2020",

    // Emit source maps only in non-production (set via env)
    sourcemap: false,

    // Warn on chunks > 500 kB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Granular vendor code-splitting for better long-term caching
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/")) return "vendor-react";
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("axios")) return "vendor-axios";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("clsx") || id.includes("tailwind-merge") || id.includes("class-variance-authority")) return "vendor-ui";
          }
        },
      },
    },
  },

  // Development server proxy (keeps /api calls simple during local dev)
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});