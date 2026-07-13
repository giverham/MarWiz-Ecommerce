/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "var(--color-ink-50)",
          100: "var(--color-ink-100)",
          200: "var(--color-ink-200)",
          300: "var(--color-ink-300)",
          400: "var(--color-ink-400)",
          500: "var(--color-ink-500)",
          600: "var(--color-ink-600)",
          700: "var(--color-ink-700)",
          800: "var(--color-ink-800)",
          900: "var(--color-ink-900)",
          950: "var(--color-ink-950)",
        },
        gold: {
          50: "#fbf7ef",
          100: "#f5ebd6",
          200: "#ecd5ac",
          300: "#ddba78",
          400: "#c9a96e",
          500: "#b8945a",
          600: "#9a7a48",
          700: "#7a603a",
          800: "#5e4a2e",
          900: "#4a3a24",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      fontSize: {
        "hero": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "section": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-down": "fadeDown 0.8s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "slide-in-left": "slideInLeft 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "marquee": "marquee 60s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
