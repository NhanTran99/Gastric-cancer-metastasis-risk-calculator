import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      html2canvas: path.resolve(__dirname, "src/stubs/empty.ts"),
      canvg: path.resolve(__dirname, "src/stubs/empty.ts"),
    },
  },
});