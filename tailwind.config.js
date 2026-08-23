/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0c0e16",
        surface: {
          DEFAULT: "#121522",
          light: "#171c2d",
          lighter: "#1f253b",
          border: "#242a40",
          borderLight: "#333b58",
        },
        solar: {
          DEFAULT: "#ff9d00",
          hover: "#ffad26",
          dark: "#e07b00",
          amber: "#f59e0b",
          gold: "#ffd000",
          glow: "rgba(255, 157, 0, 0.45)",
          corona: "rgba(255, 157, 0, 0.15)",
        },
        mcgreen: {
          DEFAULT: "#22c55e",
          hover: "#4ade80",
          dark: "#16a34a",
        },
      },
      boxShadow: {
        'solar-glow': '0 0 25px rgba(255, 157, 0, 0.45)',
        'solar-glow-lg': '0 0 40px rgba(255, 157, 0, 0.6)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
