import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      filename: "dist/stats.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    watch: {
      ignored: ["**/data/**"],
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React ecosystem
          if (id.includes("react-router")) return "router-vendor";
          if (id.includes("@tanstack")) return "query-vendor";
          if (id.includes("/react-dom/")) return "react-dom-vendor";
          if (id.includes("/react/") || id.includes("/scheduler/")) {
            return "react-vendor";
          }

          if (id.includes("leaflet") || id.includes("react-leaflet")) {
            return "map-vendor";
          }

          // 📝 Form + validation
          if (id.includes("react-hook-form") || id.includes("@hookform")) {
            return "form-vendor";
          }
          if (id.includes("/zod/")) return "zod-vendor";

          // 🌐 HTTP
          if (id.includes("axios")) return "http-vendor";

          // 🎨 UI utilities
          if (
            id.includes("sonner") ||
            id.includes("tailwind-merge") ||
            id.includes("clsx") ||
            id.includes("class-variance-authority")
          ) {
            return "ui-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
