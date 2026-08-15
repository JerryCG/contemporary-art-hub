import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f3eee4",
          deep: "#e7dfd0",
          raised: "#faf6ee",
        },
        ink: {
          DEFAULT: "#1a1714",
          soft: "#5c564c",
          faint: "#8a8376",
        },
        sky: {
          DEFAULT: "#2f7dd1",
          bright: "#4ea3ef",
        },
        gold: "#c4a35a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        frame: "0 24px 60px -28px rgba(26,23,20,0.45)",
        card: "0 10px 30px -18px rgba(26,23,20,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
