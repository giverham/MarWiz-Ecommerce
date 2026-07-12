/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f5f4",
          100: "#e7e5e4",
          200: "#d6d3d1",
          300: "#a8a29e",
          400: "#78716c",
          500: "#57534e",
          600: "#44403c",
          700: "#292524",
          800: "#1c1917",
          900: "#0c0a09",
          950: "#050403",
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
        "marquee": "marquee 30s linear infinite",
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
