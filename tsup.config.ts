import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { defineConfig } from "tsup";

const require = createRequire(import.meta.url);

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
    // Everything below is plain CSS (custom properties, hand-written Prism
    // token classes, KaTeX's own stylesheet) — no @tailwind directives — so
    // concatenating and shipping it verbatim is enough. Consumers wire up
    // their own Tailwind build against dist/**/*.{js,mjs} for component
    // utility classes.
    await mkdir("dist", { recursive: true });
    const katexCssPath = require.resolve("katex/dist/katex.min.css");
    const parts = await Promise.all(
      ["src/styles/tokens.css", "src/styles/prism-theme.css", "src/styles/shared.css", katexCssPath].map(
        (path) => readFile(path, "utf8"),
      ),
    );
    await writeFile("dist/styles.css", parts.join("\n"));
    // KaTeX's stylesheet references its font files with a relative
    // `url(fonts/...)`, so `dist/fonts` has to sit next to `dist/styles.css`
    // for math rendering to pick up the real glyphs instead of falling back.
    await cp(`${dirname(katexCssPath)}/fonts`, "dist/fonts", { recursive: true });
  },
});
