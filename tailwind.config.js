/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Orange
        secondary: "#22C55E", // Green
        accent: "#FDE68A", // Amber
        background: "#FAFAFA", // Off-white
        text: "#1E293B", // Slate
      },
      fontFamily: {
        bangla: ["Hind Siliguri", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};