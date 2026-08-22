import { copyFile, mkdir } from "node:fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom"],
  async onSuccess() {
    // Tokens are plain CSS custom properties (no @tailwind directives), so
    // shipping them verbatim is enough — consumers wire up their own
    // Tailwind build against dist/**/*.{js,mjs} for component utility classes.
    await mkdir("dist", { recursive: true });
    await copyFile("src/styles/tokens.css", "dist/styles.css");
  },
});
