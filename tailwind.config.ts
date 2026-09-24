import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Yeni palet — Coral / Teal / Sun / Indigo */
        coral:  "var(--coral)",
        teal:   "var(--teal)",
        sun:    "var(--sun)",
        indigo: "var(--indigo)",
        ink:    "var(--ink)",
        paper:  "var(--paper)",
        /* Geriye dönük uyumluluk alias'ları */
        brand: {
          1: "var(--brand-1)",
          2: "var(--brand-2)",
          3: "var(--brand-3)",
          4: "var(--brand-4)",
          5: "var(--brand-5)",
          6: "var(--brand-6)",
        },
        bg: {
          DEFAULT: "var(--bg)",
          soft: "var(--bg-soft)",
          elevated: "var(--bg-elevated)",
        },
        foreground: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        border: "var(--border)",
        xp: "var(--xp)",
        streak: "var(--streak)",
        badge: "var(--badge)",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],   /* serif başlıklar */
        reading: ["Fraunces", "Georgia", "serif"],
      },
      animation: {
        "pulse-slow":    "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "float":         "float 6s ease-in-out infinite",
        "slide-up":      "slideUp 0.4s ease-out forwards",
      },
      keyframes: {
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-8px) rotate(1deg)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

