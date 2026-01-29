import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./client/src/test/setup.ts"],
    include: ["client/src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["client/src/**/*.{ts,tsx}"],
      exclude: ["client/src/components/ui/**", "client/src/test/**", "**/*.d.ts"],
    },
  },
});
