import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Autism & Me brand kit 1.1, dark mode: dark-teal ground #05222B, cream
      // text, orange for the one call to action (black text on it), deep
      // orange, dusty blue, sage and terracotta for states.
      colors: {
        base: {
          DEFAULT: "#05222B",
          950: "#041C24",
          900: "#072A35",
          800: "#0A3340",
          700: "#0D3C4A",
          600: "#164B5B",
          500: "#1E5B6D",
        },
        ink: {
          DEFAULT: "#F8F5EF",
          muted: "#C9D7DB",
          subtle: "#9DB4BB",
          faint: "#5E7E87",
        },
        live: {
          DEFAULT: "#F2863D",
          dim: "#B7510C",
        },
        pos: {
          DEFAULT: "#A9C9A4",
        },
        neg: {
          DEFAULT: "#E9A38A",
        },
        info: {
          DEFAULT: "#8FAECA",
        },
        brand: {
          teal: "#074151",
          orange: "#F2863D",
          deeporange: "#B7510C",
          dusty: "#8FAECA",
          mint: "#E9F4F6",
          sage: "#9CAF9C",
          terracotta: "#C97B5A",
          cream: "#F8F5EF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Poppins", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "Poppins", "Arial", "sans-serif"],
      },
      letterSpacing: {
        "ui-tight": "-0.005em",
        "ui-wide": "0.02em",
        "ui-mega": "0.08em",
      },
      animation: {
        "fade-up": "fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "caret-blink": "caret-blink 1s steps(1) infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "caret-blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
