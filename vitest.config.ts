import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      enabled: false
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, ".")
    }
  }
});

