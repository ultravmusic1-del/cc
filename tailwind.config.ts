import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#611224",
          deep: "#4a0d1b",
          dark: "#3a0a15",
          soft: "#71182b",
        },
        coral: "#ec5b45",
        olive: "#9f9536",
        pink: "#e9adbe",
        beige: "#e3d2c2",
        cream: "#f4e8dc",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px -30px rgba(20, 4, 9, 0.85)",
        float: "0 40px 80px -24px rgba(15, 3, 7, 0.75)",
        pill: "0 10px 30px -12px rgba(236, 91, 69, 0.55)",
      },
      borderRadius: {
        xl2: "1.75rem",
        xl3: "2rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
