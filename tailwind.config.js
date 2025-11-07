/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1c3d6c", // Hauptblau
          light: "#4e73b6",
          dark: "#13294b",
        },
        accent: {
          DEFAULT: "#2b6cb0", // Buttons, Links
          light: "#63b3ed",
        },
        neutral: {
          light: "#f8faff",
          DEFAULT: "#f3f5f8",
          dark: "#e9edf2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.05)",
        glow: "0 0 10px rgba(59,130,246,0.2)",
      },
    },
  },
  plugins: [],
};
