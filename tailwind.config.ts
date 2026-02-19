import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1120",
        "navy-light": "#111827",
        accent: "#F5E50A",
        cta: "#16C784",
        secondary: "#2563EB",
        "text-base": "#FFFFFF",
        "text-muted": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 32px 0 rgba(0,0,0,0.4)",
        "glow-cta": "0 0 24px rgba(22,199,132,0.25)",
        "glow-secondary": "0 0 24px rgba(37,99,235,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
