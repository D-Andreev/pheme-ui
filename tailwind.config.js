/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: issue #2's snippet had "./src/**/.{js,ts,jsx,tsx,html}" (missing the
  // "*" before the dot) — fixed here to the working glob; task.md's earlier
  // capture of the same config already had the "*" in place.
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        divider: "var(--color-divider)",

        accent: {
          DEFAULT: "var(--color-accent)",
          ink: "var(--color-accent-ink, var(--color-accent-300))", // text/icon step; -700 on light theme
          100: "var(--color-accent-100)",
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
        },
        accent2: {
          DEFAULT: "var(--color-accent-2)",
          100: "var(--color-accent-2-100)",
          200: "var(--color-accent-2-200)",
          300: "var(--color-accent-2-300)",
          400: "var(--color-accent-2-400)",
          500: "var(--color-accent-2-500)",
          600: "var(--color-accent-2-600)",
          700: "var(--color-accent-2-700)",
          800: "var(--color-accent-2-800)",
          900: "var(--color-accent-2-900)",
        },
        neutral: {
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },

        // NEW families — not in the base Nocturne sheet, promoted from the
        // chat-components board (see previous message for provenance).
        danger: {
          DEFAULT: "var(--color-danger)",
          300: "var(--color-danger-300)", // text/icon on dark ground
          600: "var(--color-danger-600)", // border on light theme
          700: "var(--color-danger-700)", // text on light theme
        },
        success: {
          DEFAULT: "var(--color-success)",
          300: "var(--color-success-300)", // numerals/diff-add on dark ground
          700: "var(--color-success-700)", // numerals on light theme
        },

        section: {
          DEFAULT: "var(--color-section)",
          glow: "var(--color-section-glow)",
          ghost: "var(--color-section-ghost)",
        },

        // Light-theme-only literal (§08's inverse code-ground rule)
        "code-ground": "var(--color-code-ground, color-mix(in srgb, #000 22% , var(--color-surface)))",
      },

      fontFamily: {
        heading: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"], // alias so default `font-sans` matches the system
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // NEW — the board's one Inter departure, math only (§03)
        math: ["Times New Roman", "Times", "serif"],
      },

      borderRadius: {
        sm: "var(--radius-sm)", // 4px
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)", // 8px
        lg: "var(--radius-lg)", // 14px
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      // Nocturne's density-0.7x scale, namespaced — see note above.
      spacing: {
        "ds-1": "var(--space-1)", // 2.8px
        "ds-2": "var(--space-2)", // 5.6px
        "ds-3": "var(--space-3)", // 8.4px
        "ds-4": "var(--space-4)", // 11.2px
        "ds-6": "var(--space-6)", // 16.8px
        "ds-8": "var(--space-8)", // 22.4px
      },

      keyframes: {
        "noct-caret": {
          "0%, 45%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
        "noct-shimmer": {
          "0%": { backgroundPosition: "-240px 0" },
          "100%": { backgroundPosition: "240px 0" },
        },
        // noct-spin intentionally omitted — identical to Tailwind's built-in `spin`
      },
      animation: {
        caret: "noct-caret var(--motion-caret-duration, 1s) steps(1) infinite",
        shimmer: "noct-shimmer var(--motion-shimmer-duration, 1.4s) linear infinite",
        // spinner: use Tailwind's stock `animate-spin`
      },
      backgroundSize: {
        shimmer: "240px 100%", // pairs with animate-shimmer + bg-gradient-to-r
      },
    },
  },
  plugins: [],
};
