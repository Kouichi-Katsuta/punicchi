import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

export default defineConfig({
  plugins: [react()],
  base: "./",
  // 画面下部に表示するバージョン（package.json の version）
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
});
