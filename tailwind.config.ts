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
        primary: {
          DEFAULT: "#1a6b3c",
          50: "#f0faf4",
          100: "#dcf3e6",
          200: "#bbe6ce",
          300: "#8ed2ae",
          400: "#5ab788",
          500: "#359b6a",
          600: "#257d53",
          700: "#1a6b3c",
          800: "#185535",
          900: "#14452c",
        },
        secondary: {
          DEFAULT: "#c9a84c",
          50: "#fdf9ee",
          100: "#faf1d3",
          200: "#f4e0a3",
          300: "#ecc96a",
          400: "#e4b240",
          500: "#d99929",
          600: "#c9a84c",
          700: "#a37a1e",
          800: "#85601d",
          900: "#6e4f1c",
        },
        accent: "#e8f5ee",
        background: "#fdfaf5",
        foreground: "#1c1c1e",
        muted: "#6b7280",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
